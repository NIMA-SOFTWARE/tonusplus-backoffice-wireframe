import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import FilterControls from '@/components/FilterControls';
import SessionTable from '@/components/SessionTable';
import CreateSessionModal from '@/components/modals/CreateSessionModal';
import { filterSessions } from '@/utils/session-utils';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const AdminView: React.FC = () => {
  const { sessions, filters } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Apply filters
  const filteredSessions = filterSessions(sessions, filters);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Manage Sessions</h2>
        <FilterControls isAdmin={true} />
      </div>
      
      <div className="mb-6">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Create New Session
        </Button>
      </div>
      
      <SessionTable sessions={filteredSessions} />
      
      <CreateSessionModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

export default AdminView;
