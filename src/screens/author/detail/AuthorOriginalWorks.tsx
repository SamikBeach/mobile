import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Text } from '@/components/common/Text';
import { useQuery } from '@tanstack/react-query';
import { authorApi } from '@/apis/author';
import { colors, spacing, borderRadius } from '@/styles/theme';
import { OriginalWork } from '@/types/author';
import { Book } from '@/types/book';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Skeleton } from '@/components/common/Skeleton';
import Icon from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
import { commonStyles } from '@/styles/commonStyles';

interface Props {
  authorId: number;
}

export function AuthorOriginalWorks({ authorId }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: originalWorks = [], isLoading: isWorksLoading } = useQuery({
    queryKey: ['author-original-works', authorId],
    queryFn: () => authorApi.getAuthorOriginalWorks(authorId),
    select: response => response.data,
  });

  const { data: authorBooks = [], isLoading: isBooksLoading } = useQuery({
    queryKey: ['author-books', authorId],
    queryFn: () => authorApi.getAllAuthorBooks(authorId),
    select: response => response.data,
  });

  if (isWorksLoading || isBooksLoading) {
    return <OriginalWorksSkeleton />;
  }

  // 원전에 연결되지 않은 책들 찾기
  const classifiedBookIds = new Set<number>();
  originalWorks.forEach(work => {
    work.books?.forEach(book => {
      if (book && book.id) {
        classifiedBookIds.add(book.id);
      }
    });
  });

  const unclassifiedBooks = authorBooks.filter(book => !classifiedBookIds.has(book.id));

  // 미분류 책이 없고 원전도 없으면 컴포넌트를 렌더링하지 않음
  if (originalWorks.length === 0 && unclassifiedBooks.length === 0) {
    return null;
  }

  // 미분류 책이 있으면 가상의 원전 카드를 추가
  const allWorks = [...originalWorks];
  if (unclassifiedBooks.length > 0) {
    allWorks.push({
      id: -1, // 가상의 ID
      title: '미분류',
      books: unclassifiedBooks,
      createdAt: '',
      updatedAt: null,
      deletedAt: null,
    });
  }

  const displayWorks = isExpanded ? allWorks : allWorks.slice(0, 1);

  return (
    <View style={styles.container}>
      <View style={[styles.header, commonStyles.sectionHeader]}>
        <View style={commonStyles.titleSection}>
          <Text style={commonStyles.sectionTitle}>원전</Text>
          <View style={commonStyles.badge}>
            <Text style={commonStyles.badgeText}>{allWorks.length}</Text>
          </View>
        </View>
        {allWorks.length > 3 && (
          <TouchableOpacity
            style={commonStyles.toggleButton}
            onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={commonStyles.toggleButtonText}>{isExpanded ? '접기' : '전체보기'}</Text>
            <Icon name={isExpanded ? 'chevron-up' : 'grid'} size={16} color={colors.gray[500]} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayWorks}
        keyExtractor={item => `work-${item.id}`}
        renderItem={({ item }) => <OriginalWorkCard work={item} navigation={navigation} />}
        numColumns={1}
        scrollEnabled={false}
        contentContainerStyle={[styles.workGrid, { paddingHorizontal: spacing.lg }]}
      />
    </View>
  );
}

function OriginalWorkCard({
  work,
  navigation,
}: {
  work: OriginalWork;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  const [showAllBooks, setShowAllBooks] = useState(false);
  const isUnclassified = work.id === -1;

  // 출판 날짜 포맷팅 함수
  const formatPublicationDate = () => {
    if (!work.publishedDate) return null;
    let dateText = work.publishedDate;
    // BC 표시
    if (work.publishedDateIsBc) {
      dateText = `BC ${dateText}`;
    }
    // 대략적인 연도 표시
    if (work.circa) {
      dateText = `c. ${dateText}`;
    }
    // 세기 표시
    if (work.century) {
      dateText = `${dateText}세기`;
    }
    // 복수형 표시 (영어권에서 사용)
    if (work.s) {
      dateText = `${dateText}s`;
    }
    // 사후 출판 표시
    if (work.posthumous) {
      dateText = `${dateText} (사후 출판)`;
    }
    return dateText;
  };

  const publicationDate = formatPublicationDate();
  const filteredBooks = work.books?.filter(book => book && book.id) || [];
  const hasBooks = filteredBooks.length > 0;
  const displayBooks = showAllBooks ? filteredBooks : filteredBooks.slice(0, 3);

  return (
    <View style={[styles.workCard, isUnclassified ? styles.unclassifiedCard : styles.normalCard]}>
      <View style={styles.workHeader}>
        <Text style={[styles.workTitle, isUnclassified && styles.unclassifiedTitle]}>
          {work.title}
        </Text>

        {!isUnclassified && (
          <View style={styles.titleVariants}>
            {work.titleInKor && work.titleInKor !== work.title && (
              <Text style={styles.titleInKor}>{work.titleInKor}</Text>
            )}
            {work.titleInEng && work.titleInEng !== work.title && (
              <Text style={styles.titleInEng}>{work.titleInEng}</Text>
            )}
          </View>
        )}

        {!isUnclassified && publicationDate && (
          <Text style={styles.workDate}>{publicationDate}</Text>
        )}

        {isUnclassified && (
          <Text style={styles.unclassifiedDescription}>원전과 연결되지 않은 책들</Text>
        )}
      </View>

      {hasBooks && (
        <View style={styles.booksSection}>
          <View style={styles.booksHeader}>
            <Text style={styles.booksTitle}>
              {isUnclassified ? '책' : '연관된 책'} ({filteredBooks.length})
            </Text>
            {filteredBooks.length > 3 && (
              <TouchableOpacity
                style={[
                  styles.booksToggle,
                  isUnclassified ? styles.unclassifiedToggle : styles.normalToggle,
                ]}
                onPress={() => setShowAllBooks(!showAllBooks)}>
                <Text
                  style={[
                    styles.booksToggleText,
                    isUnclassified ? styles.unclassifiedToggleText : styles.normalToggleText,
                  ]}>
                  {showAllBooks ? '접기' : '더보기'}
                </Text>
                <Icon
                  name={showAllBooks ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={isUnclassified ? colors.orange[600] : colors.blue[600]}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.booksList}>
            {displayBooks.map(book => (
              <TouchableOpacity
                key={book.id}
                style={[
                  styles.bookItem,
                  isUnclassified ? styles.unclassifiedBookItem : styles.normalBookItem,
                ]}
                onPress={() => navigation.navigate('BookDetail', { bookId: book.id })}>
                <Image
                  source={{
                    uri: book.imageUrl || 'https://via.placeholder.com/20x30',
                  }}
                  style={styles.bookImage}
                  resizeMode="cover"
                />
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title || '제목 없음'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function OriginalWorksSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Skeleton style={{ width: 80, height: 20, borderRadius: 4 }} />
          <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
        </View>
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>

      <View style={styles.workGrid}>
        {[1, 2].map(key => (
          <View key={`skeleton-${key}`} style={styles.workCard}>
            <View style={styles.workHeader}>
              <Skeleton style={{ height: 18, width: '100%', borderRadius: 4 }} />
              <Skeleton style={{ height: 14, width: '66%', borderRadius: 4, marginTop: 4 }} />
              <Skeleton style={{ height: 12, width: '50%', borderRadius: 4, marginTop: 6 }} />
            </View>
            <View style={styles.booksSection}>
              <View style={styles.booksHeader}>
                <Skeleton style={{ height: 14, width: 80, borderRadius: 4 }} />
                <Skeleton style={{ height: 16, width: 60, borderRadius: 4 }} />
              </View>
              <View style={styles.booksList}>
                {[1, 2, 3].map(_key => (
                  <Skeleton
                    key={`book-skeleton-${_key}`}
                    style={{ height: 36, borderRadius: 6, width: '30%' }}
                  />
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
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
  workGrid: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  workCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    shadowColor: colors.gray[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
    marginBottom: spacing.sm,
  },
  normalCard: {
    backgroundColor: colors.white,
    borderColor: colors.gray[100],
  },
  unclassifiedCard: {
    backgroundColor: colors.orange[50],
    borderColor: colors.orange[100],
  },
  workHeader: {
    marginBottom: spacing.md,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  unclassifiedTitle: {
    color: colors.orange[900],
  },
  workDate: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  booksSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  booksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  booksTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[700],
  },
  booksToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  normalToggle: {
    // backgroundColor: colors.blue[50],
  },
  unclassifiedToggle: {
    // backgroundColor: colors.orange[50],
  },
  booksToggleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  normalToggleText: {
    color: colors.blue[600],
  },
  unclassifiedToggleText: {
    color: colors.orange[600],
  },
  booksList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    maxWidth: '48%',
    marginBottom: spacing.xs,
  },
  normalBookItem: {
    backgroundColor: colors.gray[50],
  },
  unclassifiedBookItem: {
    backgroundColor: colors.orange[50],
  },
  bookImage: {
    width: 20,
    height: 30,
    borderRadius: 2,
  },
  bookTitle: {
    fontSize: 12,
    color: colors.gray[700],
    flex: 1,
  },
  workDivider: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
  titleVariants: {
    marginTop: spacing.xs,
    gap: 2,
  },
  titleInKor: {
    fontSize: 12,
    color: colors.gray[600],
  },
  titleInEng: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.gray[500],
  },
  unclassifiedDescription: {
    fontSize: 12,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
});
