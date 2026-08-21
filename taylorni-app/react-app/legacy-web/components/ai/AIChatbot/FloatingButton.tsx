import React, { useState } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AIChatbot from './index';

interface FloatingButtonProps {
  userId: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsOpen(true);
  };

  return (
    <>
      <Animated.View
        style={[
          localStyles.floatingButton,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={localStyles.button}
        >
          <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AIChatbot userId={userId} onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};

const localStyles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default FloatingButton;
