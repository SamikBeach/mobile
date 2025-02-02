import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CommentButtonProps {
  commentCount: number;
}

export function CommentButton({ commentCount }: CommentButtonProps) {
  return (
    <TouchableOpacity style={styles.button}>
      <MaterialCommunityIcons
        name="comment-outline"
        size={16}
        color="#71717a"
      />
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
  },
  text: {
    fontSize: 12,
    color: '#71717a',
  },
});
