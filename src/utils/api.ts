/**
 * 중첩된 필터 객체를 점 표기법의 쿼리 파라미터로 변환합니다.
 * @example
 * const params = { filter: { name: 'John', 'user.age': 20 } };
 * const transformed = transformFilterParams(params);
 * // { 'filter.name': 'John', 'filter.user.age': 20 }
 */
export function transformFilterParams<T>(
  params: T & { filter?: Record<string, unknown> }
): Record<string, unknown> {
  const transformedParams = { ...params } as Record<string, unknown>;

  if (params.filter) {
    // 중첩된 필터 객체를 점 표기법으로 변환
    Object.entries(params.filter).forEach(([key, value]) => {
      if (value !== undefined) {
        transformedParams[`filter.${key}`] = value;
      }
    });
    // 원본 필터 객체 제거
    delete transformedParams.filter;
  }

  return transformedParams;
}