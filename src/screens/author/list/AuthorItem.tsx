import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Text } from '@/components/common/Text';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
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
    <Pressable
      style={styles.container}
      onPress={handlePress}
      android_ripple={{ color: colors.gray[100] }}>
      <Image
        source={{ uri: author.imageUrl ?? undefined }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{author.nameInKor}</Text>
          <Text style={styles.originalName}>{author.name}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {author.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Icon name="book-open" size={14} color={colors.gray[500]} />
              <Text style={styles.statValue}>{author.bookCount}</Text>
            </View>
            <View style={styles.stat}>
              <Icon name="heart" size={14} color={colors.gray[500]} />
              <Text style={styles.statValue}>{author.likeCount}</Text>
            </View>
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
    padding: spacing.sm,
    gap: spacing.md,
    ...shadows.sm,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 4,
  },
  header: {
    gap: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
    lineHeight: 19,
  },
  originalName: {
    fontSize: 13,
    color: colors.gray[500],
    lineHeight: 16,
  },
  description: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 13,
    color: colors.gray[700],
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 12,
    color: colors.primary[700],
    fontWeight: '500',
  },
});
