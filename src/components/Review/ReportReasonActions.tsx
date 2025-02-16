import React from 'react';
import { ActionSheet } from '../common/ActionSheet/ActionSheet';
import { useMutation } from '@tanstack/react-query';
import { reviewApi } from '@/apis/review';
import Toast from 'react-native-toast-message';
import type { ReportReason } from '@/types/review';
import { AxiosError } from 'axios';

interface Props {
  visible: boolean;
  onClose: () => void;
  reviewId: number;
}

const REPORT_REASONS: Array<{ text: string; value: ReportReason; icon: string }> = [
  { text: '부적절한 내용', value: 'INAPPROPRIATE', icon: 'alert-circle' },
  { text: '스팸', value: 'SPAM', icon: 'slash' },
  { text: '저작권 침해', value: 'COPYRIGHT', icon: 'file-text' },
  { text: '혐오 발언', value: 'HATE_SPEECH', icon: 'message-square' },
  { text: '기타', value: 'OTHER', icon: 'more-horizontal' },
];

export function ReportReasonActions({ visible, onClose, reviewId }: Props) {
  const { mutate: reportReview } = useMutation({
    mutationFn: (reason: ReportReason) => reviewApi.reportReview(reviewId, { reason }),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: '신고가 접수되었습니다.',
        text2: '24시간 이내에 검토 후 조치하겠습니다.',
      });
      onClose();
    },
    onError: error => {
      if (error instanceof AxiosError && error.response?.status === 409) {
        Toast.show({
          type: 'error',
          text1: '이미 신고한 리뷰입니다.',
          text2: '동일한 리뷰에 대해 중복 신고는 불가능합니다.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: '신고 접수에 실패했습니다.',
          text2: '잠시 후 다시 시도해주세요.',
        });
      }
      onClose();
    },
  });

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      title="신고 사유 선택"
      actions={REPORT_REASONS.map(reason => ({
        text: reason.text,
        icon: reason.icon,
        onPress: () => reportReview(reason.value),
      }))}
    />
  );
}
