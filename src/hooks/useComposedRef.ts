import { ForwardedRef, MutableRefObject, useCallback } from 'react';

type PossibleRef<T> = MutableRefObject<T> | ForwardedRef<T> | undefined;

/**
 * 여러 개의 ref를 하나로 합치는 훅
 * @param refs - 합칠 ref들
 * @returns 합쳐진 ref callback
 * @example
 * const composedRef = useComposedRef(ref1, ref2, ref3);
 * <div ref={composedRef} />;
 */
export function useComposedRef<T>(...refs: PossibleRef<T | null>[]) {
  return useCallback(
    (element: T | null) => {
      refs.forEach(ref => {
        if (!ref) return;

        if (typeof ref === 'function') {
          ref(element);
        } else {
          (ref as MutableRefObject<T | null>).current = element;
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
