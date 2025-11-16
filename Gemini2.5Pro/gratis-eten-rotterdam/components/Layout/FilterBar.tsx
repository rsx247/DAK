
import React from 'react';
import type { FilterState } from '../../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

const FilterButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent";
  const activeClasses = "bg-accent text-white border-accent";
  const inactiveClasses = "bg-white text-text-secondary border-border-color hover:bg-surface";
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {children}
    </button>
  );
};

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  
  const handleFilterChange = <K extends keyof FilterState,>(key: K, value: FilterState[K]) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white border-b border-border-color p-3 sticky top-[89px] z-20 overflow-x-auto">
      <div className="max-w-screen-xl mx-auto flex items-center space-x-2 whitespace-nowrap">
        <FilterButton isActive={filters.distance === 5} onClick={() => handleFilterChange('distance', filters.distance === 5 ? Infinity : 5)}>
          5 km
        </FilterButton>
        <FilterButton isActive={filters.accessLevel === 'WALK_IN'} onClick={() => handleFilterChange('accessLevel', filters.accessLevel === 'WALK_IN' ? 'ALL' : 'WALK_IN')}>
          Vrije inloop
        </FilterButton>
        <FilterButton isActive={filters.eventType === 'MEALS'} onClick={() => handleFilterChange('eventType', filters.eventType === 'MEALS' ? 'ALL' : 'MEALS')}>
          Maaltijden
        </FilterButton>
        <FilterButton isActive={filters.eventType === 'PACKAGES'} onClick={() => handleFilterChange('eventType', filters.eventType === 'PACKAGES' ? 'ALL' : 'PACKAGES')}>
          Pakketten
        </FilterButton>
      </div>
    </div>
  );
};
