import { AuthorDetail } from '@/types/author';
import { PaginatedResponse } from '@/types/common';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface UpdateLikeParams {
  authorId: number;
  isOptimistic: boolean;
  currentStatus?: {
    isLiked: boolean;
    likeCount: number;
  };
}

export function useAuthorQueryData() {
  const queryClient = useQueryClient();

  function updateAuthorLikeQueryData({ authorId, isOptimistic, currentStatus }: UpdateLikeParams) {
    // 작가 목록 쿼리 데이터 업데이트
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<AuthorDetail>>>>(
      {
        queryKey: ['authors'],
        exact: false,
      },
      function updateAuthorListQueryData(authorListData) {
        if (!authorListData?.pages) return authorListData;

        return {
          ...authorListData,
          pages: authorListData.pages.map(authorPage => {
            if (!authorPage?.data?.data) return authorPage;

            return {
              ...authorPage,
              data: {
                ...authorPage.data,
                data: authorPage.data.data.map(author => {
                  if (author.id !== authorId) return author;
                  return {
                    ...author,
                    isLiked: isOptimistic
                      ? !author.isLiked
                      : currentStatus?.isLiked ?? author.isLiked,
                    likeCount: isOptimistic
                      ? author.isLiked
                        ? author.likeCount - 1
                        : author.likeCount + 1
                      : currentStatus?.likeCount ?? author.likeCount,
                  };
                }),
              },
            };
          }),
        };
      },
    );

    // 단일 작가 쿼리 데이터 업데이트
    queryClient.setQueryData<AxiosResponse<AuthorDetail>>(
      ['author', authorId],
      function updateAuthorDetailQueryData(authorDetailData) {
        if (!authorDetailData) return authorDetailData;

        if (isOptimistic) {
          return {
            ...authorDetailData,
            data: {
              ...authorDetailData.data,
              isLiked: !authorDetailData.data.isLiked,
              likeCount: authorDetailData.data.isLiked
                ? authorDetailData.data.likeCount - 1
                : authorDetailData.data.likeCount + 1,
            },
          };
        }

        // Rollback case
        return {
          ...authorDetailData,
          data: {
            ...authorDetailData.data,
            isLiked: currentStatus?.isLiked ?? authorDetailData.data.isLiked,
            likeCount: currentStatus?.likeCount ?? authorDetailData.data.likeCount,
          },
        };
      },
    );
  }

  return { updateAuthorLikeQueryData };
}
