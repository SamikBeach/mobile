import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export function FeedSkeleton() {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const Skeleton = ({ style }) => (
    <Animated.View style={[styles.skeleton, style, { opacity }]} />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Skeleton style={styles.avatar} />
          <Skeleton style={styles.nickname} />
          <Skeleton style={styles.date} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Left: Book Section */}
        <View style={styles.bookSection}>
          <Skeleton style={styles.bookImage} />
          <View style={styles.bookInfo}>
            <Skeleton style={styles.bookTitle} />
            <Skeleton style={[styles.bookTitle, { width: '80%' }]} />
            <Skeleton style={styles.bookAuthor} />
          </View>
        </View>

        {/* Right: Review Section */}
        <View style={styles.reviewSection}>
          <View style={styles.reviewContent}>
            <Skeleton style={styles.reviewTitle} />
            <Skeleton style={styles.reviewText} />
            <Skeleton style={styles.reviewText} />
            <Skeleton style={styles.reviewText} />
            <Skeleton style={[styles.reviewText, { width: '75%' }]} />
          </View>

          <View style={styles.actions}>
            <Skeleton style={styles.actionButton} />
            <Skeleton style={styles.actionButton} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  skeleton: {
    backgroundColor: '#E1E1E1',
    borderRadius: 4,
  },
  header: {
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nickname: {
    width: 80,
    height: 16,
  },
  date: {
    width: 60,
    height: 12,
  },
  mainContent: {
    flexDirection: 'row',
    gap: 20,
  },
  bookSection: {
    width: 120,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookInfo: {
    maxWidth: 120,
  },
  bookTitle: {
    height: 16,
    marginBottom: 4,
    width: '100%',
  },
  bookAuthor: {
    height: 14,
    width: '90%',
  },
  reviewSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  reviewContent: {
    flex: 1,
    gap: 8,
  },
  reviewTitle: {
    height: 20,
    width: '60%',
    marginBottom: 8,
  },
  reviewText: {
    height: 16,
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    width: 54,
    height: 28,
    borderRadius: 14,
  },
});
