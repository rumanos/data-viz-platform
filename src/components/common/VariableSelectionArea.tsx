import React, { useState, useCallback } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VariableCategorySelect } from './VariableCategorySelect';

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface VariableCategoryConfig {
  id: string;
  title: string;
  options: Option[];
  initialSelectedIds?: string[];
  onSelectionChange: (selectedOptionIds: string[]) => void;
}

interface VariableSelectionAreaProps {
  // This component currently defines its own data for demonstration.
  // In a real application, options and initial selections might be passed as props.
}

export const VariableSelectionArea: React.FC<VariableSelectionAreaProps> = () => {
  const [activeContextDetail, setActiveContextDetail] = useState<Option | null>(null);

  const handleRequestShowDetail = useCallback((option: Option) => {
    setActiveContextDetail(option);
  }, []);

  const handleRequestHideDetail = useCallback(() => {
    setActiveContextDetail(null);
  }, []);

  const variableCategories: VariableCategoryConfig[] = [
    {
      id: 'category1',
      title: 'Variable Category 1',
      options: [
        {
          id: 'carbon1',
          label: 'Carbon 1',
          description: 'Detailed information about Carbon 1 variable. This involves analyzing the carbon footprint and emissions related to initial production stages.'
        },
        {
          id: 'co2',
          label: 'CO2 Distribution',
          description: 'Focuses on CO2 emissions during the distribution phase. But what truly sets Switch apart is its versatility. It can be used as a scooter, a bike, or even a skateboard, making it suitable for people of all ages.'
        },
        {
          id: 'fleet',
          label: 'Fleet Sizing',
          description: 'Optimizing the size and composition of the vehicle fleet to meet demand efficiently while minimizing environmental impact and operational costs.'
        },
      ],
      initialSelectedIds: ['co2', 'fleet'],
      onSelectionChange: (selectedOptionIds: string[]) => {
        console.log('Category 1 Selected options:', selectedOptionIds);
      },
    },
    {
      id: 'category2',
      title: 'Variable Category 2',
      options: [
        { id: 'parking', label: 'Parking Rate', description: 'Analysis of parking availability and pricing strategies.' },
        { id: 'border', label: 'Border Rate', description: 'Impact of cross-border tariffs and regulations on logistics.' },
        { id: 'request', label: 'Request Rate', description: 'Understanding the demand patterns and request frequencies for services.' },
        { id: 'variable1', label: 'Variable 1', description: 'Understanding the demand patterns and request frequencies for services.' },
        { id: 'variable2', label: 'Variable 2', description: 'Understanding the demand patterns and request frequencies for services.' },
        { id: 'variable3', label: 'Variable 3', description: 'Understanding the demand patterns and request frequencies for services.' },
      ],
      initialSelectedIds: ['border', 'request'],
      onSelectionChange: (selectedOptionIds: string[]) => {
        console.log('Category 2 Selected options:', selectedOptionIds);
      },
    },
    {
      id: 'category3',
      title: 'Variable Category 3',
      options: [
        { id: 'alpha', label: 'Alpha Option', description: "Details for Alpha." },
        { id: 'beta', label: 'Beta Option', description: "Details for Alpha." },
        { id: 'gamma', label: 'Gamma Option', description: "Details for Gamma." },
      ],
      onSelectionChange: (selectedOptionIds: string[]) => {
        console.log('Category 3 Selected options:', selectedOptionIds);
      },
    }
  ];

  const contextWindowVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  return (
    <div className="w-full max-w-2xl border-2 bg-neutral-900 rounded-[5px]">
      <div className="p-6  space-y-6">
      {variableCategories.map(category => (
        <VariableCategorySelect
          key={category.id}
          categoryTitle={category.title}
          options={category.options}
          initialSelectedIds={category.initialSelectedIds}
          onSelectionChange={category.onSelectionChange}
          onRequestShowDetail={handleRequestShowDetail}
          onRequestHideDetail={handleRequestHideDetail}
        />
      ))}
      </div>
      

      {/* Shared Context Window at the bottom of this area */}
      <div className="relative"> {/* Container to ensure space for the context detail popover */}
        <AnimatePresence>
          {activeContextDetail && (
            <motion.div
              className="mt-4 p-6 bg-neutral-800 rounded-[5px] rounded-tr-none rounded-tl-none border border-neutral-700 shadow-lg origin-top w-full"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contextWindowVariants}
              layout
            // The context window appears in the document flow, below the last category.
            // It could be absolutely positioned for an overlay effect if needed.
            >
              <div className="flex items-center mb-2">
                <h3 className="text-md sm:text-lg font-semibold text-neutral-100">
                  {activeContextDetail.label}
                </h3>
                <Info size={18} className="ml-2 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {activeContextDetail.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};