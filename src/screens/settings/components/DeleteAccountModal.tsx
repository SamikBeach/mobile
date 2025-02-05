import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/theme';
import Icon from 'react-native-vector-icons/Feather';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteAccountModal({
  visible,
  onClose,
  onConfirm,
  isLoading,
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>계정 삭제</Text>

          <View style={styles.warningContainer}>
            <Icon name="alert-triangle" size={20} color={colors.red[500]} />
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>삭제 전 꼭 확인해 주세요</Text>
              <Text style={styles.warningText}>• 모든 리뷰 기록이 삭제돼요.</Text>
              <Text style={styles.warningText}>• 북마크한 책과 작가 정보가 삭제돼요.</Text>
              <Text style={styles.warningText}>• 삭제된 계정은 복구할 수 없어요.</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>계정 삭제를 원하시면 아래에 '삭제'를 입력해 주세요.</Text>
            <TextInput
              style={styles.input}
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="삭제"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, isLoading && styles.disabledButton]}
              onPress={onClose}
              disabled={isLoading}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.destructiveButton,
                (confirmText !== '삭제' || isLoading) && styles.disabledButton,
              ]}
              onPress={onConfirm}
              disabled={confirmText !== '삭제' || isLoading}>
              <Text style={styles.destructiveButtonText}>
                {isLoading ? '처리중...' : '계정 영구 삭제하기'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: colors.red[50],
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.red[500],
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.red[700],
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.gray[100],
  },
  destructiveButton: {
    backgroundColor: colors.red[500],
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
  },
  destructiveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
