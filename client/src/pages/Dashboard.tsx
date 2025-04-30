import React, { useState } from 'react';
import { usePilates } from '@/context/PilatesContext';
import AppHeader from '@/components/AppHeader';
import ViewToggle from '@/components/ViewToggle';
import CustomerView from './CustomerView';
import AdminView from './AdminView';

const Dashboard: React.FC = () => {
  const { viewMode } = usePilates();
  
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile view toggle */}
        <div className="md:hidden mb-6">
          <ViewToggle isMobile={true} />
        </div>
        
        {/* Display the appropriate view based on viewMode */}
        {viewMode === 'customer' ? <CustomerView /> : <AdminView />}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-slate-500">
            © {new Date().getFullYear()} Harmony Pilates Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
