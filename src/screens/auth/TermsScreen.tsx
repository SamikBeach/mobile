import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/styles/theme';

export function TermsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>이용약관</Text>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제1조 (목적)</Text>
          <Text style={styles.text}>
            이 약관은 회사가 제공하는 독서 커뮤니티 서비스의 이용과 관련하여 회사와 회원 간의 권리,
            의무 및 책임사항을 규정함을 목적으로 합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제2조 (정의)</Text>
          <Text style={styles.text}>1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.</Text>
          <Text style={styles.text}>
            2. "회원"이란 서비스에 가입하여 이용하는 모든 사용자를 의미합니다.
          </Text>
          <Text style={styles.text}>
            3. "리뷰"란 회원이 서비스 내에서 작성하는 모든 형태의 게시물을 의미합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제3조 (약관의 효력)</Text>
          <Text style={styles.text}>
            1. 회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
          </Text>
          <Text style={styles.text}>
            2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제4조 (서비스의 제공)</Text>
          <Text style={styles.text}>1. 회사는 다음과 같은 서비스를 제공합니다.</Text>
          <Text style={[styles.text, styles.listItem]}>• 도서 정보 제공 서비스</Text>
          <Text style={[styles.text, styles.listItem]}>• 도서 리뷰 작성 및 공유 서비스</Text>
          <Text style={[styles.text, styles.listItem]}>• 작가 정보 제공 서비스</Text>
          <Text style={[styles.text, styles.listItem]}>• 회원 간 커뮤니케이션 서비스</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제5조 (회원의 의무)</Text>
          <Text style={styles.text}>1. 회원은 다음 행위를 하여서는 안 됩니다.</Text>
          <Text style={[styles.text, styles.listItem]}>• 타인의 정보 도용</Text>
          <Text style={[styles.text, styles.listItem]}>• 회사가 게시한 정보의 변경</Text>
          <Text style={[styles.text, styles.listItem]}>
            • 서비스를 이용하여 얻은 정보의 무단 복제, 배포, 방송
          </Text>
          <Text style={[styles.text, styles.listItem]}>
            • 회사나 제3자의 저작권 등 지적재산권 침해
          </Text>
          <Text style={[styles.text, styles.listItem]}>
            • 회사나 제3자의 명예를 손상시키거나 업무를 방해하는 행위
          </Text>
        </View>
      </ScrollView>
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
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
    color: colors.gray[900],
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  listItem: {
    paddingLeft: spacing.md,
  },
});
