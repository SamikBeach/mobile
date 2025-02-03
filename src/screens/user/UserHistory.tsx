import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tab } from '@/components/common/Tab';
import { ReviewList } from './ReviewList';
import { colors, spacing } from '@/styles/theme';
import { BookList } from './BookList';
import { AuthorList } from './AuthorList';

interface Props {
  userId: number;
}

export function UserHistory({ userId }: Props) {
  const [activeTab, setActiveTab] = React.useState('review');

  const tabs = [
    { value: 'review', label: '리뷰' },
    { value: 'books', label: '좋아한 책' },
    { value: 'authors', label: '좋아한 작가' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'review':
        return <ReviewList userId={userId} />;
      case 'books':
        return <BookList userId={userId} />;
      case 'authors':
        return <AuthorList userId={userId} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Tab
        tabs={tabs}
        value={activeTab}
        onChange={setActiveTab}
        containerStyle={styles.tabContainer}
      />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
});
