import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/apis/user';
import { ActionSheet } from '../common/ActionSheet/ActionSheet';
import { ReportReasonActions } from './ReportReasonActions';
import Toast from 'react-native-toast-message';

interface Props {
  visible: boolean;
  onClose: () => void;
  reviewId: number;
  userId: number;
  userNickname: string;
}

export function ReportActions({ visible, onClose, reviewId, userId, userNickname }: Props) {
  const queryClient = useQueryClient();

  const [showReportReason, setShowReportReason] = useState(false);

  const { mutate: blockUser } = useMutation({
    mutationFn: () => userApi.blockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });

      Toast.show({
        type: 'success',
        text1: '사용자를 차단했습니다.',
      });

      onClose();
    },
  });

  const handleReport = () => {
    onClose();
    setShowReportReason(true);
  };

  const handleBlock = () => {
    Alert.alert(
      '사용자 차단',
      `${userNickname}님을 차단하시겠습니까?\n차단한 사용자의 콘텐츠는 더 이상 표시되지 않습니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '차단',
          style: 'destructive',
          onPress: () => {
            blockUser();
          },
        },
      ],
    );
  };

  return (
    <>
      <ActionSheet
        visible={visible}
        onClose={onClose}
        actions={[
          {
            text: '리뷰 신고하기',
            icon: 'flag',
            onPress: handleReport,
          },
          {
            text: `${userNickname} 차단하기`,
            icon: 'user-x',
            onPress: handleBlock,
            destructive: true,
          },
        ]}
      />

      <ReportReasonActions
        visible={showReportReason}
        onClose={() => setShowReportReason(false)}
        reviewId={reviewId}
      />
    </>
  );
}
