import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';

export function PrivacyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>개인정보처리방침</Text>

      <Section title="1. 개인정보의 처리 목적">
        <Text style={styles.content}>
          회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적
          이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에
          따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• 회원 가입 및 관리</Text>
          <Text style={styles.listItem}>• 서비스 제공 및 운영</Text>
          <Text style={styles.listItem}>• 마케팅 및 광고 활용 (선택)</Text>
        </View>
      </Section>

      <Section title="2. 개인정보의 처리 및 보유기간">
        <Text style={styles.content}>
          1. 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
          동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
        </Text>
        <Text style={styles.content}>2. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• 회원 가입 정보: 회원 탈퇴 시까지</Text>
          <Text style={styles.listItem}>• 리뷰 및 댓글: 삭제 시까지</Text>
          <Text style={styles.listItem}>• 로그인 기록: 1년</Text>
        </View>
      </Section>

      <Section title="3. 정보주체의 권리·의무 및 행사방법">
        <Text style={styles.content}>
          정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• 개인정보 열람 요구</Text>
          <Text style={styles.listItem}>• 오류 등이 있을 경우 정정 요구</Text>
          <Text style={styles.listItem}>• 삭제 요구</Text>
          <Text style={styles.listItem}>• 처리정지 요구</Text>
        </View>
      </Section>

      <Section title="4. 처리하는 개인정보 항목">
        <Text style={styles.content}>회사는 다음의 개인정보 항목을 처리하고 있습니다.</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• 필수항목: 이메일, 비밀번호, 닉네임</Text>
          <Text style={styles.listItem}>• 선택항목: 프로필 이미지</Text>
          <Text style={styles.listItem}>• 자동수집항목: 접속 IP, 쿠키, 접속 로그</Text>
        </View>
      </Section>

      <Section title="5. 개인정보의 안전성 확보조치">
        <Text style={styles.content}>
          회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• 관리적 조치: 내부관리계획 수립 및 시행, 정기적 직원 교육</Text>
          <Text style={styles.listItem}>
            • 기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보
            등의 암호화, 보안프로그램 설치
          </Text>
          <Text style={styles.listItem}>• 물리적 조치: 전산실, 자료보관실 등의 접근통제</Text>
        </View>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  sectionContent: {
    gap: spacing.sm,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[600],
  },
  list: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[600],
  },
});
