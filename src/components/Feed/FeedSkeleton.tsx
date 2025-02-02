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
      <View style={styles.header}>
        <Skeleton style={styles.avatar} />
        <Skeleton style={styles.dateText} />
      </View>

      <View style={styles.content}>
        <Skeleton style={styles.bookImage} />
        <View style={styles.textContent}>
          <Skeleton style={styles.titleText} />
          <Skeleton style={styles.contentText} />
          <Skeleton style={styles.contentText} />
          <Skeleton style={[styles.contentText, { width: '75%' }]} />
        </View>
      </View>

      <View style={styles.actions}>
        <Skeleton style={styles.actionButton} />
        <Skeleton style={styles.actionButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  skeleton: {
    backgroundColor: '#E1E1E1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  dateText: {
    marginLeft: 8,
    width: 60,
    height: 12,
    borderRadius: 4,
  },
  content: {
    flexDirection: 'row',
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  textContent: {
    flex: 1,
    marginLeft: 12,
  },
  titleText: {
    width: '80%',
    height: 20,
    marginBottom: 8,
    borderRadius: 4,
  },
  contentText: {
    width: '100%',
    height: 16,
    marginBottom: 8,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 16,
  },
  actionButton: {
    width: 54,
    height: 28,
    borderRadius: 14,
  },
});
