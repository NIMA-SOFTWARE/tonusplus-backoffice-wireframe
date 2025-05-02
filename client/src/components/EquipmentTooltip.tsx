import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EquipmentTooltipProps {
  type: string;
  timeSlot: string;
  children: React.ReactNode;
}

const EquipmentTooltip: React.FC<EquipmentTooltipProps> = ({ 
  type, 
  timeSlot, 
  children 
}) => {
  // Generate helpful description for different types of equipment
  const getEquipmentDescription = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'laser':
        return 'Our laser therapy equipment helps reduce inflammation and accelerate healing.';
      case 'reformer':
        return 'The Pilates reformer is a bed-like frame with a flat platform that rolls back and forth on wheels.';
      case 'cadillac':
        return 'The Cadillac is a raised platform with a canopy frame for a variety of springs, bars, and straps.';
      case 'barrel':
        return 'The spine corrector barrel provides support for spinal extension and flexion exercises.';
      case 'chair':
        return 'The Pilates chair offers resistance training with its pedals and handles.';
      default:
        return 'Specialized Pilates equipment.';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="max-w-xs">
            <div className="font-semibold mb-1">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <p className="text-xs mb-2">{getEquipmentDescription(type)}</p>
            <div className="text-xs text-muted-foreground">Time slot: {timeSlot}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EquipmentTooltip;