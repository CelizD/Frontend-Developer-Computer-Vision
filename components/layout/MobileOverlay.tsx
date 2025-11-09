import React from 'react';
import { useAppContext } from '../../context/AppContext';

const MobileOverlay = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 md:hidden
        ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      onClick={() => setIsSidebarOpen(false)}
    />
  );
};

export default MobileOverlay;