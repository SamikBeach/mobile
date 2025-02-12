import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from '@/components/common';
import { colors, spacing } from '@/styles/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;

export function TermsScreen({ navigation, route }: Props) {
  const { onAgree } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이용 약관</Text>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.section}>1. 콘텐츠 정책</Text>
        <Text style={styles.text}>
          • 사용자는 다른 사용자를 존중해야 하며, 혐오 발언이나 차별적인 내용을 게시할 수 없습니다.
          {'\n'}• 불법적이거나 유해한 콘텐츠는 엄격히 금지됩니다.{'\n'}• 저작권을 침해하는 콘텐츠는
          게시할 수 없습니다.{'\n'}• 스팸이나 광고성 콘텐츠는 제한됩니다.
        </Text>

        <Text style={styles.section}>2. 제재 정책</Text>
        <Text style={styles.text}>
          • 이용 약관을 위반하는 경우 경고 없이 계정이 정지될 수 있습니다.{'\n'}• 신고된 콘텐츠는
          24시간 이내에 검토되며, 위반 사항 발견 시 즉시 삭제됩니다.{'\n'}• 악의적인 신고나 허위
          신고를 하는 사용자도 제재 대상이 됩니다.
        </Text>

        <Text style={styles.section}>3. 개인정보 보호</Text>
        <Text style={styles.text}>
          • 사용자의 개인정보는 관련 법률에 따라 안전하게 보호됩니다.{'\n'}• 타인의 개인정보를
          무단으로 수집하거나 공개하는 행위는 금지됩니다.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={() => navigation.goBack()}>취소</Button>
        <Button variant="solid" onPress={onAgree}>
          동의하기
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    padding: spacing.lg,
    color: colors.gray[900],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.gray[900],
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.gray[700],
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
});
