import type { Book } from '@/types/book';
import type { PaginatedResponse } from '@/types/common';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

interface UpdateLikeParams {
  bookId: number;
  isOptimistic: boolean;
  currentStatus?: {
    isLiked: boolean;
    likeCount: number;
  };
}

export function useBookQueryData() {
  const queryClient = useQueryClient();

  function updateBookLikeQueryData({
    bookId,
    isOptimistic,
    currentStatus,
  }: UpdateLikeParams) {
    // 책 목록 쿼리 데이터 업데이트
    queryClient.setQueriesData<InfiniteData<AxiosResponse<PaginatedResponse<Book>>>>(
      {
        queryKey: ['books'],
        exact: false,
      },
      function updateBookListQueryData(bookListData) {
        if (!bookListData) return bookListData;
        return {
          ...bookListData,
          pages: bookListData.pages.map(bookPage => ({
            ...bookPage,
            data: {
              ...bookPage.data,
              data: bookPage.data.data.map(book => {
                if (book.id !== bookId) return book;
                return {
                  ...book,
                  isLiked: isOptimistic ? !book.isLiked : currentStatus?.isLiked ?? book.isLiked,
                  likeCount: isOptimistic
                    ? book.isLiked
                      ? book.likeCount - 1
                      : book.likeCount + 1
                    : currentStatus?.likeCount ?? book.likeCount,
                };
              }),
            },
          })),
        };
      },
    );

    // 단일 책 쿼리 데이터 업데이트
    queryClient.setQueryData<AxiosResponse<Book>>(
      ['book', bookId],
      function updateBookDetailQueryData(bookDetailData) {
        if (!bookDetailData) return bookDetailData;

        if (isOptimistic) {
          return {
            ...bookDetailData,
            data: {
              ...bookDetailData.data,
              isLiked: !bookDetailData.data.isLiked,
              likeCount: bookDetailData.data.isLiked
                ? bookDetailData.data.likeCount - 1
                : bookDetailData.data.likeCount + 1,
            },
          };
        }

        // Rollback case
        return {
          ...bookDetailData,
          data: {
            ...bookDetailData.data,
            isLiked: currentStatus?.isLiked ?? bookDetailData.data.isLiked,
            likeCount: currentStatus?.likeCount ?? bookDetailData.data.likeCount,
          },
        };
      },
    );
  }

  return { updateBookLikeQueryData };
} 