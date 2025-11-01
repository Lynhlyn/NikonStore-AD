export function toMutableRefObject<T>(
  forwardedRef: React.ForwardedRef<T>,
): React.MutableRefObject<T | null> {
  if (typeof forwardedRef === 'function') {
    return { current: null };
  } else if (forwardedRef) {
    return forwardedRef;
  } else {
    return { current: null };
  }
}

export function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> {
  return value => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

