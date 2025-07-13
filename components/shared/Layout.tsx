import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto bg-gray-900 shadow-2xl shadow-cyan-900/20">
      <main className="flex-grow overflow-y-auto pb-20">
        {children}
      </main>
    </div>
  );
}; 