import React, { useState, useRef, useEffect, ReactNode, useLayoutEffect } from 'react';
import type { TimeViewMode, UserLocation, FilterState, SortByType, AccessLevel, ViewMode, FoodType, DietaryTag } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { GeolocationStatusBar } from './GeolocationStatusBar';
import { InlineFilterBar } from './InlineFilterBar';
import { FilterDropdown } from './FilterBar';
import { 
    TimeIcon, 
    DistanceIcon, 
    AlphabeticalSortIcon,
    FilterIcon,
    SortIcon,
    EyeIcon,
    AddIcon,
    ResetAllIcon,
    CloseIcon,
    AdminIcon
} from './Icons';

// --- Local Dropdown Component ---

interface LocalFilterDropdownProps {
    onClose: () => void;
    children: ReactNode;
    widthClass?: string;
}

const LocalFilterDropdown: React.FC<LocalFilterDropdownProps> = ({ onClose, children, widthClass = 'w-48' }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Smartly position dropdown to not go off-screen
    useLayoutEffect(() => {
        if (dropdownRef.current && dropdownRef.current.parentElement) {
            const dropdownEl = dropdownRef.current;
            const parentRect = dropdownEl.parentElement.getBoundingClientRect();
            const dropdownWidth = dropdownEl.offsetWidth;
            const viewportWidth = window.innerWidth;
            const buffer = 10;

            // Default alignment: left-aligned with parent
            dropdownEl.style.left = '0';
            dropdownEl.style.transformOrigin = 'top left';

            // Constraint: If the dropdown overflows the right edge of the viewport
            if (parentRect.left + dropdownWidth > viewportWidth - buffer) {
                // Action: Align the dropdown's right edge with the viewport's right edge
                const desiredAbsoluteRight = viewportWidth - buffer;
                // Calculate the new 'left' value relative to the parent to achieve this alignment
                const newLeft = desiredAbsoluteRight - dropdownWidth - parentRect.left;
                
                dropdownEl.style.left = `${newLeft}px`;
                dropdownEl.style.transformOrigin = 'top right';
            }
        }
    }, [children]); // Rerun if content changes, which implies it's open

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={dropdownRef}
            className={`absolute z-40 top-full mt-2 ${widthClass} rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            role="menu"
            aria-orientation="vertical"
            tabIndex={-1}
        >
            <div className="py-1" role="none">
                {children}
            </div>
        </div>
    );
};


// --- Top Navigation Sub-component ---

interface TopNavProps {
  timeView: TimeViewMode;
  setTimeView: (view: TimeViewMode) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onSuperadminViewToggle: () => void;
  onAddEventClick: () => void;
  isAdmin: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  sortBy: SortByType;
  setSortBy: React.Dispatch<React.SetStateAction<SortByType>>;
  sortInteracted: boolean;
  setSortInteracted: React.Dispatch<React.SetStateAction<boolean>>;
  isInlineFilterVisible: boolean;
  setIsInlineFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownTrigger: React.FC<{
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  hasActiveFilter?: boolean;
}> = ({ label, icon, isOpen, onClick, hasActiveFilter = false }) => (
  <button
    onClick={onClick}
    className={`relative px-3 md:px-4 py-1.5 md:py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap flex items-center gap-2 ${
      isOpen
        ? 'bg-text-primary text-white'
        : 'bg-surface text-text-primary hover:bg-border-color'
    }`}
    aria-haspopup="true"
    aria-expanded={isOpen}
  >
    {hasActiveFilter && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent border border-surface"></div>}
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

const SimpleToggleButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  hasActiveFilter?: boolean;
}> = ({ label, icon, isActive, onClick, hasActiveFilter = false }) => (
  <button
    onClick={onClick}
    className={`relative px-3 md:px-4 py-1.5 md:py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap flex items-center gap-2 ${
      isActive
        ? 'bg-text-primary text-white'
        : 'bg-surface text-text-primary hover:bg-border-color'
    }`}
  >
    {hasActiveFilter && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent border border-surface"></div>}
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);


const DropdownMenuItem: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3
            ${isActive ? 'font-semibold bg-accent/10 text-accent' : 'text-text-primary hover:bg-surface'}
        `}
        role="menuitem"
    >
        {icon && <span className={isActive ? 'text-accent' : 'text-text-secondary'}>{icon}</span>}
        <span>{label}</span>
    </button>
);

const RadioItem: React.FC<{ label: string; checked: boolean; onChange: () => void; }> = ({ label, checked, onChange }) => (
    <label className="flex items-center w-full px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-surface">
        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center ${checked ? 'border-accent' : 'border-gray-300'}`}>
             {checked && <div className="w-2 h-2 bg-accent rounded-full"></div>}
        </div>
        <span className={`${checked ? 'font-semibold text-accent' : 'text-text-primary'}`}>{label}</span>
        <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
    </label>
);

const CheckboxItem: React.FC<{ label: string; checked: boolean; onChange: () => void; }> = ({ label, checked, onChange }) => (
    <label className="flex items-center w-full px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-surface">
         <div className={`w-4 h-4 rounded border-2 mr-3 flex-shrink-0 flex items-center justify-center ${checked ? 'bg-accent border-accent' : 'border-gray-300'}`}>
            {checked && <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
        </div>
        <span className={`${checked ? 'font-semibold text-accent' : 'text-text-primary'}`}>{label}</span>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
);

const DropdownSection: React.FC<{ 
    title: string; 
    children: React.ReactNode;
    isResettable?: boolean;
    onReset?: () => void;
}> = ({ title, children, isResettable, onReset }) => (
    <div className="py-2 border-b border-border-color last:border-b-0">
        <div className="flex justify-between items-center px-4 pb-1">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
            {isResettable && (
                <button 
                    onClick={onReset} 
                    className="p-1 -mr-2 rounded-full text-text-secondary hover:bg-gray-200 hover:text-text-primary"
                    aria-label={`${title} filters resetten`}
                >
                    <CloseIcon className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
        {children}
    </div>
);


const TopNav: React.FC<TopNavProps> = (props) => {
    const { 
        timeView, setTimeView, viewMode, setViewMode, onSuperadminViewToggle, onAddEventClick, isAdmin, filters, setFilters, 
        sortBy, setSortBy, sortInteracted, setSortInteracted, 
        isInlineFilterVisible, setIsInlineFilterVisible
    } = props;
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // --- Time & View Options ---
    const timeViewOptions = [
        { view: 'TODAY' as TimeViewMode, label: 'Vandaag' },
        { view: 'NEXT_24H' as TimeViewMode, label: 'Komende 24u' },
        { view: 'WEEK' as TimeViewMode, label: 'Week' },
    ];
    const currentTielViewLabel = timeViewOptions.find(opt => opt.view === timeView)?.label || 'Vandaag';
    
    const viewModeOptions = [
        { mode: 'TIMELINE' as const, label: 'Tijdlijn' },
        { mode: 'LIST' as const, label: 'Lijst' },
        { mode: 'GRID' as const, label: 'Grid (Locatie)' },
        { mode: 'CHRONO_GRID' as const, label: 'Grid (Datum)' },
        { mode: 'ADMIN' as const, label: 'Admin' },
    ];
    const currentViewModeLabel = viewModeOptions.find(opt => opt.mode === viewMode)?.label || 'Tijdlijn';

    // --- Sort Options ---
    const sortOptions: { type: SortByType, label: string, icon: React.ReactElement }[] = [
        { type: 'distance', label: 'Afstand', icon: <DistanceIcon className="w-5 h-5" /> },
        { type: 'time', label: 'Tijd', icon: <TimeIcon className="w-5 h-5" /> },
        { type: 'alphabetical', label: 'A-Z', icon: <AlphabeticalSortIcon className="w-5 h-5" /> },
    ];
    const activeSortOption = sortOptions.find(opt => opt.type === sortBy) || sortOptions[0];
    const sortIcon = !sortInteracted
        ? <SortIcon className="w-5 h-5" />
        : activeSortOption.icon;

    const sortLabel = !sortInteracted ? 'Sorteren' : activeSortOption.label;

    // --- Filter Handlers & State ---
    const activeFilterCount = 
        (filters.distance !== Infinity ? 1 : 0) +
        (filters.maxCost !== Infinity ? 1 : 0) +
        filters.accessLevels.length +
        filters.eventTypes.length +
        filters.dietaryNeeds.length;
    
    const handleMaxCost = (cost: number) => {
        setFilters(prev => ({
            ...prev,
            maxCost: prev.maxCost === cost ? Infinity : cost
        }));
    };
    const handleAccessToggle = (level: AccessLevel) => setFilters(prev => ({ ...prev, accessLevels: prev.accessLevels.includes(level) ? prev.accessLevels.filter(l => l !== level) : [...prev.accessLevels, level] }));
    const handleEventTypeToggle = (type: FoodType) => setFilters(prev => ({ ...prev, eventTypes: prev.eventTypes.includes(type) ? prev.eventTypes.filter(t => t !== type) : [...prev.eventTypes, type] }));
    const handleDietaryToggle = (need: DietaryTag) => setFilters(prev => ({ ...prev, dietaryNeeds: prev.dietaryNeeds.includes(need) ? prev.dietaryNeeds.filter(n => n !== need) : [...prev.dietaryNeeds, need] }));

    const resetFilters = () => setFilters({ distance: Infinity, maxCost: Infinity, accessLevels: [], eventTypes: [], dietaryNeeds: [] });

    const toggleDropdown = (name: string) => {
        setOpenDropdown(prev => (prev === name ? null : name));
    };

    return (
    <div className="bg-white p-4">
      <div className="max-w-screen-xl mx-auto flex flex-row justify-between items-center gap-4">
        <a href="/" className="flex items-center flex-shrink-0" aria-label="Homepage">
          <img 
            src="https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/dak-logo.webp" 
            alt="Gratis Eten Rotterdam Logo" 
            className="h-10 w-10 rounded-lg object-cover"
          />
        </a>
        <div className="flex items-center gap-2 md:gap-3">
             {isAdmin && viewMode === 'ADMIN' && (
                <button
                    onClick={onAddEventClick}
                    className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-colors bg-accent text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                    <AddIcon className="h-5 w-5" />
                    <span>Nieuw Event</span>
                </button>
             )}
             
            {/* Filter & Sort Group */}
            <div className="flex items-center p-1 bg-surface rounded-full gap-1">
                 {/* Sort Dropdown */}
                <div className="relative">
                    <DropdownTrigger
                        label={sortLabel}
                        icon={sortIcon}
                        isOpen={openDropdown === 'sort'}
                        onClick={() => toggleDropdown('sort')}
                    />
                     {openDropdown === 'sort' && (
                        <LocalFilterDropdown onClose={() => setOpenDropdown(null)} widthClass="w-40">
                            {sortOptions.map(opt => (
                                <DropdownMenuItem
                                    key={opt.type}
                                    label={opt.label}
                                    isActive={sortBy === opt.type}
                                    onClick={() => { setSortBy(opt.type); setSortInteracted(true); setOpenDropdown(null); }}
                                    icon={opt.icon}
                                />
                            ))}
                        </LocalFilterDropdown>
                    )}
                </div>

                {/* Filter Dropdown */}
                 <div className="relative">
                    <DropdownTrigger
                        label="Filters"
                        icon={<FilterIcon className="h-5 w-5" />}
                        isOpen={openDropdown === 'filter-dropdown'}
                        onClick={() => toggleDropdown('filter-dropdown')}
                        hasActiveFilter={activeFilterCount > 0}
                    />
                     {openDropdown === 'filter-dropdown' && (
                        <LocalFilterDropdown onClose={() => setOpenDropdown(null)} widthClass="w-72">
                            <div className="flex justify-between items-center px-4 py-2 border-b border-border-color">
                                <h3 className="text-sm font-bold text-text-primary">Filters</h3>
                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={resetFilters}
                                        className="p-1.5 -mr-1.5 rounded-full text-text-secondary hover:bg-gray-200 hover:text-text-primary"
                                        aria-label="Alle filters resetten"
                                    >
                                      <ResetAllIcon className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <DropdownSection title="Prijs" isResettable={filters.maxCost !== Infinity} onReset={() => setFilters(p=>({...p, maxCost: Infinity}))}>
                                <div className="grid grid-cols-2 gap-x-2">
                                    <RadioItem label="€0 (Gratis)" checked={filters.maxCost === 0} onChange={() => handleMaxCost(0)} />
                                    <RadioItem label="€2 max" checked={filters.maxCost === 2} onChange={() => handleMaxCost(2)} />
                                    <RadioItem label="€5 max" checked={filters.maxCost === 5} onChange={() => handleMaxCost(5)} />
                                    <RadioItem label="Alles" checked={filters.maxCost === Infinity} onChange={() => handleMaxCost(Infinity)} />
                                </div>
                            </DropdownSection>
                             <DropdownSection title="Toegang" isResettable={filters.accessLevels.length > 0} onReset={() => setFilters(p=>({...p, accessLevels: []}))}>
                                <div className="grid grid-cols-2 gap-x-2">
                                    <CheckboxItem label="Vrije inloop" checked={filters.accessLevels.includes('WALK_IN')} onChange={() => handleAccessToggle('WALK_IN')} />
                                    <CheckboxItem label="Aanmelden" checked={filters.accessLevels.includes('REGISTRATION')} onChange={() => handleAccessToggle('REGISTRATION')} />
                                </div>
                            </DropdownSection>
                        </LocalFilterDropdown>
                    )}
                </div>

                 {/* Inline Filter Toggle */}
                 <SimpleToggleButton
                    label="Inline"
                    icon={<FilterIcon className="h-5 w-5" />}
                    isActive={isInlineFilterVisible}
                    onClick={() => setIsInlineFilterVisible(!isInlineFilterVisible)}
                    hasActiveFilter={activeFilterCount > 0 && !isInlineFilterVisible}
                 />
            </div>
             
             {/* View Group */}
            <div className="flex items-center p-1 bg-surface rounded-full gap-1">
                {/* View Mode Dropdown */}
                <div className="relative">
                    <DropdownTrigger
                        label={currentViewModeLabel}
                        icon={<EyeIcon className="h-5 w-5" />}
                        isOpen={openDropdown === 'view'}
                        onClick={() => toggleDropdown('view')}
                    />
                    {openDropdown === 'view' && (
                        <LocalFilterDropdown onClose={() => setOpenDropdown(null)} widthClass="w-40">
                            {viewModeOptions.map(opt => (
                                <DropdownMenuItem
                                    key={opt.mode}
                                    label={opt.label}
                                    isActive={viewMode === opt.mode}
                                    onClick={() => { setViewMode(opt.mode); setOpenDropdown(null); }}
                                />
                            ))}
                        </LocalFilterDropdown>
                    )}
                </div>

                {/* Time View Dropdown */}
                <div className="relative">
                    <DropdownTrigger
                        label={currentTielViewLabel}
                        icon={<TimeIcon className="h-5 w-5" />}
                        isOpen={openDropdown === 'time'}
                        onClick={() => toggleDropdown('time')}
                    />
                    {openDropdown === 'time' && (
                        <LocalFilterDropdown onClose={() => setOpenDropdown(null)} widthClass="w-40">
                            {timeViewOptions.map(opt => (
                                <DropdownMenuItem
                                    key={opt.view}
                                    label={opt.label}
                                    isActive={timeView === opt.view}
                                    onClick={() => { setTimeView(opt.view); setOpenDropdown(null); }}
                                />
                            ))}
                        </LocalFilterDropdown>
                    )}
                </div>
            </div>
            
            {isAdmin && (
                <button
                    onClick={onSuperadminViewToggle}
                    aria-label="Superadmin Paneel"
                    className={`p-2 rounded-full transition-colors ${
                        viewMode === 'SUPERADMIN'
                        ? 'bg-accent text-white'
                        : 'bg-surface text-text-secondary hover:bg-border-color'
                    }`}
                >
                    <AdminIcon className="h-5 w-5" />
                </button>
            )}
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
    totalResults: number;
    venueCount: number;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const {
    geoLoading,
    geoError,
    location,
    locationType,
    onRetry,
    onManualLocationSelect,
    viewMode,
    isInlineFilterVisible
  } = props;
  
  const isGeoBarVisible = geoLoading || !!geoError || locationType === 'manual';
  const isFilterUIActive = viewMode !== 'ADMIN' && viewMode !== 'SUPERADMIN';

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

      {isInlineFilterVisible && isFilterUIActive && (
        <InlineFilterBar 
            filters={props.filters} 
            setFilters={props.setFilters} 
            sortBy={props.sortBy}
            setSortBy={props.setSortBy}
            sortInteracted={props.sortInteracted}
            setSortInteracted={props.setSortInteracted}
        />
      )}
    </header>
  );
};