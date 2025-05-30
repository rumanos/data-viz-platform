import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Customized,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SectionWrapper from "./SectionWrapper";

// --- START OF NEW ICON COMPONENTS ---

// Simple SVG Help Icon
const HelpCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// Simple SVG Arrow Up Circle Icon
const ArrowUpCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 16 12 8 16 12 8 12" /> 
    {/* Corrected polyline for up arrow: <polyline points="16 12 12 8 8 12" /> <line x1="12" y1="16" x2="12" y2="8" /> */}
  </svg>
);
// --- END OF NEW ICON COMPONENTS ---

export interface DropdownOption {
  value: string;
  label: string;
}

interface ReusableChartProps<TData extends object> {
  title: string;
  dropdownOptions: DropdownOption[];
  selectedDropdownValue: string;
  onDropdownChange: (value: string) => void;
  chartData: TData[];
  chartConfig: ChartConfig;
  xAxisDataKey: keyof TData;
  lineDataKey: keyof TData;
  yAxisTickFormatter?: (value: unknown, index: number) => string;
  xAxisTickFormatter?: (value: unknown, index: number) => string;
  className?: string;
  yAxisLabel?: string;
}

// Define an interface for the props passed by Recharts <Customized> component
// This is a partial definition based on observed usage. It might need expansion
// if other properties are accessed later.
// Pass TData as a generic parameter here too
interface CustomizedComponentProps<TData extends object, TScale = any> { // Using any for Scale type for now, as Recharts types can be complex
  xAxisMap?: { scale: TScale }[];
  yAxisMap?: { scale: TScale }[];
  data?: TData[];
  // Add other potential properties from Recharts if needed
  width?: number;
  height?: number;
  offset?: { top: number; left: number; right: number; bottom: number };
}

// Props for the CustomXAxisTick component
interface CustomXAxisTickPropsFromRecharts {
  x?: number;
  y?: number;
  payload?: { value: string | number }; // payload contains the tick value
  index?: number; // index of the tick
}

interface CustomXAxisTickOwnProps {
  formatter: (value: unknown, index: number) => string; // The original formatter
}

type FullCustomXAxisTickProps = CustomXAxisTickPropsFromRecharts & CustomXAxisTickOwnProps;

// Helper component for custom X-axis ticks with "Now" label
const CustomXAxisTick: React.FC<FullCustomXAxisTickProps> = (props) => {
  const { x, y, payload, index, formatter } = props;

  if (index === 0) { // Hide the first tick
    return null;
  }

  if (!payload || typeof x === 'undefined' || typeof y === 'undefined' || typeof index === 'undefined') {
    return null;
  }

  // Use the provided formatter for the main label text
  const formattedTickValue = formatter(payload.value, index);
  // The original tick value from data (e.g., "May")
  const originalTickValue = String(payload.value);

  // Get current month in short format (e.g., "Jan", "Feb")
  const currentMonthShort = new Date().toLocaleDateString('en-US', { month: 'short' });

  const textStyle = {
    fontSize: '12.25px', 
    fill: 'hsl(var(--bg-primary))',
    fontWeight: '500',
    textAnchor: 'middle' as const,
  };

  if (originalTickValue === currentMonthShort) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={17} {...textStyle}>
          {formattedTickValue}
          <tspan x={-2} dy="1.6em" style={{ fontSize: '11px', fontWeight: 'light', fill: 'hsl(var(--muted-foreground))' }}> {/* Style "Now" to stand out */}
            Now
          </tspan>
        </text>
      </g>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} {...textStyle}>
        {formattedTickValue}
      </text>
    </g>
  );
};

// --- START OF NEW CUSTOM TOOLTIP COMPONENT ---
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[]; // Payload type from Recharts can be more specific if needed
  label?: string | number;
  yAxisTickFormatter: (value: unknown, index: number) => string; // Pass the formatter
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, yAxisTickFormatter }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;  // The specific value for this line/bar

    // Use the yAxisTickFormatter, but remove the "hide first tick" logic for tooltip
    const formattedValue = yAxisTickFormatter(value, 1); // Pass index 1 to avoid empty string

    return (
      <div className="bg-[#343434] p-3 rounded-[5px] shadow-md text-white text-xs border border-[#525252]">
        <div className="flex justify-between items-center mb-1">
          <span className="text-lg font-semibold">{formattedValue}</span>
          <HelpCircleIcon className="text-gray-400" />
        </div>
        <div className="flex items-center">
          <ArrowUpCircleIcon className="text-[#C8E972] mr-1.5" />
          <span className="text-gray-300">4.6% above target</span> {/* Placeholder text */}
        </div>
      </div>
    );
  }

  return null;
};
// --- END OF NEW CUSTOM TOOLTIP COMPONENT ---

const ReusableChart = <TData extends object>({
  title,
  dropdownOptions,
  selectedDropdownValue,
  onDropdownChange,
  chartData,
  chartConfig,
  xAxisDataKey,
  lineDataKey,
  yAxisTickFormatter = (value, index) => {
    if (index === 0) return ""; // Hide the first tick
    return typeof value === 'number' ? `$${value / 1000}K` : String(value);
  },
  xAxisTickFormatter = (value) => {
    try {
      // Attempt date formatting assuming value is string/number representing month-year like 'YYYY-MM'
      const date = new Date(String(value) + '-01'); // Ensure value is string for Date constructor
      // Check if date is valid before formatting
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'short' });
      }
      return String(value); // Fallback if date is invalid
    } catch (e) {
      return String(value); // Fallback for any other error
    }
  },
  className = "",
  yAxisLabel,
}: ReusableChartProps<TData>) => {
  // Default yAxisTickFormatter for the component's props
  const defaultYAxisTickFormatter = (val: unknown, index: number) => {
    if (index === 0) return ""; 
    return typeof val === 'number' ? `$${val / 1000}K` : String(val);
  };
  // Use the passed yAxisTickFormatter if provided, otherwise use the default
  const currentYAxisTickFormatter = yAxisTickFormatter || defaultYAxisTickFormatter;

  return (
    <SectionWrapper title={title} className={className}>
      <Card className="relative w-full h-full bg-[#222324] border-[1px] border-[#525252] rounded-[5px] p-2 md:p-[30px]">
        {dropdownOptions.length > 0 && (
          <CardHeader className="flex flex-row items-center justify-end space-y-0 p-2 md:p-[30px]">
            <Select value={selectedDropdownValue} onValueChange={onDropdownChange}>
              <SelectTrigger className="w-auto min-w-[180px] h-8 border-[#5A5A5A] border-opacity-[63%] rounded-[5px]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {dropdownOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardHeader>
        )}
        <CardContent className={dropdownOptions.length > 0 ? "w-full h-full" : ""}>
          <ChartContainer config={chartConfig} className="relative w-full h-full">
            <ResponsiveContainer className="w-full h-full">
              <LineChart
                data={chartData}
                margin={{
                  top: 0,
                  right: 20,
                  left: 0,
                  bottom: 40,
                }}
              >
                <CartesianGrid vertical={false} stroke="#343434" strokeWidth={0.77} />
                <XAxis
                  dataKey={xAxisDataKey as string}
                  tickLine={false}
                  axisLine={true}
                  strokeWidth={0.3}
                  tickMargin={8}
                  tick={<CustomXAxisTick formatter={xAxisTickFormatter} />}
                  stroke="#FFFFFF"
                />
                <YAxis
                  tickLine={false}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={currentYAxisTickFormatter}
                  tick={{ fontSize: '12.25px', fontWeight: '500', fill: 'hsl(var(--bg-primary))' }}
                  stroke="#FFFFFF"
                  strokeWidth={0.3}
                  label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 0, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } } : undefined}
                />
                <Tooltip
                  cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '6 3', strokeWidth: 3.3 }}
                  content={<CustomChartTooltip yAxisTickFormatter={currentYAxisTickFormatter} />}
                />

                <Customized
                  component={(props: CustomizedComponentProps<TData, (val: any) => number>) => {
                    const { xAxisMap, yAxisMap, data, width, height } = props;

                    if (!xAxisMap?.[0]?.scale || !yAxisMap?.[0]?.scale || !data) {
                      return null;
                    }
                    const xScale = xAxisMap[0].scale;
                    const yScale = yAxisMap[0].scale;
                    const yZeroCoordinate = yScale(0);

                    if (isNaN(yZeroCoordinate)) {
                      console.warn("ReusableChart: Y-axis scale might not include 0, cannot draw lines from baseline.");
                      return null;
                    }

                    return (
                      <AnimatedVerticalLines
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        yZeroCoordinate={yZeroCoordinate}
                        xAxisDataKey={xAxisDataKey}
                        lineDataKey={lineDataKey}
                        chartWidth={width}
                        chartHeight={height}
                      />
                    );
                  }}
                />

                <Line
                  dataKey={lineDataKey as string}
                  // type="monotone"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, style: { boxShadow: '0 0 0 4px hsl(var(--background)), 0 0 0 6px var(--color-line)' } }}
                  stroke={chartConfig[lineDataKey as string]?.color || "hsl(100 70% 50%)"}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </SectionWrapper>
  );
};

// Define the new AnimatedVerticalLines component
interface AnimatedVerticalLinesProps<TData extends object, TScale = any> {
  data: TData[];
  xScale: TScale; // Assuming TScale is a function like (value: any) => number
  yScale: TScale; // Assuming TScale is a function like (value: any) => number
  yZeroCoordinate: number;
  xAxisDataKey: keyof TData;
  lineDataKey: keyof TData;
  chartWidth?: number;
  chartHeight?: number;
}

const AnimatedVerticalLines = <TData extends object>({
  data,
  xScale,
  yScale,
  yZeroCoordinate,
  xAxisDataKey,
  lineDataKey,
  chartWidth,
  chartHeight,
}: AnimatedVerticalLinesProps<TData>) => {
  const [lines, setLines] = useState<
    Array<{ x: number; y1: number; y2: number; length: number; id: string; shouldAnimate: boolean }>
  >([]);

  // Effect 1: Calculate lines when data, scales, or dimensions change
  useEffect(() => {
    if (!data || data.length === 0 || !xScale || !yScale || isNaN(yZeroCoordinate) || chartWidth === undefined || chartHeight === undefined ) {
      setLines([]);
      return;
    }

    const linesToRender: Array<typeof lines[0]> = [];
    data.forEach((entry, index) => {
      const xValue = entry[xAxisDataKey];
      const yValue = entry[lineDataKey];

      if (yValue === null || yValue === undefined || typeof yValue !== 'number' || yValue === 0) {
        return;
      }

      let xCoord: number | undefined;
      let yCoord: number | undefined;
      try {
        xCoord = xScale(xValue);
        yCoord = yScale(yValue);
      } catch (scaleError) {
        console.error("Error applying scale function in AnimatedVerticalLines:", scaleError, { xValue, yValue });
        return;
      }

      if (xCoord === undefined || yCoord === undefined || isNaN(xCoord) || isNaN(yCoord)) {
        return;
      }

      const length = Math.abs(yCoord - yZeroCoordinate);
      // Ensure ID uniqueness, especially if chartWidth/Height are involved in line positioning or count.
      // Adding chartWidth/Height to ID makes it unique per resize, forcing React to treat lines as new if dimensions change.
      linesToRender.push({
        x: xCoord,
        y1: yZeroCoordinate,
        y2: yCoord,
        length,
        id: `vline-anim-${index}-${String(xValue)}-w${chartWidth}-h${chartHeight}`,
        shouldAnimate: false,
      });
    });
    setLines(linesToRender);
  }, [data, xScale, yScale, yZeroCoordinate, xAxisDataKey, lineDataKey, chartWidth, chartHeight]);

  // Effect 2: Stagger animation when 'lines' state changes
  useEffect(() => {
    if (lines.length === 0 || !lines.some(line => !line.shouldAnimate)) {
      // No lines to animate or all lines are already set to animate/animated
      return;
    }

    let animationOrderIndex = 0;
    const intervalId = setInterval(() => {
      setLines(currentLines => {
        if (animationOrderIndex < currentLines.length) {
          const lineToAnimate = currentLines[animationOrderIndex];
          if (lineToAnimate && !lineToAnimate.shouldAnimate) {
            const newLines = [...currentLines];
            newLines[animationOrderIndex] = { ...lineToAnimate, shouldAnimate: true };
            animationOrderIndex++;
            return newLines;
          } else if (lineToAnimate && lineToAnimate.shouldAnimate) {
            animationOrderIndex++;
            return currentLines;
          } else {
             // animationOrderIndex might be out of bounds if lines array changed rapidly
             // or if the line is unexpectedly undefined.
            clearInterval(intervalId);
            return currentLines;
          }
        } else {
          clearInterval(intervalId);
          return currentLines;
        }
      });
    }, 50); // Stagger delay

    return () => clearInterval(intervalId);
  }, [lines]); // Rerun if the 'lines' array reference changes

  if (lines.length === 0) {
    return null;
  }

  return (
    <g>
      {lines.map(({ x, y1, y2, length, id, shouldAnimate }) => (
        <line
          key={id}
          x1={x}
          y1={y1} // Start point of the line for animation (yZeroCoordinate)
          x2={x}
          y2={y2} // End point of the line (actual value coordinate)
          stroke="rgba(138, 161, 79, 0.2)"
          strokeWidth={2.3}
          strokeDasharray={length}
          strokeDashoffset={shouldAnimate ? 0 : length} // Animate by changing dashoffset
          style={{
            transition: shouldAnimate ? `stroke-dashoffset 0.3s ease-out` : 'none', // CSS transition for the drawing effect
            // Ensure line draws from bottom to top if y2 < y1, or top to bottom if y2 > y1
            // This is implicitly handled by y1 being yZeroCoordinate and y2 being the value's coordinate.
            // The 'length' is always positive.
            // If yValue is negative, y2 will be > yZeroCoordinate (assuming yZeroCoordinate is at or above 0).
            // If yValue is positive, y2 will be < yZeroCoordinate.
            // The stroke-dashoffset animates from 'length' to 0, revealing the line.
          }}
        />
      ))}
    </g>
  );
};

export default ReusableChart; 