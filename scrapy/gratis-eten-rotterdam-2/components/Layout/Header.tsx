import React from 'react';
import type { TimeViewMode, UserLocation, FilterState, SortByType, AccessLevel } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { GeolocationStatusBar } from './GeolocationStatusBar';
import { FilterControls } from './FilterControls';

// --- Top Navigation Sub-component ---

interface TopNavProps {
  timeView: TimeViewMode;
  setTimeView: (view: TimeViewMode) => void;
  viewMode: 'TIMELINE' | 'LIST' | 'ADMIN';
  setViewMode: (mode: 'TIMELINE' | 'LIST' | 'ADMIN') => void;
  onAddEventClick: () => void;
  isAdmin: boolean;
}

const TimeViewButton: React.FC<{
  label: React.ReactNode;
  view: TimeViewMode;
  currentView: TimeViewMode;
  onClick: (view: TimeViewMode) => void;
}> = ({ label, view, currentView, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`px-3 md:px-4 py-1.5 md:py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
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

const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            aria-label="Donkere modus is tijdelijk uitgeschakeld"
            className="p-2 rounded-full transition-colors bg-surface text-text-secondary opacity-50 cursor-not-allowed"
            disabled
        >
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 8.486a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
                </svg>
            )}
        </button>
    );
};

const TopNav: React.FC<TopNavProps> = ({ timeView, setTimeView, viewMode, setViewMode, onAddEventClick, isAdmin }) => {
  return (
    <div className="bg-white p-4">
      <div className="max-w-screen-xl mx-auto flex flex-row justify-between items-center gap-4">
        <div className="flex items-center flex-shrink-0">
          <img 
            src="https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/dak-logo.webp" 
            alt="Gratis Eten Rotterdam Logo" 
            className="h-10 w-10 rounded-lg object-cover"
          />
        </div>
        <div className="flex items-center gap-2 md:gap-4">
             {isAdmin && (
                <button
                    onClick={onAddEventClick}
                    className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-colors bg-accent text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    <span>Nieuw Event</span>
                </button>
             )}
             <div className="flex items-center p-1 bg-surface rounded-full">
                <TimeViewButton 
                    label={<><span className="md:hidden">Vdg</span><span className="hidden md:inline">Vandaag</span></>} 
                    view="TODAY" currentView={timeView} onClick={setTimeView} 
                />
                <TimeViewButton 
                    label={<><span className="md:hidden">24u</span><span className="hidden md:inline">Komende 24u</span></>} 
                    view="NEXT_24H" currentView={timeView} onClick={setTimeView} 
                />
                <TimeViewButton label="Week" view="WEEK" currentView={timeView} onClick={setTimeView} />
                <div className="w-px h-5 bg-border-color mx-1"></div>
                <ViewToggleButton isActive={viewMode === 'TIMELINE'} onClick={() => setViewMode('TIMELINE')} ariaLabel="Tijdlijn weergave">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM11 4a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1h-4a1 1 0 01-1-1V4z" />
                    </svg>
                </ViewToggleButton>
                <ViewToggleButton isActive={viewMode === 'LIST'} onClick={() => setViewMode('LIST')} ariaLabel="Lijst weergave">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </ViewToggleButton>
                 {isAdmin && (
                    <ViewToggleButton isActive={viewMode === 'ADMIN'} onClick={() => setViewMode('ADMIN')} ariaLabel="Admin weergave">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.066L2 5V10a10 10 0 0016 0V5l-.166-.066A11.954 11.954 0 0110 1.944zM8 12.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM10 18a8 8 0 005.657-2.343l-1.414-1.414A6 6 0 1110 6.002V18z" clipRule="evenodd" /></svg>
                    </ViewToggleButton>
                 )}
                 <div className="w-px h-5 bg-border-color mx-1"></div>
                 <ThemeToggleButton />
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Header Component ---

interface HeaderProps extends TopNavProps {
    geoLoading: boolean;
    geoError: string | null;
    location: UserLocation | null;
    locationType: 'gps' | 'manual' | null;
    onRetry: () => void;
    onManualLocationSelect: (location: { name: string; lat: number; lng: number }) => void;
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    sortBy: SortByType;
    setSortBy: React.Dispatch<React.SetStateAction<SortByType>>;
    totalResults: number;
    venueCount: number;
    onAccessToggle: (level: AccessLevel | 'aanmelden') => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const {
    geoLoading,
    geoError,
    location,
    locationType,
    onRetry,
    onManualLocationSelect,
    viewMode
  } = props;
  
  const isGeoBarVisible = geoLoading || !!geoError || locationType === 'manual';
  const isFilterBarVisible = viewMode === 'TIMELINE';

  return (
    <header className="flex-shrink-0 bg-white z-30 shadow-sm">
      <TopNav {...props} />
      
      {isGeoBarVisible && (
          <div className="bg-surface border-y border-border-color">
              <div className="max-w-screen-xl mx-auto px-3">
                   <GeolocationStatusBar
                      loading={geoLoading}
                      error={geoError}
                      location={location}
                      locationType={locationType}
                      onRetry={onRetry}
                      onManualLocationSelect={onManualLocationSelect}
                    />
              </div>
          </div>
      )}

      {isFilterBarVisible && (
        <FilterControls {...props} />
      )}
    </header>
  );
};