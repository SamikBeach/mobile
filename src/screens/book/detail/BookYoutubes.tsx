import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { YoutubeDialog } from '@/components/youtube/YoutubeDialog';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';
import { BookYoutubesSkeleton } from '@/components/common/Skeleton/BookYoutubesSkeleton';

interface Props {
  bookId: number;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - spacing.lg - spacing.md / 2;

export function BookYoutubes({ bookId }: Props) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['book-videos', bookId],
    queryFn: () => bookApi.getBookVideos(bookId),
    select: response => response.data,
  });

  if (isLoading) {
    return <BookYoutubesSkeleton />;
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>관련 영상</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{videos.length}</Text>
          </View>
        </View>
        {videos.length > 4 && (
          <TouchableOpacity style={styles.toggleButton} onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.toggleButtonText}>{isExpanded ? '접기' : '더보기'}</Text>
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.gray[500]}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.videoGrid}>
        {(isExpanded ? videos : videos.slice(0, 4)).map(video => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => setSelectedVideoId(video.id)}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
              <View style={styles.playIconContainer}>
                <View style={styles.playIcon}>
                  <Icon name="play" size={16} color={colors.red[500]} />
                </View>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {video.title}
              </Text>
              <Text style={styles.channelTitle} numberOfLines={1}>
                {video.channelTitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <YoutubeDialog videoId={selectedVideoId} onClose={() => setSelectedVideoId(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  badge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[600],
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[500],
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  videoCard: {
    width: CARD_WIDTH,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  playIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: spacing.sm,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  channelTitle: {
    fontSize: 12,
    color: colors.gray[500],
  },
});
