import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import NumberFlow from "@number-flow/react";

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  className?: string;
  tooltip?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  description,
  className,
  tooltip,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Parse the incoming string value
    const valueString = String(value);
    const match = valueString.match(/^([^0-9.-]*)([0-9.-]+)([^0-9.-]*)$/);

    if (match) {
      const parsedPrefix = match[1] || "";
      const numericPart = parseFloat(match[2]);
      const parsedSuffix = match[3] || "";

      setPrefix(parsedPrefix);
      setSuffix(parsedSuffix);
      // Set the target value for animation after a short delay to ensure initial render with 0
      // or directly if NumberFlow handles initial animation from a non-zero start if previous value was different.
      // For simplicity, starting animation from 0 to target value.
      setAnimatedValue(numericPart);
    } else {
      // Fallback for non-parsable values or values that are not numbers
      // Potentially set the original string value or handle as an error
      setPrefix("");
      setSuffix(valueString); // Display the original string if not parsable as a number with affixes
      setAnimatedValue(NaN); // Or handle differently
    }
  }, [value]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile(); // Check on mount
    window.addEventListener("resize", checkIsMobile); // Add resize listener

    return () => {
      window.removeEventListener("resize", checkIsMobile); // Cleanup listener
    };
  }, []);

  return (
    <div
      className={`bg-[#222324] border-[1px] border-[#525252] rounded-[5px] p-[24px] flex flex-col justify-between shadow-md ${className || ""}`}
      role="region"
      aria-label={title}
    >
      <div>
        <div className="flex items-center mb-2 justify-between">
          <span className="text-[18px] font-medium text-white mr-2">{title}</span>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label="More info"
                    className="ml-1 text-zinc-400 hover:text-zinc-200 focus:outline-none"
                  >
                    <HelpCircle size={18} className="inline-block align-middle" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="text-[#BBBBBB] text-xs mb-4">{description}</div>
      </div>
      <span className="text-[32px] text-right font-bold text-white">
        {prefix}
        {!isNaN(animatedValue) ? (
          isMobile ? (
            <>{animatedValue}</> // Render plain value on mobile
          ) : (
            <NumberFlow value={animatedValue} />
          )
        ) : (
          // Render suffix directly if animatedValue is NaN (original value wasn't parsable)
          // This ensures that if the original value was e.g. "N/A", it's still shown.
          <>{suffix}</> 
        )}
        {/* Render suffix only if animatedValue is a number, otherwise it's part of the fallback */}
        {!isNaN(animatedValue) && suffix}
      </span>
    </div>
  );
};

export default KpiCard; 