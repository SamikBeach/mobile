import React from 'react';
import { View, ViewStyle, TextStyle, StyleProp, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing } from '@/styles/theme';

export interface SkeletonProps {
  style?: StyleProp<ViewStyle | TextStyle>;
}

export function Skeleton({ style }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(0.6, { duration: 800, easing: Easing.ease }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.gray[200],
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function ReviewItemSkeleton() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Skeleton style={{ width: 40, height: 40, borderRadius: 20 }} />
        <View style={{ gap: 4 }}>
          <Skeleton style={{ width: 100, height: 16, borderRadius: 4 }} />
          <Skeleton style={{ width: 60, height: 12, borderRadius: 4 }} />
        </View>
      </View>
      <Skeleton style={{ width: '100%', height: 16, borderRadius: 4 }} />
      <Skeleton style={{ width: '90%', height: 16, borderRadius: 4 }} />
      <Skeleton style={{ width: '80%', height: 16, borderRadius: 4 }} />
    </View>
  );
}

export function RelativeBooksSkeleton() {
  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingHorizontal: spacing.lg 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Skeleton style={{ width: 100, height: 24, borderRadius: 4 }} />
          <Skeleton style={{ width: 30, height: 20, borderRadius: 10 }} />
        </View>
        <Skeleton style={{ width: 80, height: 30, borderRadius: 6 }} />
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          gap: spacing.sm, 
          paddingVertical: spacing.xs, 
          paddingHorizontal: spacing.lg 
        }}
      >
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={{ width: 120, marginRight: spacing.sm }}>
            <Skeleton style={{ 
              width: 120, 
              height: 180, 
              borderRadius: 8 
            }} />
            <Skeleton style={{ 
              width: 100, 
              height: 16, 
              borderRadius: 4, 
              marginTop: spacing.xs 
            }} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function ChatButtonSkeleton() {
  return (
    <View style={{ 
      marginVertical: spacing.md,
      marginHorizontal: spacing.lg,
    }}>
      <Skeleton style={{ 
        width: '100%', 
        height: 48, 
        borderRadius: 8 
      }} />
    </View>
  );
} 