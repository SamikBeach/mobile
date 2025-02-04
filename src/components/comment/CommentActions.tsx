import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '@/styles/theme';
import { ActionSheet } from '../common/ActionSheet/ActionSheet';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export function CommentActions({ onEdit, onDelete }: Props) {
  const [showActions, setShowActions] = useState(false);

  const actions = [
    {
      text: '수정하기',
      icon: 'edit-2',
      onPress: () => {
        setShowActions(false);
        onEdit();
      },
    },
    {
      text: '삭제하기',
      icon: 'trash-2',
      onPress: () => {
        setShowActions(false);
        onDelete();
      },
      destructive: true,
    },
  ];

  return (
    <>
      <Pressable hitSlop={8} style={styles.button} onPress={() => setShowActions(true)}>
        <Icon name="more-horizontal" size={20} color={colors.gray[500]} />
      </Pressable>
      <ActionSheet visible={showActions} onClose={() => setShowActions(false)} actions={actions} />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});
