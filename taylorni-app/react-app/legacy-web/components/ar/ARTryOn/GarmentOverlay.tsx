import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface GarmentOverlayProps {
  garmentImage: string;
  bodyPart: 'upper' | 'lower' | 'full';
  opacity?: number;
}

const GarmentOverlay: React.FC<GarmentOverlayProps> = ({
  garmentImage,
  bodyPart,
  opacity = 0.4,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for garment outline
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getOverlayPosition = () => {
    switch (bodyPart) {
      case 'upper':
        return { top: height * 0.25, height: height * 0.35 };
      case 'lower':
        return { top: height * 0.55, height: height * 0.35 };
      case 'full':
        return { top: height * 0.2, height: height * 0.6 };
      default:
        return { top: height * 0.3, height: height * 0.4 };
    }
  };

  const position = getOverlayPosition();

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          top: position.top,
          height: position.height,
          opacity: opacity,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <Image
        source={{ uri: garmentImage }}
        style={styles.garmentImage}
        resizeMode="contain"
      />
      <View style={styles.guideLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: width * 0.1,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  garmentImage: {
    width: '100%',
    height: '100%',
  },
  guideLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#6366f1',
    opacity: 0.5,
  },
});

export default GarmentOverlay;
