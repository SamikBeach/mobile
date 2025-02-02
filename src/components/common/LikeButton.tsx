import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onPress: () => void;
}

export function LikeButton({ isLiked, likeCount, onPress }: LikeButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, isLiked && styles.likedButton]} onPress={onPress}>
      <Icon
        name={isLiked ? 'heart' : 'heart-outline'}
        size={16}
        color={isLiked ? '#ef4444' : '#71717a'}
      />
      <Text style={[styles.text, isLiked && styles.likedText]}>{likeCount}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f4f4f5',
    gap: 4,
  },
  likedButton: {
    backgroundColor: '#fef2f2',
  },
  text: {
    fontSize: 12,
    color: '#71717a',
  },
  likedText: {
    color: '#ef4444',
  },
});
