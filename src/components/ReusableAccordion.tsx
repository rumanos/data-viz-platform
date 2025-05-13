import React, { useState, createContext, useContext, type ReactNode } from 'react';

// --- Icon ---
interface IconProps extends React.SVGProps<SVGSVGElement> {
  // You can add specific icon props if needed
}

const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props} // Spread additional props like className
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

// --- Shadcn/ui Inspired Accordion Components ---

// Context for managing accordion state (which items are open)
interface AccordionContextProps {
  openItemValue: string | null;
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple'; // Though this example focuses on 'single'
  defaultValue?: string;
}

const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion provider');
  }
  return context;
};

// Props for the main Accordion container
interface AccordionProps {
  children: ReactNode;
  /** Determines if multiple items can be open at once or only a single item. */
  type?: 'single' | 'multiple'; // For simplicity, this example will primarily support 'single'
  /** The value of the item that should be open by default. */
  defaultValue?: string;
  /** ClassName for custom styling */
  className?: string;
}

// Accordion Root Component (Provider)
const Accordion: React.FC<AccordionProps> = ({
  children,
  type = 'single',
  defaultValue,
  className,
}) => {
  const [openItemValue, setOpenItemValue] = useState<string | null>(defaultValue || null);

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItemValue(prevValue => (prevValue === value ? null : value));
    }
    // 'multiple' type would require managing an array of open values
  };

  return (
    <AccordionContext.Provider value={{ openItemValue, toggleItem, type, defaultValue }}>
      <div className={`w-full ${className || ''}`}>{children}</div>
    </AccordionContext.Provider>
  );
};

// Props for each AccordionItem
interface AccordionItemProps {
  children: ReactNode;
  /** A unique value for this accordion item. */
  value: string;
  className?: string;
}

// Accordion Item Component
const AccordionItem: React.FC<AccordionItemProps> = ({ children, value, className }) => {
  // This component mostly serves as a structural wrapper.
  // The context will be used by Trigger and Content.
  return (
    <div className={`border-b border-gray-700 last:border-b-0 ${className || ''}`}>
      {/* Pass value down implicitly or explicitly if needed by children */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // @ts-ignore // Allow passing itemValue to AccordionTrigger/Content
          return React.cloneElement(child, { itemValue: value });
        }
        return child;
      })}
    </div>
  );
};

// Props for AccordionTrigger (the clickable header)
interface AccordionTriggerProps {
  children: ReactNode;
  itemValue?: string; // Injected by AccordionItem
  className?: string;
}

// Accordion Trigger Component
const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, itemValue, className }) => {
  const { openItemValue, toggleItem } = useAccordionContext();
  if (!itemValue) {
    // This should ideally not happen if used correctly within AccordionItem
    console.warn("AccordionTrigger used outside of an AccordionItem or itemValue not passed.");
    return <button className="p-4 w-full text-left bg-neturtal-800 text-[#C8E972]">{children}</button>;
  }
  const isOpen = openItemValue === itemValue;

  return (
    <button
      onClick={() => toggleItem(itemValue)}
      className={`flex items-center justify-between w-full p-4 bg-neutral-800 border border-neutral-700 shadow-lg rounded-[5px] rounded-t-[5px] focus:outline-none focus-visible:ring-1 focus-visible:ring--[#C8E972] focus-visible:ring-opacity-75 transition-colors duration-150 ${className || ''} ${isOpen ? 'rounded-b-none' : 'rounded-b-[5px]'}`}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${itemValue}`}
    >
      <span className="text-lg font-medium text-[#C8E972]">{children}</span>
      <div className="flex items-center justify-center w-10 h-8 border-2 border-[#C8E972] rounded-full">
        <ChevronDownIcon
          className={`w-4 h-4 stroke-3 text-[#C8E972] transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </div>
    </button>
  );
};

// Props for AccordionContent (the collapsible content area)
interface AccordionContentProps {
  children: ReactNode;
  itemValue?: string; // Injected by AccordionItem
  className?: string;
}

// Accordion Content Component
const AccordionContent: React.FC<AccordionContentProps> = ({ children, itemValue, className }) => {
  const { openItemValue } = useAccordionContext();
  if (!itemValue) {
     // This should ideally not happen if used correctly within AccordionItem
    console.warn("AccordionContent used outside of an AccordionItem or itemValue not passed.");
    return null;
  }
  const isOpen = openItemValue === itemValue;

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id={`accordion-content-${itemValue}`}
      className={`p-4 bg-neutral-700 rounded-b-[5px] shadow-inner ${className || ''}`}
      role="region"
    >
      {children}
    </div>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };