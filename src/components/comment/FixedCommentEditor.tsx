import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Text } from '@/components/common/Text';
import { colors, spacing } from '@/styles/theme';
import { UserAvatar } from '@/components/common/UserAvatar';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

interface Props {
  onPress: () => void;
  placeholder?: string;
}

export function FixedCommentEditor({ onPress, placeholder = '댓글을 입력하세요...' }: Props) {
  const currentUser = useCurrentUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    onPress();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={styles.container}>
        <View style={styles.inner}>
          {currentUser && <UserAvatar user={currentUser} size="sm" />}
          <Pressable style={styles.inputContainer} onPress={handlePress}>
            <Text style={styles.placeholder}>{placeholder}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  placeholder: {
    color: colors.gray[500],
    fontSize: 14,
  },
});
