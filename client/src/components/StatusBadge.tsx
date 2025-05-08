import React from 'react';
import { SessionStatus } from '@shared/schema';
import { getStatusColor } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusBadgeProps {
  status: SessionStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClasses = getStatusColor(status);
  
  const getDisplayText = (status: string): string => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'open': return 'Open';
      case 'closed': return 'Full';
      case 'ongoing': return 'In Progress';
      case 'finished': return 'Finished';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };
  
  const getStatusDescription = (status: string): string => {
    switch(status) {
      case 'pending': 
        return 'This session is scheduled but not yet open for bookings.';
      case 'open': 
        return 'This session is accepting bookings. Register now to secure your spot!';
      case 'closed': 
        return 'All spots have been filled. You may join the waitlist if enabled.';
      case 'ongoing': 
        return 'This session is currently in progress.';
      case 'finished': 
        return 'This session has been completed.';
      case 'cancelled': 
        return 'This session has been cancelled and is no longer available.';
      default: 
        return 'Status information unavailable.';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}>
            {getDisplayText(status)}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="text-xs">{getStatusDescription(status)}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusBadge;
