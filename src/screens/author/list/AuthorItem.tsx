import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Text } from '@/components/common/Text';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Author } from '@/types/author';
import type { AuthorStackParamList } from '@/navigation/types';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';

interface Props {
  author: Author;
}

export function AuthorItem({ author }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthorStackParamList, 'AuthorDetail'>>();

  const handlePress = () => {
    navigation.navigate('AuthorDetail', { authorId: author.id });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image
        source={{ uri: author.imageUrl ?? undefined }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{author.nameInKor}</Text>
          <Text style={styles.era}>{author.era.eraInKor}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {author.description}
        </Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{author.bookCount}</Text>
            <Text style={styles.statLabel}>도서</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{author.likeCount}</Text>
            <Text style={styles.statLabel}>좋아요</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  era: {
    fontSize: 14,
    color: colors.gray[500],
  },
  description: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
  },
  statLabel: {
    fontSize: 13,
    color: colors.gray[500],
  },
});
