import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors, spacing } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import { ActionSheet } from '@/components/common/ActionSheet/ActionSheet';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteAccountSheet({ visible, onClose, onConfirm, isLoading }: Props) {
  const [confirmText, setConfirmText] = useState('');

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      title="계정 삭제"
      headerRight={
        <TouchableOpacity
          onPress={onConfirm}
          disabled={confirmText !== '삭제' || isLoading}
          style={[
            styles.actionButton,
            styles.deleteButton,
            (confirmText !== '삭제' || isLoading) && styles.disabledButton,
          ]}>
          <Text style={styles.actionButtonText}>{isLoading ? '처리중' : '삭제'}</Text>
        </TouchableOpacity>
      }
      customContent={
        <View style={styles.content}>
          <View style={styles.warningBox}>
            <Icon name="alert-triangle" size={20} color={colors.red[500]} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>삭제 전 꼭 확인해 주세요</Text>
              <Text style={styles.warningText}>• 모든 리뷰 기록이 삭제돼요</Text>
              <Text style={styles.warningText}>• 북마크한 책과 작가 정보가 삭제돼요</Text>
              <Text style={styles.warningText}>• 삭제된 계정은 복구할 수 없어요</Text>
            </View>
          </View>

          <View style={styles.confirmSection}>
            <Text style={styles.label}>계정 삭제를 원하시면 '삭제'를 입력해 주세요</Text>
            <TextInput
              style={styles.input}
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="삭제"
            />
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: colors.red[50],
    padding: spacing.lg,
    borderRadius: spacing.lg,
    gap: spacing.md,
  },
  warningContent: {
    flex: 1,
    gap: spacing.sm,
  },
  warningTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.red[600],
    marginBottom: spacing.xs,
  },
  warningText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.red[700],
  },
  confirmSection: {
    gap: spacing.md,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray[800],
  },
  input: {
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: spacing.sm,
    backgroundColor: colors.gray[900],
  },
  deleteButton: {
    backgroundColor: colors.red[500],
  },
  disabledButton: {
    backgroundColor: colors.gray[200],
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
});
