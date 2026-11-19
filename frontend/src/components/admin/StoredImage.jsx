'use client';

import { useCallback } from 'react';
import { PLATFORM_LOGO_TYPES } from '@/lib/domain/platform';

export default function StoredImage({ blob, alt }) {
  const attach = useCallback(element => {
    if (!element) return;
    const url = URL.createObjectURL(blob);
    element.src = url;
    return () => {
      element.removeAttribute('src');
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  if (!blob?.size || !PLATFORM_LOGO_TYPES.includes(blob.type)) return null;
  return <img ref={attach} alt={alt} className="d-block img-fluid mb-3" style={{ maxHeight: 120 }} />;
}
