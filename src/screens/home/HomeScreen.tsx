import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, RefreshControl } from 'react-native';
import { FeedList } from '@/components/feed/FeedList';
import { colors } from '@/styles/theme';
import { useQueryClient } from '@tanstack/react-query';

export function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // 피드 데이터 새로고침
      await queryClient.invalidateQueries({ queryKey: ['reviews'] });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <SafeAreaView style={styles.container}>
      <FeedList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]} // Android
            progressBackgroundColor={colors.white} // Android
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
