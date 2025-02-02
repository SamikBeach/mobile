import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { AuthorStackParamList } from '@/navigation/types';
import { AuthorDetailInfo } from './AuthorDetailInfo';
import { AuthorBooks } from './AuthorBooks';
import { ReviewList } from './ReviewList';
import { colors } from '@/styles/theme';

type AuthorDetailScreenRouteProp = RouteProp<AuthorStackParamList, 'AuthorDetail'>;

export default function AuthorDetailScreen() {
  const route = useRoute<AuthorDetailScreenRouteProp>();
  const { authorId } = route.params;

  return (
    <View style={styles.container}>
      <AuthorDetailInfo authorId={authorId} />
      <AuthorBooks authorId={authorId} />
      <ReviewList authorId={authorId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
