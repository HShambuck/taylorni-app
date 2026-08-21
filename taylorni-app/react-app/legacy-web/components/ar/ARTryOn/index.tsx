import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import arService from '../../../services/ar/arService';
import { VirtualTryOnResult } from '../../../services/ar/arService';
import ARControls from './ARControls';
import GarmentOverlay from './GarmentOverlay';
import styles from './styles';

const { width, height } = Dimensions.get('window');

interface ARTryOnProps {
  garmentId: string;
  garmentImage: string;
  garmentCategory: string;
  garmentName: string;
  bodyPart: 'upper' | 'lower' | 'full';
  onClose: () => void;
  onSave?: (resultImage: string) => void;
}

const ARTryOn: React.FC<ARTryOnProps> = ({
  garmentId,
  garmentImage,
  garmentCategory,
  garmentName,
  bodyPart,
  onClose,
  onSave,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<VirtualTryOnResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'camera' | 'upload' | 'result'>('camera');
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
  };

  /**
   * Capture photo from camera
   */
  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      setUserImage(photo.uri);
      processVirtualTryOn(photo.uri);
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  /**
   * Upload photo from gallery
   */
  const handleUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setUserImage(result.assets[0].uri);
        setMode('upload');
        processVirtualTryOn(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload photo');
    }
  };

  /**
   * Process virtual try-on
   */
  const processVirtualTryOn = async (photoUri: string) => {
    setIsProcessing(true);

    try {
      // Check cache first
      const cacheKey = `${garmentId}_${Date.now()}`;
      const cached = await arService.getCachedResult(cacheKey);

      if (cached) {
        setTryOnResult({
          resultImage: cached,
          confidence: 0.95,
          processingTime: 0,
        });
        setMode('result');
        return;
      }

      // Process with AI
      const result = await arService.virtualTryOn({
        userImage: photoUri,
        garmentImage: garmentImage,
        category: garmentCategory,
        bodyPart: bodyPart,
      });

      setTryOnResult(result);
      setMode('result');

      // Cache the result
      await arService.cacheTryOnResult(cacheKey, result);

      // Show confidence score if low
      if (result.confidence < 0.8) {
        Alert.alert(
          'Low Confidence',
          'The try-on result might not be accurate. Try taking a clearer photo with better lighting.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Try-on error:', error);
      Alert.alert(
        'Try-On Failed',
        error.message || 'Failed to process virtual try-on. Please try again.',
        [
          { text: 'Retry', onPress: () => setMode('camera') },
          { text: 'Cancel', onPress: onClose },
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Retake photo
   */
  const handleRetake = () => {
    setUserImage(null);
    setTryOnResult(null);
    setMode('camera');
  };

  /**
   * Save result
   */
  const handleSave = () => {
    if (tryOnResult && onSave) {
      onSave(tryOnResult.resultImage);
    }
    onClose();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-off-outline" size={64} color="#ccc" />
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'transparent']}
        style={styles.header}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Virtual Try-On</Text>
          <Text style={styles.headerSubtitle}>{garmentName}</Text>
        </View>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Camera View */}
      {mode === 'camera' && (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
            ratio="16:9"
          >
            <GarmentOverlay
              garmentImage={garmentImage}
              bodyPart={bodyPart}
              opacity={0.3}
            />
          </Camera>

          {/* Camera Controls */}
          <View style={styles.cameraControls}>
            <TouchableOpacity
              onPress={handleUpload}
              style={styles.controlButton}
            >
              <Ionicons name="images-outline" size={28} color="#fff" />
              <Text style={styles.controlLabel}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCapture}
              style={styles.captureButton}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setCameraType(
                  cameraType === CameraType.back
                    ? CameraType.front
                    : CameraType.back
                )
              }
              style={styles.controlButton}
            >
              <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
              <Text style={styles.controlLabel}>Flip</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Processing State */}
      {isProcessing && (
        <View style={styles.processingContainer}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.processingCard}
          >
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.processingTitle}>Creating Your Look...</Text>
            <Text style={styles.processingSubtitle}>
              Our AI is fitting the garment to your body
            </Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Result View */}
      {mode === 'result' && tryOnResult && !isProcessing && (
        <ScrollView style={styles.resultContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${tryOnResult.resultImage}` }}
            style={styles.resultImage}
            resizeMode="contain"
          />

          {/* Confidence Score */}
          <View style={styles.confidenceContainer}>
            <View style={styles.confidenceBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.confidenceText}>
                {Math.round(tryOnResult.confidence * 100)}% Match
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.resultActions}>
            <TouchableOpacity
              onPress={handleRetake}
              style={styles.secondaryButton}
            >
              <Ionicons name="camera-outline" size={20} color="#6366f1" />
              <Text style={styles.secondaryButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={styles.primaryButton}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Save & Continue</Text>
            </TouchableOpacity>
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips for Best Results</Text>
            <Text style={styles.tipText}>
              • Stand in good lighting{'
'}
              • Wear fitted clothing{'
'}
              • Stand straight with arms at sides{'
'}
              • Ensure full body is visible
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ARTryOn;
