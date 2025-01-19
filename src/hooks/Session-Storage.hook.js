import { useEffect, useState } from 'react';

export const useStore = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            if (storedValue !== undefined) {
                window.sessionStorage.setItem(key, JSON.stringify(storedValue));
            } else {
                window.sessionStorage.removeItem(key);
            }
        } catch (error) {
            console.error('Error writing to sessionStorage:', error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
};
