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

export const formatAuthorDate = (date: string | null, isBc: boolean | null) => {
  if (!date) return null;
  const year = new Date(date).getFullYear();
  return isBc ? `BC ${year}` : year;
};

export const formatAuthorLifespan = (
  bornDate: string | null,
  bornDateIsBc: boolean | null,
  diedDate: string | null,
  diedDateIsBc: boolean | null,
) => {
  const birth = formatAuthorDate(bornDate, bornDateIsBc);
  const death = formatAuthorDate(diedDate, diedDateIsBc);

  if (!birth && !death) return '';
  if (!death) return `${birth}년 ~`;
  return `${birth}년 - ${death}년`;
};

export function formatPublishedDate(date: string, isBc?: boolean, circa?: boolean, century?: boolean, s?: boolean, posthumous?: boolean): string {
  let dateText = date;
  
  if (isBc) {
    dateText = `BC ${dateText}`;
  }
  
  if (circa) {
    dateText = `c. ${dateText}`;
  }
  
  if (century) {
    dateText = `${dateText}세기`;
  }
  
  if (s) {
    dateText = `${dateText}s`;
  }
  
  if (posthumous) {
    dateText = `${dateText} (사후 출판)`;
  }
  
  return dateText;
}
