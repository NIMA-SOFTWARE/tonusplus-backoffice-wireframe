import React, { useEffect, useState } from 'react';
import { usePilates } from '@/context/PilatesContext';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';

interface FilterSectionProps {
  className?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({ className }) => {
  const { sessions, setFilters, filters } = usePilates();
  const [trainers, setTrainers] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Extract unique trainers, activities, and locations from sessions
  useEffect(() => {
    const uniqueTrainers = Array.from(new Set(sessions.map(session => session.trainer)));
    const uniqueActivities = Array.from(new Set(sessions.map(session => session.name)));
    const uniqueLocations = Array.from(new Set(sessions.map(session => session.location)));
    
    setTrainers(uniqueTrainers);
    setActivities(uniqueActivities);
    setLocations(uniqueLocations);
    
    // If no location is selected, set the first location as default
    if (!filters.location && uniqueLocations.length > 0) {
      setFilters({ location: uniqueLocations[0] });
    }
  }, [sessions, filters.location, setFilters]);

  // Date filter has been removed as it's now in the calendar view

  const handleTrainerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ trainer: e.target.value || null });
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ activity: e.target.value || null });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ location: e.target.value || null });
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 ${className}`}>
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
      
      <div className="relative">
        <select 
          className="pl-10 pr-10 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
          value={filters.location || (locations.length > 0 ? locations[0] : '')}
          onChange={handleLocationChange}
          required
        >
          {/* Location filter cannot be empty, a location must always be active */}
          {locations.map((location, index) => (
            <option key={index} value={location}>{location}</option>
          ))}
        </select>
        <MapPin className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
    </div>
  );
};

export default FilterSection;
