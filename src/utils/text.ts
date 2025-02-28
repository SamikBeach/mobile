/**
 * 한글 이름의 마지막 글자에 따라 적절한 조사(과/와)를 반환합니다.
 * @param name 조사를 붙일 한글 이름
 * @returns '과' 또는 '와' 조사
 */
export function getJosa(name: string): string {
  if (!name) return '와';

  const lastChar = name.charAt(name.length - 1);
  const lastCharCode = lastChar.charCodeAt(0);

  // 한글 유니코드 범위 내에 있는지 확인
  if (lastCharCode >= 0xac00 && lastCharCode <= 0xd7a3) {
    // 종성이 있는지 확인 (종성이 있으면 받침이 있음)
    const hasJongseong = (lastCharCode - 0xac00) % 28 > 0;
    return hasJongseong ? '과' : '와';
  }

  return '와'; // 기본값
} 