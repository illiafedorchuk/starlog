// src/hooks/useDraft.ts
import { useEffect, useState } from "react";

export function useDraft(key: string) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) ?? "";
    } catch {
      return ""; // storage blocked (private mode, etc.)
    }
  });

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        if (value) localStorage.setItem(key, value);
        else localStorage.removeItem(key);
      } catch {
        /* ignore quota or blocked storage */
      }
    }, 400);
    return () => clearTimeout(id);
  }, [key, value]);

  return [value, setValue] as const;
}