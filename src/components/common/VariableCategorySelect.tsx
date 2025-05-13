import React, { useEffect, useCallback, useRef } from 'react';
import { Plus, Gem, Check } from 'lucide-react';
import { useVariableSelectionStore } from '../../store/variableSelectionStore';

// Optional description for the context window
interface Option {
  id: string;
  label: string;
  description?: string;
}

// Callbacks to request showing/hiding details in the parent
interface VariableCategorySelectProps {
  categoryTitle: string;
  options: Option[];
  initialSelectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onRequestShowDetail: (option: Option) => void;
  onRequestHideDetail: () => void;
}

export const VariableCategorySelect: React.FC<VariableCategorySelectProps> = ({
  categoryTitle,
  options,
  initialSelectedIds = [],
  onSelectionChange,
  onRequestShowDetail,
  onRequestHideDetail,
}) => {
  const initializeCategoryInStore = useVariableSelectionStore((state) => state.initializeCategory);
  const toggleOptionInStore = useVariableSelectionStore((state) => state.toggleOptionSelection);
  const selectedIdsFromStore = useVariableSelectionStore((state) => state.getSelectedOptions(categoryTitle));

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeCategoryInStore(categoryTitle, initialSelectedIds);

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  }, [categoryTitle, initialSelectedIds, initializeCategoryInStore]);

  const clearLocalHoverTimer = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearLocalHoverTimer();
    };
  }, [clearLocalHoverTimer]);

  const handleOptionClick = useCallback((optionId: string) => {
    clearLocalHoverTimer();
    onRequestHideDetail();

    toggleOptionInStore(categoryTitle, optionId);

    const currentSelections = useVariableSelectionStore.getState().getSelectedOptions(categoryTitle);
    if (onSelectionChange) {
      onSelectionChange(Array.from(currentSelections));
    }
  }, [categoryTitle, onSelectionChange, onRequestHideDetail, toggleOptionInStore, clearLocalHoverTimer]);

  const handleOptionMouseEnter = useCallback((option: Option) => {
    clearLocalHoverTimer();

    const currentSelectedIds = selectedIdsFromStore;
    if (currentSelectedIds.has(option.id) && option.description) {
      hoverTimerRef.current = setTimeout(() => {
        onRequestShowDetail(option);
      }, 1500);
    }
  }, [selectedIdsFromStore, onRequestShowDetail, clearLocalHoverTimer]);

  const handleOptionMouseLeave = useCallback(() => {
    clearLocalHoverTimer();
    onRequestHideDetail();
  }, [onRequestHideDetail, clearLocalHoverTimer]);

  
  const baseButtonClasses = `
    flex items-center justify-center gap-1.5 
    px-4 py-2 sm:px-4 sm:py-2 rounded-full
    border text-sm sm:text-sm font-medium 
    transition-colors duration-150 ease-in-out
    focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-offset-neutral-900
  `;
  const selectedButtonClasses = `
    border-lime-400 bg-neutral-800 text-lime-400 
    hover:bg-neutral-700 focus:ring-lime-500
  `;
  const selectedIconColor = "text-lime-400";
  const unselectedButtonClasses = `
    border-neutral-600 bg-neutral-700 hover:bg-neutral-600
    text-neutral-200 focus:ring-neutral-500
  `;
  const unselectedIconColor = "text-neutral-300";

  return (
    <div className="space-y-3 md:space-y-4 p-1">
      <h2 className="text-sm sm:text-md font-semibold text-neutral-200">
        {categoryTitle}
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {options.map((option) => {
          const isSelected = selectedIdsFromStore.has(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOptionClick(option.id)}
              onMouseEnter={() => handleOptionMouseEnter(option)}
              onMouseLeave={handleOptionMouseLeave}
              className={`
                ${baseButtonClasses}
                ${isSelected ? selectedButtonClasses : unselectedButtonClasses}
              `}
              aria-pressed={isSelected}
            >
              <span>{option.label}</span>
              <Gem size={14} className={isSelected ? selectedIconColor : unselectedIconColor} />
              {isSelected ? (
                <Check size={14} className={selectedIconColor} />
              ) : (
                <Plus size={14} className={unselectedIconColor} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
