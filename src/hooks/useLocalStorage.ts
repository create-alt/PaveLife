// src/hooks/useLocalStorage.ts

import { useState, useEffect } from 'react';

// T は <LifeData> のような型
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. stateの初期値をlocalStorageから取得する
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // 2. valueが変更されるたびにlocalStorageを更新する
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}