import { useState } from 'react';

export const useStore = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from sessionStorage:`, error);
      return initialValue;
    }
  });

  const updateValue = (value) => {
    try {
      if (value !== undefined) {
        sessionStorage.setItem(key, JSON.stringify(value));
        setStoredValue(value);
      } else {
        sessionStorage.removeItem(key);
        setStoredValue(undefined);
      }
    } catch (error) {
      console.error(`Error writing ${key} to sessionStorage:`, error);
    }
  };

  return [storedValue, updateValue];
};
