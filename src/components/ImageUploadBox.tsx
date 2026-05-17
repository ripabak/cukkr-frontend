import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  onPress?: () => void;
  imageUri?: string;
  label?: string;
  style?: ViewStyle;
}

export function ImageUploadBox({ onPress, imageUri, label, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.container, style]}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.row}>
          <Ionicons name="image-outline" size={20} color={Colors.icon.muted} />
          <Text style={styles.label}>{label ?? 'Choose Image'}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: Colors.text.muted,
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
