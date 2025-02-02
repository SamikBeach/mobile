import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(date: string) {
  const d = new Date(date);
  const now = new Date();

  if (now.getTime() - d.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(d, { addSuffix: true, locale: ko });
  }

  return format(d, 'yyyy년 M월 d일');
}
