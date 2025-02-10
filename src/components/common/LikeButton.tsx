import { colors } from '@/styles/theme';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onPress: () => void;
}

export function LikeButton({ isLiked, likeCount, onPress }: LikeButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, isLiked && styles.likedButton]} onPress={onPress}>
      <Icon name="thumbs-up" size={16} color={isLiked ? colors.white : colors.gray[500]} />
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
    backgroundColor: colors.white,
    gap: 4,
    minWidth: 52,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  likedButton: {
    backgroundColor: colors.gray[900],
    borderWidth: 0,
  },
  text: {
    fontSize: 12,
    color: colors.gray[500],
  },
  likedText: {
    color: colors.white,
  },
});
