import React from 'react';
import { Modal, StyleSheet, Pressable, View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/common/Text';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing } from '@/styles/theme';
import { useActionSheet } from './useActionSheet';
import Animated from 'react-native-reanimated';

export interface Action {
  text: string;
  icon?: string;
  onPress: () => void;
  destructive?: boolean;
}

export interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  actions?: Action[];
  title?: string;
  headerRight?: React.ReactNode;
  customContent?: React.ReactNode;
  showCloseButton?: boolean;
}

export function ActionSheet({
  visible,
  onClose,
  actions = [],
  title,
  headerRight,
  customContent,
}: ActionSheetProps) {
  const { animatedStyles, handleClose } = useActionSheet({ visible, onClose });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <View style={styles.background} />
        <Animated.View style={[styles.sheet, animatedStyles]}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}
          {customContent && <View style={styles.customContent}>{customContent}</View>}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            bounces={false}>
            {actions.length > 0 && (
              <View style={styles.actions}>
                {actions.map((action, index) => (
                  <TouchableOpacity
                    key={action.text}
                    style={[styles.action, index < actions.length - 1 && styles.borderBottom]}
                    onPress={action.onPress}>
                    {action.icon && (
                      <Icon
                        name={action.icon}
                        size={20}
                        color={action.destructive ? colors.red[500] : colors.gray[700]}
                      />
                    )}
                    <Text style={[styles.actionText, action.destructive && styles.destructiveText]}>
                      {action.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
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
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  headerRight: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  actions: {
    paddingVertical: spacing.md,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  actionText: {
    fontSize: 16,
    color: colors.gray[700],
  },
  destructiveText: {
    color: colors.red[500],
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  customContent: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
});
