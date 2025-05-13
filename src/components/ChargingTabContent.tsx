import BestResultsAccordion, { type ScenarioData } from "./common/BestResultsAccordion";
import KpiCardsGrid, { type KpiData } from "./common/KpiCardsGrid";
import ReusableChart from "./common/ReusableChart";
import * as React from "react";
import type { ChartConfig } from "@/components/ui/chart";
import type { DropdownOption } from "./common/ReusableChart";

interface ChargingTabContentProps {
  onEditVariables: () => void;
}

const ChargingTabContent: React.FC<ChargingTabContentProps> = ({
  onEditVariables,
}) => {
  const sampleChartData = [
    { month: "Jan", unsatisfiedDemand: 30000, anotherMetric: 150 },
    { month: "Feb", unsatisfiedDemand: 35000, anotherMetric: 180 },
    { month: "Mar", unsatisfiedDemand: 42000, anotherMetric: 220 },
    { month: "Apr", unsatisfiedDemand: 40000, anotherMetric: 200 },
    { month: "May", unsatisfiedDemand: 50000, anotherMetric: 280 },
    { month: "Jun", unsatisfiedDemand: 40000, anotherMetric: 190 },
    { month: "Jul", unsatisfiedDemand: 90000, anotherMetric: 400 },
    { month: "Aug", unsatisfiedDemand: 60000, anotherMetric: 300 },
    { month: "Sep", unsatisfiedDemand: 50000, anotherMetric: 250 },
    { month: "Oct", unsatisfiedDemand: 60000, anotherMetric: 320 },
    { month: "Nov", unsatisfiedDemand: 65000, anotherMetric: 350 },
    { month: "Dec", unsatisfiedDemand: 70000, anotherMetric: 380 },
  ];

  const sampleChartConfig: ChartConfig = {
    unsatisfiedDemand: {
      label: "Unsatisfied Demand %",
      color: "#C8E972", // Lime green
    },
    anotherMetric: {
      label: "Another Metric",
      color: "#C8E972",
    },
  };

  const sampleDropdownOptions: DropdownOption[] = [
    { value: "unsatisfiedDemand", label: "Unsatisfied Demand %" },
    { value: "anotherMetric", label: "Another Metric" },
  ];

  const sampleScenarios: ScenarioData[] = [
    {
      id: "profit-scenario",
      description: "The best found configuration based on profit is characterized by 11 zones (max) with charging stations and 48 total number of poles.",
      ariaLabel: "More options for profit scenario",
    },
    {
      id: "demand-scenario",
      description: "The best found configuration based on satisfied demand is characterized by 11 zones (max) with charging stations and 48 total number of poles.",
      ariaLabel: "More options for demand scenario",
    },
  ];

  const sampleKpis: KpiData[] = [
    {
      id: "kpi-infra",
      title: "Infrastructure Units",
      value: "€421.07",
      description: "This describes variable one and what the shown data means.",
      tooltip: "More info about Infrastructure Units.",
    },
    {
      id: "kpi-growth",
      title: "Charging Growth",
      value: "33.07",
      description: "This describes variable two and what the shown data means.",
      tooltip: "More info about Charging Growth.",
    },
    {
      id: "kpi-local",
      title: "Localization change",
      value: "21.9%",
      description: "This describes variable three and what the shown data means.",
      tooltip: "More info about Localization change.",
    },
    {
      id: "kpi-fleet",
      title: "Fleet growth",
      value: "7.03%",
      description: "This describes variable four and what the shown data means.",
      tooltip: "More info about Fleet growth.",
    },
  ];

  type SampleChartDataKeys = keyof typeof sampleChartData[0];

  const [selectedMetric, setSelectedMetric] = React.useState<SampleChartDataKeys>(
    sampleDropdownOptions[0]?.value as SampleChartDataKeys || "unsatisfiedDemand"
  );

  React.useEffect(() => {
    if (sampleDropdownOptions.length > 0 && !sampleDropdownOptions.some(opt => opt.value === selectedMetric)) {
      setSelectedMetric(sampleDropdownOptions[0].value as SampleChartDataKeys);
    }
  }, [sampleDropdownOptions, selectedMetric]);

  return (
    <div className="w-full h-full flex flex-col items-start mt-4 overflow-x-hidden">
      <BestResultsAccordion
        scenarios={sampleScenarios}
        className="w-full"
      />
      <div className=" w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-5 gap-4 items-start mt-4">
        <div className="w-full h-full sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-3 overflow-x-hidden">
          <ReusableChart
            title="Graphs"
            dropdownOptions={sampleDropdownOptions}
            selectedDropdownValue={selectedMetric}
            onDropdownChange={(value) => setSelectedMetric(value as SampleChartDataKeys)}
            chartData={sampleChartData}
            chartConfig={sampleChartConfig}
            xAxisDataKey="month"
            lineDataKey={selectedMetric}
          />
        </div>
        <div className="w-full h-full sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2">
          <KpiCardsGrid kpis={sampleKpis} onVariablesClick={onEditVariables} />
        </div>
      </div>
    </div>
  );
};

export default ChargingTabContent; 