import React from 'react';
import { useAppContext } from '@/context/AppContext';
import FilterControls from '@/components/FilterControls';
import SessionCard from '@/components/SessionCard';
import { filterSessions } from '@/utils/session-utils';

const CustomerView: React.FC = () => {
  const { sessions, filters } = useAppContext();
  
  // Apply filters
  const filteredSessions = filterSessions(sessions, filters);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Available Sessions</h2>
        <FilterControls />
      </div>
      
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No sessions found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerView;
