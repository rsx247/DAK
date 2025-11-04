import React from 'react';
import type { TimeViewMode } from '../../types';

interface HeaderProps {
  timeView: TimeViewMode;
  setTimeView: (view: TimeViewMode) => void;
  viewMode: 'TIMELINE' | 'LIST' | 'ADMIN';
  setViewMode: (mode: 'TIMELINE' | 'LIST' | 'ADMIN') => void;
  onAddEventClick: () => void;
  isAdmin: boolean;
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

const ViewToggleButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    ariaLabel: string;
}> = ({ isActive, onClick, children, ariaLabel }) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`p-2 rounded-full transition-colors ${isActive ? 'bg-text-primary text-white' : 'bg-surface text-text-secondary hover:bg-border-color'}`}
    >
        {children}
    </button>
);


export const Header: React.FC<HeaderProps> = ({ timeView, setTimeView, viewMode, setViewMode, onAddEventClick, isAdmin }) => {
  return (
    <header className="bg-white border-b border-border-color p-4 sticky top-0 z-20">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Gratis Eten Rotterdam</h1>
          <p className="text-text-secondary">Vind gratis maaltijden in jouw buurt</p>
        </div>
        <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 p-1 bg-surface rounded-full">
                <TimeViewButton label="Vandaag" view="TODAY" currentView={timeView} onClick={setTimeView} />
                <TimeViewButton label="Komende 24u" view="NEXT_24H" currentView={timeView} onClick={setTimeView} />
                <TimeViewButton label="Week" view="WEEK" currentView={timeView} onClick={setTimeView} />
            </div>
             {isAdmin && (
                <button
                    onClick={onAddEventClick}
                    className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-colors bg-accent text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    <span>Nieuw Event</span>
                </button>
             )}
             <div className="flex items-center space-x-1 p-1 bg-surface rounded-full">
                <ViewToggleButton isActive={viewMode === 'TIMELINE'} onClick={() => setViewMode('TIMELINE')} ariaLabel="Tijdlijn weergave">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM11 4a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1h-4a1 1 0 01-1-1V4z" />
                    </svg>
                </ViewToggleButton>
                <ViewToggleButton isActive={viewMode === 'LIST'} onClick={() => setViewMode('LIST')} ariaLabel="Lijst weergave">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                </ViewToggleButton>
                 {isAdmin && (
                    <ViewToggleButton isActive={viewMode === 'ADMIN'} onClick={() => setViewMode('ADMIN')} ariaLabel="Admin weergave">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.066L2 5V10a10 10 0 0016 0V5l-.166-.066A11.954 11.954 0 0110 1.944zM8 12.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM10 18a8 8 0 005.657-2.343l-1.414-1.414A6 6 0 1110 6.002V18z" clipRule="evenodd" /></svg>
                    </ViewToggleButton>
                 )}
            </div>
        </div>
      </div>
    </header>
  );
};