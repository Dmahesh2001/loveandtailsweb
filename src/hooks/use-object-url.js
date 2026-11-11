import { useEffect, useState } from 'react';

/* Blob URL for a picked File; revoked when the file changes or the component unmounts. */
export function useObjectUrl(file) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file) return undefined;
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return file ? url : null;
}
