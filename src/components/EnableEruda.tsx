'use client';

import { useEffect } from 'react';

export default function EnableEruda() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.NEXT_PUBLIC_ENABLE_ERUDA !== 'true'
    ) {
      return;
    }
    import('eruda').then((eruda) => eruda.default.init());
  }, []);

  return null;
}