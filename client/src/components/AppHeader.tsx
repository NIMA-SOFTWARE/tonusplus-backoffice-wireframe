import React from 'react';
import { usePilates } from '@/context/PilatesContext';
import ViewToggle from './ViewToggle';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-800">Harmony Pilates Studio</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* User view toggle */}
            <ViewToggle />

            {/* User menu */}
            <div className="relative">
              <button type="button" className="flex items-center space-x-2 text-sm focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">JD</span>
                </div>
                <span className="hidden md:block font-medium">Jane Doe</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button type="button" className="p-2 rounded-md inline-flex items-center justify-center text-slate-500 hover:text-slate-600 hover:bg-slate-100 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
