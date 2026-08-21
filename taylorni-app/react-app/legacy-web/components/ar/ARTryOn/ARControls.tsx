import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ARControlsProps {
  onAdjustSize: () => void;
  onRotate: () => void;
  onFilter: () => void;
  onReset: () => void;
}

const ARControls: React.FC<ARControlsProps> = ({
  onAdjustSize,
  onRotate,
  onFilter,
  onReset,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adjust Fit</Text>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.control} onPress={onAdjustSize}>
          <Ionicons name="resize-outline" size={24} color="#fff" />
          <Text style={styles.label}>Size</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.control} onPress={onRotate}>
          <Ionicons name="refresh-outline" size={24} color="#fff" />
          <Text style={styles.label}>Rotate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.control} onPress={onFilter}>
          <Ionicons name="color-filter-outline" size={24} color="#fff" />
          <Text style={styles.label}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.control} onPress={onReset}>
          <Ionicons name="refresh-circle-outline" size={24} color="#fff" />
          <Text style={styles.label}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    top: '30%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 12,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  controls: {
    gap: 16,
  },
  control: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    color: '#fff',
    fontSize: 10,
  },
});

export default ARControls;
