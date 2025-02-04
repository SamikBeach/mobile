import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '@/styles/theme';

export function EmptyComments() {
  return (
    <View style={styles.container}>
      <Icon name="message-square" size={48} color={colors.gray[300]} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>아직 댓글이 없어요.</Text>
        <Text style={styles.subtitle}>첫 번째 댓글을 남겨보세요.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  textContainer: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[600],
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray[500],
  },
});
