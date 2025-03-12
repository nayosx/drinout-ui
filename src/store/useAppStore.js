import { create } from 'zustand';

const useAppStore = create((set) => ({
  title: 'DrClin System',
  setTitle: (newTitle) => set({ title: newTitle || 'DrClin System' }),
}));

export default useAppStore;
