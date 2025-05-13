import { create } from 'zustand';

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface VariableSelectionState {
  // Using a Record to store selections for dynamic categories
  // Key: categoryId (e.g., "Variable Category 1")
  // Value: Set of selected option IDs for that category
  categorySelections: Record<string, Set<string>>;

  // Action to initialize or update options for a category, including initial selections
  initializeCategory: (categoryId: string, initialSelectedIds?: string[]) => void;

  // Action to toggle an option's selection state for a specific category
  toggleOptionSelection: (categoryId: string, optionId: string) => void;

  // Selector to get selected options for a specific category
  getSelectedOptions: (categoryId: string) => Set<string>;

  // (Optional) Action to set all selections for a category (e.g., from an API response)
  setCategorySelections: (categoryId: string, selectedIds: string[]) => void;

  // (Optional) Action to clear selections for a specific category
  clearCategorySelections: (categoryId: string) => void;

  // (Optional) Action to clear all selections
  clearAllSelections: () => void;
}

export const useVariableSelectionStore = create<VariableSelectionState>((set, get) => ({
  categorySelections: {},

  initializeCategory: (categoryId, initialSelectedIds = []) => {
    set((state) => {
      // Initialize only if the category doesn't exist or if explicitly re-initializing
      if (!state.categorySelections[categoryId]) {
        return {
          categorySelections: {
            ...state.categorySelections,
            [categoryId]: new Set(initialSelectedIds),
          },
        };
      }
      return state; // If already initialized, do nothing unless you want to override
    });
  },

  toggleOptionSelection: (categoryId, optionId) => {
    set((state) => {
      const currentSelections = state.categorySelections[categoryId] ? new Set(state.categorySelections[categoryId]) : new Set<string>();
      if (currentSelections.has(optionId)) {
        currentSelections.delete(optionId);
      } else {
        currentSelections.add(optionId);
      }
      return {
        categorySelections: {
          ...state.categorySelections,
          [categoryId]: currentSelections,
        },
      };
    });
  },

  getSelectedOptions: (categoryId) => {
    return get().categorySelections[categoryId] || new Set<string>();
  },

  setCategorySelections: (categoryId, selectedIds) => {
    set((state) => ({
      categorySelections: {
        ...state.categorySelections,
        [categoryId]: new Set(selectedIds),
      },
    }));
  },

  clearCategorySelections: (categoryId) => {
    set((state) => {
      const newSelections = { ...state.categorySelections };
      delete newSelections[categoryId]; // Or set to new Set() if category should persist with no selections
      return { categorySelections: newSelections };
    });
  },

  clearAllSelections: () => {
    set({ categorySelections: {} });
  },
}));

// Example of how to use the Option interface if needed within the store,
// though the store primarily deals with IDs.
// You might have another store for managing the actual option data (labels, descriptions)
// if that data is also dynamic and shared. For now, option details are passed as props.
export type { Option as VariableOption }; 