import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthorDetailScreenContent } from './detail/AuthorDetailScreenContent';
import { spacing } from '@/styles/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthorDetail'>;

export function AuthorDetailScreen({ route }: Props) {
  const { authorId } = route.params;

  return (
    <View style={styles.container}>
      <AuthorDetailScreenContent authorId={authorId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    gap: spacing.xl,
  },
});
