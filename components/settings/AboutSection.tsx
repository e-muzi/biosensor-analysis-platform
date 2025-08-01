import React from 'react';

export const AboutSection: React.FC = () => (
  <section>
    <h2 className="text-xl font-bold text-cyan-400 mb-2">About</h2>
    <div className="bg-gray-800 p-4 rounded-xl text-center">
      <h3 className="text-lg font-semibold text-cyan-300 mb-1">Biosensor Analysis App</h3>
      <p className="text-gray-400 text-xs">Version: <span className="font-mono">v0.0.1 beta</span></p>
      <p className="text-gray-400 text-xs">Build: 2025-07-01</p>
      <div className="mt-2">
        <a href="https://github.com/e-muzi/biosensor-apptesting" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-xs">Project GitHub</a>
      </div>
    </div>
  </section>
); 