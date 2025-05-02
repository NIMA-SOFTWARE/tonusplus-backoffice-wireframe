import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * FINALIZED VERSION - Equipment Tooltip Component
 * 
 * This component displays a tooltip for equipment icons in session cards.
 * It shows the equipment type and time slot information on hover.
 */
interface EquipmentTooltipProps {
  type: string;
  timeSlot: string;
  children: React.ReactNode;
}

const EquipmentTooltip: React.FC<EquipmentTooltipProps> = ({ type, timeSlot, children }) => {
  // Format equipment type to be more readable
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="top" className="p-2 max-w-[200px]">
          <div className="text-xs">
            <div className="font-semibold">{formattedType}</div>
            <div className="text-muted-foreground mt-1">
              Time slot: {timeSlot}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EquipmentTooltip;