import React from 'react';
import { useAppContext } from '@/context/AppContext';
import CustomerView from './customer-view';
import AdminView from './admin-view';

const Home: React.FC = () => {
  const { isAdmin } = useAppContext();
  
  return isAdmin ? <AdminView /> : <CustomerView />;
};

export default Home;
