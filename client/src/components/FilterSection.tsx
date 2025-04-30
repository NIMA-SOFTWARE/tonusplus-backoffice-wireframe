import React, { useEffect, useState } from 'react';
import { usePilates } from '@/context/PilatesContext';
import { format } from 'date-fns';

interface FilterSectionProps {
  className?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({ className }) => {
  const { sessions, setFilters, filters } = usePilates();
  const [trainers, setTrainers] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);

  // Extract unique trainers and activities from sessions
  useEffect(() => {
    const uniqueTrainers = Array.from(new Set(sessions.map(session => session.trainer)));
    const uniqueActivities = Array.from(new Set(sessions.map(session => session.name)));
    
    setTrainers(uniqueTrainers);
    setActivities(uniqueActivities);
  }, [sessions]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ date: e.target.value || null });
  };

  const handleTrainerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ trainer: e.target.value || null });
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ activity: e.target.value || null });
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 ${className}`}>
      <div className="relative">
        <input 
          type="date" 
          className="pl-3 pr-10 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
          value={filters.date || ''}
          onChange={handleDateChange}
        />
      </div>
      <select 
        className="pl-3 pr-10 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        value={filters.trainer || ''}
        onChange={handleTrainerChange}
      >
        <option value="">All Trainers</option>
        {trainers.map((trainer, index) => (
          <option key={index} value={trainer}>{trainer}</option>
        ))}
      </select>
      <select 
        className="pl-3 pr-10 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        value={filters.activity || ''}
        onChange={handleActivityChange}
      >
        <option value="">All Activities</option>
        {activities.map((activity, index) => (
          <option key={index} value={activity}>{activity}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterSection;
