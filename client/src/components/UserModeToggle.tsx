import React from 'react';
import { useAppContext } from '@/context/AppContext';

const UserModeToggle: React.FC = () => {
  const { isAdmin, setIsAdmin } = useAppContext();

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      <button 
        className={`py-1.5 px-3 rounded-lg text-sm font-medium ${!isAdmin ? 'bg-white shadow-sm' : 'text-gray-500'}`}
        onClick={() => setIsAdmin(false)}
      >
        Customer
      </button>
      <button 
        className={`py-1.5 px-3 rounded-lg text-sm font-medium ${isAdmin ? 'bg-white shadow-sm' : 'text-gray-500'}`}
        onClick={() => setIsAdmin(true)}
      >
        Admin
      </button>
    </div>
  );
};

export default UserModeToggle;
