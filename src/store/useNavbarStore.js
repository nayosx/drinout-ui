import { create } from 'zustand';

const useNavbarStore = create((set) => ({
  title: 'DrClin System',
  setTitle: (newTitle) => set({ title: newTitle || 'DrClin System' }),
}));

export default useNavbarStore;
