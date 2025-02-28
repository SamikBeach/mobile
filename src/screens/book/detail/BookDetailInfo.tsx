import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { Text } from '@/components/common/Text';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { colors, spacing, borderRadius, shadows } from '@/styles/theme';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookApi } from '@/apis/book';
import { useBookQueryData } from '@/hooks/useBookQueryData';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { BookDetailInfoSkeleton } from '@/components/common/Skeleton/BookDetailInfoSkeleton';
import { CommentButton } from '@/components/common/CommentButton';
import { LikeButton } from '@/components/common/LikeButton';
import { BookImage } from '@/components/book/BookImage';
import { formatAuthorLifespan } from '@/utils/date';
import { getJosa } from '@/utils/text';

// 색상 정의 추가
const indigoColors = {
  600: '#4f46e5',
};

interface Props {
  bookId: number;
  onReviewPress: () => void;
  onChatToggle: () => void;
  isChatOpen: boolean;
}

// AuthorImage 컴포넌트 직접 구현
function AuthorImage({ imageUrl, style }: { imageUrl?: string; name: string; style?: any }) {
  const defaultImage = 'https://via.placeholder.com/40';
  const source = { uri: imageUrl || defaultImage };

  return (
    <Image
      source={source}
      style={[{ width: 40, height: 40, borderRadius: 20 }, style]}
      defaultSource={{ uri: defaultImage }}
    />
  );
}

export function BookDetailInfo({ bookId, onReviewPress, onChatToggle, isChatOpen }: Props) {
  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => bookApi.getBookDetail(bookId),
    select: response => response.data,
  });

  const { updateBookLikeQueryData } = useBookQueryData();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentUser = useCurrentUser();

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => bookApi.toggleBookLike(bookId),
    onMutate: () => {
      updateBookLikeQueryData({ bookId, isOptimistic: true });
    },
    onError: () => {
      if (book) {
        updateBookLikeQueryData({
          bookId,
          isOptimistic: false,
          currentStatus: {
            isLiked: book.isLiked,
            likeCount: book.likeCount,
          },
        });
      }
    },
  });

  const handleLikePress = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }

    toggleLike();
  };

  const handleAuthorPress = (authorId: number) => {
    navigation.navigate('AuthorDetail', { authorId });
  };

  const handleWriteReview = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('WriteReview', { bookId });
  };

  const handleOpenAladin = () => {
    if (book?.isbn) {
      Linking.openURL(`https://www.aladin.co.kr/shop/wproduct.aspx?isbn=${book.isbn}`);
    }
  };

  if (isLoading || !book) {
    return <BookDetailInfoSkeleton />;
  }

  const formattedPublicationDate = book.publicationDate
    ? format(new Date(book.publicationDate), 'yyyy년 M월 d일')
    : '';

  // HTML 엔티티 디코딩 (간단한 구현)
  const decodeHtmlEntities = (text: string): string => {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  return (
    <View style={styles.container}>
      {/* 모바일 레이아웃 (세로 배치) */}
      <View style={styles.mobileContainer}>
        {/* 책 이미지 섹션 - 상단 중앙에 배치 */}
        <View style={styles.bookImageContainer}>
          <Pressable onPress={handleOpenAladin}>
            <BookImage imageUrl={book.imageUrl} size="xl" style={styles.bookCover} />
          </Pressable>

          {/* 좋아요/댓글 버튼 */}
          <View style={styles.interactionButtons}>
            <LikeButton
              isLiked={book.isLiked || false}
              likeCount={book.likeCount}
              onPress={handleLikePress}
            />
            <CommentButton commentCount={book.reviewCount} onPress={onReviewPress} />
          </View>
        </View>

        {/* 책 정보 섹션 */}
        <View style={styles.infoSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{book.title}</Text>
          </View>

          {/* 작가 정보 */}
          <View style={styles.authorsContainer}>
            {book.authorBooks.map(authorBook => (
              <TouchableOpacity
                key={authorBook.author.id}
                style={styles.authorCard}
                onPress={() => handleAuthorPress(authorBook.author.id)}>
                <AuthorImage
                  imageUrl={authorBook.author.imageUrl ?? undefined}
                  name={authorBook.author.nameInKor}
                  style={styles.authorImage}
                />
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{authorBook.author.nameInKor}</Text>
                  {(authorBook.author.bornDate || authorBook.author.diedDate) && (
                    <Text style={styles.authorLifespan}>
                      {formatAuthorLifespan(
                        authorBook.author.bornDate,
                        authorBook.author.bornDateIsBc,
                        authorBook.author.diedDate,
                        authorBook.author.diedDateIsBc,
                      )}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 출판 정보 */}
          <View style={styles.publishInfoContainer}>
            {(book.publisher || formattedPublicationDate) && (
              <View style={styles.publisherBadge}>
                <Text style={styles.publisherText}>
                  {book.publisher}
                  {book.publisher && formattedPublicationDate && (
                    <Text style={styles.publisherText}> · </Text>
                  )}
                  {formattedPublicationDate}
                </Text>
              </View>
            )}
          </View>

          {/* 원전 정보 */}
          {book.bookOriginalWorks?.[0] && (
            <View style={styles.originalWorkCard}>
              <Icon name="book" size={16} color={indigoColors[600]} style={styles.bookIcon} />
              <View style={styles.originalWorkInfo}>
                <Text style={styles.originalWorkTitle}>
                  {book.bookOriginalWorks[0].originalWork.title}
                </Text>
                {book.bookOriginalWorks[0].originalWork.title !== book.title && (
                  <Text style={styles.originalWorkSubtitle}>{book.title}</Text>
                )}
                {book.bookOriginalWorks[0].originalWork.titleInEng && (
                  <Text style={styles.originalWorkEngTitle}>
                    {book.bookOriginalWorks[0].originalWork.titleInEng}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* 책 설명 */}
          {book.description && (
            <View style={styles.descriptionContainer}>
              <ScrollView style={styles.descriptionScroll} nestedScrollEnabled>
                <Text style={styles.descriptionText}>{decodeHtmlEntities(book.description)}</Text>
                <Text style={styles.sourceText}>정보 제공: 알라딘</Text>
              </ScrollView>
            </View>
          )}

          {/* 모바일에서만 보이는 버튼들 */}
          <View style={styles.mobileButtons}>
            <TouchableOpacity
              style={[styles.button, isChatOpen && styles.activeButton]}
              onPress={onChatToggle}>
              <View style={styles.buttonContent}>
                <Icon name="message-circle" size={16} color={colors.gray[700]} />
                <Text style={styles.buttonText}>
                  {isChatOpen
                    ? '채팅 닫기'
                    : `${book.authorBooks[0].author.nameInKor}${getJosa(
                        book.authorBooks[0].author.nameInKor,
                      )}와 대화하기`}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleWriteReview}>
              <View style={styles.buttonContent}>
                <Icon name="edit-3" size={16} color={colors.gray[700]} />
                <Text style={styles.buttonText}>리뷰 쓰기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  mobileContainer: {
    flexDirection: 'column',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  bookImageContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  bookCover: {
    borderRadius: borderRadius.md,
    ...shadows.md,
    width: 140,
    height: 200,
  },
  interactionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  mobileButtons: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  activeButton: {
    backgroundColor: colors.gray[50],
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
  },
  infoSection: {
    gap: spacing.md,
  },
  titleContainer: {
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[900],
    lineHeight: 28,
  },
  authorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },
  authorImage: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  authorInfo: {
    gap: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[800],
  },
  authorLifespan: {
    fontSize: 12,
    color: colors.gray[500],
  },
  publishInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  publisherBadge: {
    backgroundColor: colors.gray[100],
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  publisherText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
  },
  originalWorkCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    ...shadows.sm,
    gap: spacing.sm,
  },
  bookIcon: {
    marginTop: 2,
  },
  originalWorkInfo: {
    flex: 1,
    gap: 2,
  },
  originalWorkTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
  },
  originalWorkSubtitle: {
    fontSize: 14,
    color: colors.gray[700],
  },
  originalWorkEngTitle: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.gray[500],
  },
  descriptionContainer: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
    maxHeight: 200,
  },
  descriptionScroll: {
    maxHeight: 180,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[700],
  },
  sourceText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.gray[400],
  },
});
