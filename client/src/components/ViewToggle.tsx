import React from 'react';
import { usePilates } from '@/context/PilatesContext';
import { cn } from '@/lib/utils';

type ViewToggleProps = {
  isMobile?: boolean;
};

const ViewToggle: React.FC<ViewToggleProps> = ({ isMobile = false }) => {
  const { viewMode, setViewMode } = usePilates();

  const handleViewToggle = (mode: 'customer' | 'admin') => {
    setViewMode(mode);
  };

  const buttonClasses = (mode: 'customer' | 'admin') => cn(
    'rounded-md px-3 py-1.5 text-sm font-medium transition',
    mode === viewMode 
      ? 'bg-indigo-600 text-white' 
      : 'text-slate-700 hover:bg-slate-200',
    isMobile && 'w-1/2'
  );

  return (
    <div className={cn(
      'flex items-center bg-slate-100 p-1 rounded-lg',
      isMobile && 'w-full justify-center'
    )}>
      <button 
        onClick={() => handleViewToggle('customer')} 
        className={buttonClasses('customer')}
      >
        {isMobile ? 'Customer' : 'Customer View'}
      </button>
      <button 
        onClick={() => handleViewToggle('admin')} 
        className={buttonClasses('admin')}
      >
        {isMobile ? 'Admin' : 'Admin View'}
      </button>
    </div>
  );
};

export default ViewToggle;
