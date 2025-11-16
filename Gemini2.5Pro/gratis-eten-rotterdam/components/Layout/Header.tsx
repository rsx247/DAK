
import React from 'react';
import type { TimeViewMode } from '../../types';

interface HeaderProps {
  timeView: TimeViewMode;
  setTimeView: (view: TimeViewMode) => void;
}

const TimeViewButton: React.FC<{
  label: string;
  view: TimeViewMode;
  currentView: TimeViewMode;
  onClick: (view: TimeViewMode) => void;
}> = ({ label, view, currentView, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
      currentView === view
        ? 'bg-text-primary text-white'
        : 'bg-surface text-text-primary hover:bg-border-color'
    }`}
  >
    {label}
  </button>
);

export const Header: React.FC<HeaderProps> = ({ timeView, setTimeView }) => {
  return (
    <header className="bg-white border-b border-border-color p-4 sticky top-0 z-20">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Gratis Eten Rotterdam</h1>
          <p className="text-text-secondary">Vind gratis maaltijden in jouw buurt</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 p-1 bg-surface rounded-full">
            <TimeViewButton label="Vandaag" view="TODAY" currentView={timeView} onClick={setTimeView} />
            <TimeViewButton label="Komende 24u" view="NEXT_24H" currentView={timeView} onClick={setTimeView} />
            <TimeViewButton label="Week" view="WEEK" currentView={timeView} onClick={setTimeView} />
        </div>
      </div>
    </header>
  );
};
