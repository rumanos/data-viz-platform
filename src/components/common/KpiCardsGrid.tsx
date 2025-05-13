import { KpiCard } from "./KpiCard";
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

// Define the structure for a single KPI data item
export interface KpiData {
  id: string; // Unique identifier for React key prop
  title: string;
  value: string;
  description: string;
  tooltip?: string;
}

// Define the props for the KpiCardsGrid component
interface KpiCardsGridProps {
  kpis: KpiData[];
  onVariablesClick?: () => void; // Optional handler for the action button
}

const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({ kpis, onVariablesClick }) => {
  // Conditionally create the action button if the handler is provided
  const actionButton = onVariablesClick ? (
    <Button
      onClick={onVariablesClick}
      className="rounded-[5px] cursor-pointer bg-[#161618] border-[#5A5A5A] border-1 text-white hover:bg-white hover:text-secondary"
    >
      <span className="">Variables</span> <PlusIcon className="ml-2 h-4 w-4" /> {/* Adjusted margin for icon */}
    </Button>
  ) : null; // Render nothing if no handler is passed

  return (
    <SectionWrapper title="Key Performance Indicators" actionButton={actionButton}>
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 gap-4">
        {/* Map over the kpis array passed in props */}
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.id} // Use the unique id for the key
            title={kpi.title}
            value={kpi.value}
            description={kpi.description}
            tooltip={kpi.tooltip}
            className="flex-grow h-full" // Existing className applied
          />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default KpiCardsGrid; 