import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '@/styles/theme';

interface CommentButtonProps {
  commentCount: number;
  onPress?: () => void;
  isActive?: boolean;
}

export function CommentButton({ commentCount, onPress, isActive }: CommentButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, isActive && styles.activeButton]} onPress={onPress}>
      <Icon name="message-square" size={16} color={isActive ? colors.white : colors.gray[500]} />
      <Text style={[styles.text, isActive && styles.activeText]}>{commentCount}</Text>
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
  activeButton: {
    backgroundColor: colors.gray[900],
    borderWidth: 0,
  },
  text: {
    fontSize: 12,
    color: colors.gray[500],
  },
  activeText: {
    color: colors.white,
  },
});
