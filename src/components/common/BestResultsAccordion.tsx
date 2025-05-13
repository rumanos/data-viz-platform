import { Sparkles, MoreHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface ScenarioData {
  id: string;
  description: string;
  ariaLabel: string;
}

interface ScenarioDisplayCardProps {
  description: string;
  ariaLabel: string;
}

const ScenarioDisplayCard: React.FC<ScenarioDisplayCardProps> = ({ description, ariaLabel }) => {
  return (
    <div className="flex justify-between items-center px-6 py-[15px] gap-[15px] w-full h-auto bg-[rgba(204,255,0,0.02)] border-[0.5px] border-[#C8E972] rounded-md text-[#C8E972] flex-none order-0 grow-0">
      <p className="leading-normal mr-2 flex-grow">
        {description}
      </p>
      <button className="p-1 text-[#C8E972] flex-shrink-0 self-center" aria-label={ariaLabel}>
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
};

export interface BestResultsAccordionProps {
  scenarios: ScenarioData[];
  defaultOpen?: boolean;
  className?: string;
}

const BestResultsAccordion: React.FC<BestResultsAccordionProps> = ({
  scenarios,
  defaultOpen = true,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between hover:no-underline px-0 py-3 text-left group focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center text-[#C8E972]">
          <Sparkles className="mr-2 h-5 w-5 flex-shrink-0" />
          <span className="text-[18px] md:text-[24px] font-bold">Best Scenario Results</span>
        </div>
        <span
          className={`inline-block py-2 px-4 rounded-full border-1 border-[#C8E972] cursor-pointer ${
            !isOpen ? "bg-[#C8E972]" : "bg-[rgba(204,255,0,0.02)]"
          }`}
        >
          <ChevronDown
            className={`h-4 w-4 transform transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#C8E972]" : "text-accent"
            }`}
          />
        </span>
      </button>
      {isOpen && (
        <div className="px-0 pb-4 pt-2 text-sm">
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <ScenarioDisplayCard
                key={scenario.id}
                description={scenario.description}
                ariaLabel={scenario.ariaLabel}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BestResultsAccordion; 