import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Tab } from '../common/Tab';
import { Feed } from './Feed';
import { Review, User, Book } from '@/types';

interface FeedItem {
  id: string;
  review: Review;
  user: User;
  book: Book;
}

const TABS = [
  { key: 'popular', title: '인기순' },
  { key: 'recent', title: '최신순' },
];

export const FeedList = () => {
  const [activeTab, setActiveTab] = useState('popular');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<FeedItem[]>([]);

  const renderItem = ({ item }: { item: FeedItem }) => (
    <Feed review={item.review} user={item.user} book={item.book} />
  );

  const loadMore = () => {
    // 여기에 페이지네이션 로직을 구현하세요
  };

  return (
    <View style={styles.container}>
      <Tab tabs={TABS} activeTab={activeTab} onChangeTab={tab => setActiveTab(tab)} />
      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator style={styles.loader} color="#000" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    marginVertical: 20,
  },
});
