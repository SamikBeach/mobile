import React from 'react';
import { View, StyleSheet, Image, Pressable, SafeAreaView } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { colors, spacing, shadows } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ReviewList } from './ReviewList';
import { BookList } from './BookList';
import { AuthorList } from './AuthorList';

interface Props {
  userId: number;
}

export function UserInfo({ userId }: Props) {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;
  const [activeSection, setActiveSection] = React.useState<'review' | 'books' | 'authors'>(
    'review',
  );

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUserDetail(userId),
    select: response => response.data,
  });

  const { mutate: uploadImage } = useMutation({
    mutationFn: (file: any) => userApi.uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      if (isMyProfile) {
        queryClient.invalidateQueries({ queryKey: ['me'] });
      }
    },
  });

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
        if (response.assets?.[0]) {
          uploadImage(response.assets[0]);
        }
      },
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'review':
        return <ReviewList userId={userId} />;
      case 'books':
        return <BookList userId={userId} />;
      case 'authors':
        return <AuthorList userId={userId} />;
    }
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>프로필</Text>
          {isMyProfile && (
            <Pressable style={styles.settingsButton}>
              <Icon name="settings" size={20} color={colors.gray[700]} />
            </Pressable>
          )}
        </View>
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            <Pressable onPress={isMyProfile ? handleImagePick : undefined}>
              {user.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImage, styles.defaultProfile]}>
                  <Icon name="user" size={48} color={colors.gray[400]} />
                </View>
              )}
              {isMyProfile && (
                <View style={styles.editButton}>
                  <Icon name="camera" size={16} color={colors.gray[700]} />
                </View>
              )}
            </Pressable>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.nickname}>{user.nickname}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          <View style={styles.stats}>
            <Pressable
              style={[styles.statItem, activeSection === 'review' && styles.activeStatItem]}
              onPress={() => setActiveSection('review')}>
              <Text style={styles.statValue}>0</Text>
              <Text
                style={[styles.statLabel, activeSection === 'review' && styles.activeStatLabel]}>
                리뷰
              </Text>
            </Pressable>
            <View style={styles.statDivider} />
            <Pressable
              style={[styles.statItem, activeSection === 'books' && styles.activeStatItem]}
              onPress={() => setActiveSection('books')}>
              <Text style={styles.statValue}>0</Text>
              <Text style={[styles.statLabel, activeSection === 'books' && styles.activeStatLabel]}>
                좋아요한 책
              </Text>
            </Pressable>
            <View style={styles.statDivider} />
            <Pressable
              style={[styles.statItem, activeSection === 'authors' && styles.activeStatItem]}
              onPress={() => setActiveSection('authors')}>
              <Text style={styles.statValue}>0</Text>
              <Text
                style={[styles.statLabel, activeSection === 'authors' && styles.activeStatLabel]}>
                좋아요한 작가
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
  },
  container: {
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  settingsButton: {
    padding: spacing.sm,
    marginRight: -spacing.sm,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    ...shadows.md,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[200],
  },
  defaultProfile: {
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: 20,
    ...shadows.sm,
  },
  userInfo: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  nickname: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.gray[900],
  },
  email: {
    fontSize: 14,
    color: colors.gray[500],
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  activeStatItem: {
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.gray[200],
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  statLabel: {
    fontSize: 13,
    color: colors.gray[500],
  },
  activeStatLabel: {
    color: colors.gray[900],
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginTop: spacing.lg,
  },
});
