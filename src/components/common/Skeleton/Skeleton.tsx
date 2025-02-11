import React, { useEffect } from 'react';
import { ViewStyle, StyleSheet, StyleProp, Animated } from 'react-native';
import { colors } from '@/styles/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ style }: Props) {
  // 애니메이션 값 생성
  const animatedValue = React.useMemo(() => new Animated.Value(0.3), []);

  useEffect(() => {
    // 반복 애니메이션 설정
    const animation = Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0.3,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    // 무한 반복 실행
    Animated.loop(animation).start();

    // 컴포넌트 언마운트 시 애니메이션 정리
    return () => {
      animation.stop();
    };
  }, [animatedValue]);

  return (
    <Animated.View
      style={[
        styles.base,
        style,
        {
          opacity: animatedValue,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.gray[200],
    borderRadius: 6,
  },
});
