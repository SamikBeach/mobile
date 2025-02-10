import { useCallback } from 'react';
import {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function useActionSheet({ visible, onClose }: Props) {
  const translateY = useSharedValue(300);

  const animatedStyles = useAnimatedStyle(() => {
    translateY.value = visible
      ? withTiming(0, {
          duration: 250,
          easing: Easing.inOut(Easing.ease),
        })
      : withTiming(300, {
          duration: 200,
          easing: Easing.inOut(Easing.ease),
        });

    return {
      transform: [{ translateY: translateY.value }],
    };
  }, [visible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return {
    animatedStyles,
    handleClose,
  };
}
