import React from 'react';
import { View, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/styles/theme';

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
  // 구현 내용
} 