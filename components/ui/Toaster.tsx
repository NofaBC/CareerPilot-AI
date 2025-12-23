'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function Toaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 space-y-2" />,
    document.body
  );
}
