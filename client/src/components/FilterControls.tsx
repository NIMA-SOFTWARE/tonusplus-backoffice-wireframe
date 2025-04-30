import React from 'react';
import { useAppContext } from '@/context/AppContext';

interface FilterControlsProps {
  isAdmin?: boolean;
}

const FilterControls: React.FC<FilterControlsProps> = ({ isAdmin = false }) => {
  const { filters, setFilters } = useAppContext();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, date: e.target.value });
  };

  const handleTrainerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, trainer: e.target.value });
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, activity: e.target.value });
  };

  const idPrefix = isAdmin ? 'admin-' : '';

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
      <div>
        <label htmlFor={`${idPrefix}date-filter`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input 
          type="date" 
          id={`${idPrefix}date-filter`} 
          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
          value={filters.date || ''}
          onChange={handleDateChange}
        />
      </div>
      
      <div>
        <label htmlFor={`${idPrefix}trainer-filter`} className="block text-sm font-medium text-gray-700 mb-1">Trainer</label>
        <select 
          id={`${idPrefix}trainer-filter`} 
          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
          value={filters.trainer}
          onChange={handleTrainerChange}
        >
          <option value="">All Trainers</option>
          <option value="Sarah Johnson">Sarah Johnson</option>
          <option value="Michael Chen">Michael Chen</option>
          <option value="Emma Wilson">Emma Wilson</option>
        </select>
      </div>
      
      <div>
        <label htmlFor={`${idPrefix}activity-filter`} className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
        <select 
          id={`${idPrefix}activity-filter`} 
          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
          value={filters.activity}
          onChange={handleActivityChange}
        >
          <option value="">All Activities</option>
          <option value="Mat Pilates">Mat Pilates</option>
          <option value="Reformer">Reformer</option>
          <option value="Barre Fusion">Barre Fusion</option>
          <option value="Prenatal Pilates">Prenatal Pilates</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
