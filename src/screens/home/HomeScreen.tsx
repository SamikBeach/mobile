import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { FeedList } from '@/components/feed/FeedList';
import { colors } from '@/styles/theme';
import { useQueryClient } from '@tanstack/react-query';

export function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const scrollRef = React.useRef(null);

  useScrollToTop(scrollRef);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['reviews'] });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <ScrollView ref={scrollRef} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <FeedList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary[500]}
              colors={[colors.primary[500]]}
              progressBackgroundColor={colors.white}
            />
          }
        />
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
