import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { YouTubeVideo } from '@/types/common';
import { YoutubeDialog } from '@/components/youtube/YoutubeDialog';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';
import { Skeleton } from '@/components/common/Skeleton';
import { commonStyles } from '@/styles/commonStyles';

interface Props {
  authorId: number;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - spacing.lg - spacing.md / 2;

export function AuthorYoutubes({ authorId }: Props) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['author-videos', authorId],
    queryFn: () => authorApi.getAuthorVideos(authorId),
    select: response => response.data,
  });

  if (isLoading) {
    return <AuthorYoutubesSkeleton />;
  }

  if (videos.length === 0) {
    return null;
  }

  const displayVideos = isExpanded ? videos : videos.slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={[styles.header, commonStyles.sectionHeader]}>
        <View style={commonStyles.titleSection}>
          <Text style={commonStyles.sectionTitle}>관련 영상</Text>
          <View style={commonStyles.badge}>
            <Text style={commonStyles.badgeText}>{videos.length}</Text>
          </View>
        </View>
        {videos.length > 4 && (
          <TouchableOpacity style={styles.toggleButton} onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.toggleButtonText}>{isExpanded ? '접기' : '전체보기'}</Text>
            <Icon name={isExpanded ? 'chevron-down' : 'grid'} size={16} color={colors.gray[500]} />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.videoGrid, { paddingHorizontal: spacing.lg }]}>
        {displayVideos.map(video => (
          <VideoCard key={video.id} video={video} onPress={() => setSelectedVideoId(video.id)} />
        ))}
      </View>

      <YoutubeDialog videoId={selectedVideoId} onClose={() => setSelectedVideoId(null)} />
    </View>
  );
}

interface VideoCardProps {
  video: YouTubeVideo;
  onPress: () => void;
}

const VideoCard = ({ video, onPress }: VideoCardProps) => {
  return (
    <TouchableOpacity style={styles.videoCard} onPress={onPress}>
      <View style={styles.thumbnailContainer}>
        <FastImage
          source={{ uri: video.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.playIconContainer}>
          <View style={styles.playIcon}>
            <Icon name="play" size={18} color={colors.red[500]} />
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
  );
};

function AuthorYoutubesSkeleton() {
  return (
    <View style={styles.container}>
      <View style={[styles.header, commonStyles.sectionHeader]}>
        <View style={commonStyles.titleSection}>
          <Skeleton style={{ width: 100, height: 20, borderRadius: 4 }} />
          <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
        </View>
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>

      <View style={styles.videoGrid}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={styles.videoCard}>
            <View style={styles.thumbnailContainer}>
              <Skeleton style={{ width: '100%', height: 0, paddingBottom: '56.25%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
              <View style={styles.playIconContainer}>
                <Skeleton style={{ width: 36, height: 36, borderRadius: 18 }} />
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Skeleton style={{ width: '90%', height: 16, borderRadius: 4 }} />
              <Skeleton style={{ width: '60%', height: 12, borderRadius: 4, marginTop: 4 }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  badge: {
    backgroundColor: colors.gray[100],
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
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
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  videoCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
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
