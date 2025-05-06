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
    
    // Extract locations from room names (format: "Room - Location")
    const uniqueLocations = Array.from(new Set(sessions.map(session => {
      const roomParts = session.room.split(' - ');
      return roomParts.length > 1 ? roomParts[1].trim() : session.room;
    })));
    
    setTrainers(uniqueTrainers);
    setActivities(uniqueActivities);
    setLocations(uniqueLocations);
  }, [sessions]);

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
          value={filters.location || ''}
          onChange={handleLocationChange}
        >
          <option value="">All Locations</option>
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
