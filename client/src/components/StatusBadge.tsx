import React from 'react';
import { SessionStatus } from '@shared/schema';
import { getStatusColor } from '@/lib/utils';

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
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}>
      {getDisplayText(status)}
    </span>
  );
};

export default StatusBadge;
