import { create } from 'zustand';

interface SidebarState {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;
  selectedMenuKey: string;
  setSelectedMenuKey: (key: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  expanded: false,
  setExpanded: (expanded) => set({ expanded }),
  toggleExpanded: () => set((state) => ({ expanded: !state.expanded })),
  selectedMenuKey: 'home',
  setSelectedMenuKey: (key) => set({ selectedMenuKey: key }),
})); 