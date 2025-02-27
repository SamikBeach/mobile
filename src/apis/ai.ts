import axios from '@/lib/axios';
import { ChatWithAuthorRequest, ChatWithAuthorResponse } from '@/types/common';

export const aiApi = {
  /**
   * 작가와 대화합니다.
   */
  chatWithAuthor: (
    authorId: number,
    request: ChatWithAuthorRequest,
    signal?: AbortSignal
  ) =>
    axios.post<ChatWithAuthorResponse>(`/ai/author/${authorId}/chat`, request, {
      signal,
    }),
}; 