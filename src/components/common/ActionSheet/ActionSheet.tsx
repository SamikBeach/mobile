import React from 'react';
import { Modal, StyleSheet, Pressable, Animated } from 'react-native';
import { Text } from '@/components/common/Text';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '@/styles/theme';
import { useActionSheet } from './useActionSheet';

interface Action {
  text: string;
  icon?: string;
  onPress: () => void;
  destructive?: boolean;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  actions: Action[];
}

export function ActionSheet({ visible, onClose, actions }: Props) {
  const { translateY, opacity, handleClose } = useActionSheet({ visible, onClose });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View style={[styles.background, { opacity }]} />
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
            },
          ]}>
          {actions.map((action, index) => (
            <Pressable
              key={action.text}
              style={[styles.action, index !== actions.length - 1 && styles.borderBottom]}
              onPress={action.onPress}>
              <Icon
                name={action.icon as string}
                size={20}
                color={action.destructive ? colors.red[500] : colors.gray[700]}
              />
              <Text style={[styles.actionText, action.destructive && styles.destructiveText]}>
                {action.text}
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  actionText: {
    fontSize: 16,
    color: colors.gray[700],
  },
  destructiveText: {
    color: colors.red[500],
  },
});
