import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { AR_CONFIG, GARMENT_CATEGORIES } from '../../config/ar.config';

export interface VirtualTryOnRequest {
  userImage: string; // base64 or URL
  garmentImage: string;
  category: string;
  bodyPart: 'upper' | 'lower' | 'full';
}

export interface VirtualTryOnResult {
  resultImage: string;
  confidence: number;
  processingTime: number;
  adjustments?: {
    scale?: number;
    position?: { x: number; y: number };
  };
}

export interface FaceARResult {
  landmarks: Array<{ x: number; y: number }>;
  boundingBox: { x: number; y: number; width: number; height: number };
  filters?: string[];
}

class ARService {
  /**
   * Virtual Try-On using Vue.ai API
   */
  async virtualTryOn(request: VirtualTryOnRequest): Promise<VirtualTryOnResult> {
    try {
      // Prepare images
      const userImageBase64 = await this.prepareImage(request.userImage);
      const garmentImageBase64 = await this.prepareImage(request.garmentImage);

      // Call Vue.ai API
      const response = await axios.post(
        `${AR_CONFIG.VUE_AI.API_URL}/tryon`,
        {
          person_image: userImageBase64,
          garment_image: garmentImageBase64,
          category: request.category,
          body_part: request.bodyPart,
        },
        {
          headers: {
            'Authorization': `Bearer ${AR_CONFIG.VUE_AI.API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: AR_CONFIG.TIMEOUT,
        }
      );

      return {
        resultImage: response.data.result_image,
        confidence: response.data.confidence || 0.95,
        processingTime: response.data.processing_time || 2000,
        adjustments: response.data.adjustments,
      };
    } catch (error) {
      console.error('Virtual try-on error:', error);
      
      // Fallback to alternative API
      return this.fallbackTryOn(request);
    }
  }

  /**
   * Fallback using Tryolabs API
   */
  private async fallbackTryOn(
    request: VirtualTryOnRequest
  ): Promise<VirtualTryOnResult> {
    try {
      const userImageBase64 = await this.prepareImage(request.userImage);
      const garmentImageBase64 = await this.prepareImage(request.garmentImage);

      const response = await axios.post(
        `${AR_CONFIG.TRYOLABS.API_URL}/virtual-fitting`,
        {
          user_image: userImageBase64,
          product_image: garmentImageBase64,
          garment_type: request.bodyPart,
        },
        {
          headers: {
            'X-API-Key': AR_CONFIG.TRYOLABS.API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        resultImage: response.data.output_image,
        confidence: 0.9,
        processingTime: 3000,
      };
    } catch (error) {
      console.error('Fallback try-on error:', error);
      throw new Error('Virtual try-on failed. Please try again.');
    }
  }

  /**
   * Face AR for accessories (using Banuba)
   */
  async applyFaceAR(
    faceImage: string,
    accessoryType: 'glasses' | 'hat' | 'earrings' | 'makeup',
    accessoryAsset: string
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${AR_CONFIG.BANUBA.API_URL}/face-ar/apply`,
        {
          face_image: await this.prepareImage(faceImage),
          accessory_type: accessoryType,
          accessory_asset: accessoryAsset,
        },
        {
          headers: {
            'Authorization': `Bearer ${AR_CONFIG.BANUBA.TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.result_image;
    } catch (error) {
      console.error('Face AR error:', error);
      throw error;
    }
  }

  /**
   * Detect body landmarks for better fitting
   */
  async detectBodyPose(image: string): Promise<any> {
    try {
      const response = await axios.post(
        `${AR_CONFIG.VUE_AI.API_URL}/pose-detection`,
        {
          image: await this.prepareImage(image),
        },
        {
          headers: {
            'Authorization': `Bearer ${AR_CONFIG.VUE_AI.API_KEY}`,
          },
        }
      );

      return response.data.landmarks;
    } catch (error) {
      console.error('Pose detection error:', error);
      return null;
    }
  }

  /**
   * Get size recommendation based on body measurements
   */
  async getSizeRecommendation(
    userImage: string,
    garmentSpecs: any
  ): Promise<string> {
    try {
      const pose = await this.detectBodyPose(userImage);
      
      const response = await axios.post(
        `${AR_CONFIG.VUE_AI.API_URL}/size-recommendation`,
        {
          body_landmarks: pose,
          garment_specs: garmentSpecs,
        },
        {
          headers: {
            'Authorization': `Bearer ${AR_CONFIG.VUE_AI.API_KEY}`,
          },
        }
      );

      return response.data.recommended_size;
    } catch (error) {
      console.error('Size recommendation error:', error);
      return 'M'; // Default fallback
    }
  }

  /**
   * Prepare image for API (resize, compress, convert to base64)
   */
  private async prepareImage(imageUri: string): Promise<string> {
    try {
      // If already base64
      if (imageUri.startsWith('data:image')) {
        return imageUri.split(',')[1];
      }

      // If it's a URL, download first
      if (imageUri.startsWith('http')) {
        const downloadPath = `${FileSystem.cacheDirectory}temp_${Date.now()}.jpg`;
        await FileSystem.downloadAsync(imageUri, downloadPath);
        imageUri = downloadPath;
      }

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return base64;
    } catch (error) {
      console.error('Image preparation error:', error);
      throw error;
    }
  }

  /**
   * Cache try-on results
   */
  async cacheTryOnResult(key: string, result: VirtualTryOnResult): Promise<void> {
    try {
      const cachePath = `${FileSystem.cacheDirectory}tryon_${key}.jpg`;
      await FileSystem.writeAsStringAsync(cachePath, result.resultImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.error('Cache error:', error);
    }
  }

  /**
   * Get cached result
   */
  async getCachedResult(key: string): Promise<string | null> {
    try {
      const cachePath = `${FileSystem.cacheDirectory}tryon_${key}.jpg`;
      const info = await FileSystem.getInfoAsync(cachePath);
      
      if (info.exists) {
        return await FileSystem.readAsStringAsync(cachePath, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default new ARService();
