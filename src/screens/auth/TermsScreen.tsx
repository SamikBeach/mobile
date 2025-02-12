import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';

export function TermsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>이용약관</Text>

      <Section title="제1조 (목적)">
        <Text style={styles.content}>
          이 약관은 회사가 제공하는 독서 커뮤니티 서비스의 이용과 관련하여 회사와 회원 간의 권리,
          의무 및 책임사항을 규정함을 목적으로 합니다.
        </Text>
      </Section>

      <Section title="제2조 (정의)">
        <Text style={styles.content}>1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.</Text>
        <Text style={styles.content}>
          2. "회원"이란 서비스에 가입하여 이용하는 모든 사용자를 의미합니다.
        </Text>
        <Text style={styles.content}>
          3. "리뷰"란 회원이 서비스 내에서 작성하는 모든 형태의 게시물을 의미합니다.
        </Text>
      </Section>

      <Section title="제3조 (약관의 효력)">
        <Text style={styles.content}>
          1. 회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
        </Text>
        <Text style={styles.content}>
          2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
        </Text>
      </Section>

      <Section title="제4조 (서비스의 제공)">
        <Text style={styles.content}>1. 회사는 다음과 같은 서비스를 제공합니다.</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• 도서 정보 제공 서비스</Text>
          <Text style={styles.listItem}>• 도서 리뷰 작성 및 공유 서비스</Text>
          <Text style={styles.listItem}>• 작가 정보 제공 서비스</Text>
          <Text style={styles.listItem}>• 회원 간 커뮤니케이션 서비스</Text>
        </View>
      </Section>

      <Section title="제5조 (회원의 의무)">
        <Text style={styles.content}>1. 회원은 다음 행위를 하여서는 안 됩니다.</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• 타인의 정보 도용</Text>
          <Text style={styles.listItem}>• 회사가 게시한 정보의 변경</Text>
          <Text style={styles.listItem}>• 서비스를 이용하여 얻은 정보의 무단 복제, 배포, 방송</Text>
          <Text style={styles.listItem}>• 회사나 제3자의 저작권 등 지적재산권 침해</Text>
          <Text style={styles.listItem}>• 회사나 제3자의 명예를 손상시키거나 업무를 방해하는 행위</Text>
        </View>
      </Section>

      <Section title="제6조 (서비스의 중단)">
        <Text style={styles.content}>
          1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한
          경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
        </Text>
        <Text style={styles.content}>
          2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가
          입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는
          그러하지 아니합니다.
        </Text>
      </Section>

      <Section title="제7조 (콘텐츠 관리 및 제재)">
        <Text style={styles.content}>
          1. 회사는 다음과 같은 콘텐츠를 금지하며, 발견 시 즉시 삭제 조치합니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• 타인을 비방하거나 명예를 훼손하는 내용</Text>
          <Text style={styles.listItem}>• 음란물 또는 청소년에게 유해한 내용</Text>
          <Text style={styles.listItem}>• 불법 정보 또는 범죄를 조장하는 내용</Text>
          <Text style={styles.listItem}>• 타인의 저작권을 침해하는 내용</Text>
          <Text style={styles.listItem}>• 악성코드나 스팸성 내용</Text>
        </View>
        <Text style={styles.content}>
          2. 회원은 부적절한 콘텐츠를 발견할 경우 신고할 수 있으며, 회사는 신고된 콘텐츠를 24시간 이내에 검토하여 조치합니다.
        </Text>
        <Text style={styles.content}>
          3. 회원은 다른 회원을 차단할 수 있으며, 차단된 회원의 콘텐츠는 더 이상 표시되지 않습니다.
        </Text>
        <Text style={styles.content}>
          4. 제1항의 금지 콘텐츠를 반복적으로 게시하는 회원은 서비스 이용이 제한될 수 있습니다.
        </Text>
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
    gap: spacing.sm,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[600],
  },
});
