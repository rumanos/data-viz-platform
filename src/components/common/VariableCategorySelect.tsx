import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Plus, Gem, Check } from 'lucide-react';
import { motion } from 'motion/react';
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

  const detailViewDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [activelyHoveringOptionId, setActivelyHoveringOptionId] = useState<string | null>(null);

  useEffect(() => {
    initializeCategoryInStore(categoryTitle, initialSelectedIds);

    return () => {
      if (detailViewDelayTimerRef.current) {
        clearTimeout(detailViewDelayTimerRef.current);
      }
    };
  }, [categoryTitle, initialSelectedIds, initializeCategoryInStore]);

  const clearTimersAndResetProgress = useCallback(() => {
    if (detailViewDelayTimerRef.current) {
      clearTimeout(detailViewDelayTimerRef.current);
      detailViewDelayTimerRef.current = null;
    }
    setActivelyHoveringOptionId(null);
  }, []);

  useEffect(() => {
    return () => {
      clearTimersAndResetProgress();
    };
  }, [clearTimersAndResetProgress]);

  const handleOptionClick = useCallback((clickedOptionId: string) => {
    clearTimersAndResetProgress();
    onRequestHideDetail();

    toggleOptionInStore(categoryTitle, clickedOptionId);

    // Check if the clicked option is now selected and should trigger detail view timing
    const currentSelections = useVariableSelectionStore.getState().getSelectedOptions(categoryTitle); // Get fresh state
    const option = options.find(o => o.id === clickedOptionId);

    if (option && currentSelections.has(clickedOptionId) && option.description) {
      setActivelyHoveringOptionId(option.id); // Show progress bar in next render

      // Start timer for detail view
      const animationDuration = 1500; // Consistent with handleOptionMouseEnter and animation
      // detailViewDelayTimerRef.current is already cleared by clearTimersAndResetProgress
      detailViewDelayTimerRef.current = setTimeout(() => {
        onRequestShowDetail(option);
      }, animationDuration);
    }

    if (onSelectionChange) {
      onSelectionChange(Array.from(currentSelections));
    }
  }, [
    categoryTitle,
    options,
    onSelectionChange,
    onRequestHideDetail,
    onRequestShowDetail,
    toggleOptionInStore,
    clearTimersAndResetProgress,
    setActivelyHoveringOptionId,
  ]);

  const handleOptionMouseEnter = useCallback((option: Option) => {
    clearTimersAndResetProgress();
    setActivelyHoveringOptionId(option.id);

    const currentSelectedIds = selectedIdsFromStore;
    if (currentSelectedIds.has(option.id) && option.description) {
      const animationDuration = 1500;

      detailViewDelayTimerRef.current = setTimeout(() => {
        onRequestShowDetail(option);
      }, animationDuration);
    }
  }, [selectedIdsFromStore, onRequestShowDetail, clearTimersAndResetProgress]);

  const handleOptionMouseLeave = useCallback(() => {
    clearTimersAndResetProgress();
    onRequestHideDetail();
  }, [onRequestHideDetail, clearTimersAndResetProgress]);

  
  const baseButtonClasses = `
    relative overflow-hidden isolate
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
          const isBeingHoveredWithDescription = activelyHoveringOptionId === option.id && isSelected && option.description;
          const animationDurationSeconds = 1.5;

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
              {isBeingHoveredWithDescription && (
                <motion.div
                  className="absolute top-0 left-0 h-full bg-lime-600/30 -z-10"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: animationDurationSeconds, ease: "linear" }}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10">{option.label}</span> 
              <Gem size={14} className={`relative z-10 ${isSelected ? selectedIconColor : unselectedIconColor}`} />
              {isSelected ? (
                <Check size={14} className={`relative z-10 ${selectedIconColor}`} />
              ) : (
                <Plus size={14} className={`relative z-10 ${unselectedIconColor}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
