import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CommentButtonProps {
  commentCount: number;
  onPress?: () => void;
}

export function CommentButton({ commentCount, onPress }: CommentButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name="comment-outline" size={16} color="#71717a" />
      <Text style={styles.text}>{commentCount}</Text>
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
    minWidth: 52,
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    color: '#71717a',
  },
});
