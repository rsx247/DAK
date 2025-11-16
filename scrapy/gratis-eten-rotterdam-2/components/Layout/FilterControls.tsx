import React, { useState } from 'react';
import type { FilterState, SortByType, AccessLevel, DietaryTag, FoodType } from '../../types';
import { getCurrentVenueColumnWidth } from '../../config/layout';
import { TimeIcon, DistanceIcon, PriceIcon, AccessIcon, DietIcon, EventTypeIcon, CheckIcon } from './Icons';
import { FilterDropdown } from './FilterDropdown';

interface FilterControlsProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    sortBy: SortByType;
    setSortBy: React.Dispatch<React.SetStateAction<SortByType>>;
    venueCount: number;
    onAccessToggle: (level: AccessLevel | 'aanmelden') => void;
}

const SortButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => (
    <button
        onClick={onClick}
        aria-label={label}
        className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
            isActive 
            ? 'bg-accent text-white' 
            : 'bg-surface text-text-secondary hover:bg-border-color'
        }`}
    >
        {children}
    </button>
);

const FilterButton: React.FC<{
    defaultLabel: string;
    activeLabel?: string;
    isActive: boolean;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ defaultLabel, activeLabel, isActive, isOpen, onClick, children }) => {
    
    const hasActiveLabel = isActive && activeLabel;

    const baseClasses = `h-9 flex items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200 ease-in-out`;
    
    // On mobile, active filters grow to show text. They share the available space.
    // flex-grow makes them expand, flex-shrink allows them to shrink if needed, min-w-0 is crucial for truncation.
    const sizeClasses = hasActiveLabel 
        ? 'w-auto px-3 flex-grow flex-shrink min-w-0'
        : 'w-9 flex-shrink-0 md:w-auto md:px-3';
        
    let stateClasses = '';
    if (isOpen) {
        stateClasses = 'bg-white border-accent border-2 border-b-0 rounded-t-lg rounded-b-none z-20 -mb-px';
    } else if (isActive) {
        stateClasses = 'bg-accent text-white border-accent rounded-full hover:bg-red-600';
    } else {
        stateClasses = 'bg-white text-text-secondary border-border-color border rounded-full hover:bg-surface';
    }

    const labelToShow = hasActiveLabel ? activeLabel : defaultLabel;
    const iconColorClass = isOpen ? 'text-accent' : isActive ? 'text-white' : 'text-text-secondary';

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${sizeClasses} ${stateClasses}`}
        >
            <div className={iconColorClass}>
                {children}
            </div>
            <span className={`whitespace-nowrap overflow-hidden text-ellipsis ${hasActiveLabel ? 'inline' : 'hidden md:inline'}`}>
                {labelToShow}
            </span>
        </button>
    );
};

const PriceSelectItem: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors
            ${isActive ? 'font-bold text-accent' : 'text-text-primary'}
            hover:bg-accent hover:text-white
        `}
        role="menuitem"
    >
        {label}
    </button>
);


const CheckboxItem: React.FC<{
    label: string;
    checked: boolean;
    onChange: () => void;
}> = ({ label, checked, onChange }) => (
     <label className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-accent hover:text-white group`}>
        <span className={`${checked ? 'font-bold text-accent group-hover:text-white' : 'text-text-primary group-hover:text-white'}`}>{label}</span>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-accent border-accent' : 'border-gray-300 group-hover:border-white'}`}>
            {checked && <CheckIcon className="w-4 h-4 text-white" />}
        </div>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
        />
    </label>
);


export const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters, sortBy, setSortBy, venueCount, onAccessToggle }) => {
    const venueColWidth = getCurrentVenueColumnWidth(false, 1);
    const [openFilter, setOpenFilter] = useState<string | null>(null);

    const toggleFilter = (filterName: string) => {
        setOpenFilter(prev => (prev === filterName ? null : filterName));
    };

    const handleMaxCost = (cost: number | 'Infinity') => {
        const value = cost === 'Infinity' ? Infinity : Number(cost);
        setFilters(prev => ({ ...prev, maxCost: value }));
        setOpenFilter(null);
    };

    const handleEventTypeToggle = (type: FoodType) => {
        setFilters(prev => {
            const newTypes = prev.eventTypes.includes(type)
                ? prev.eventTypes.filter(t => t !== type)
                : [...prev.eventTypes, type];
            return { ...prev, eventTypes: newTypes };
        });
    };
    
    const handleDietaryToggle = (need: DietaryTag) => {
        setFilters(prev => {
            const newNeeds = prev.dietaryNeeds.includes(need)
                ? prev.dietaryNeeds.filter(n => n !== need)
                : [...prev.dietaryNeeds, need];
            return { ...prev, dietaryNeeds: newNeeds };
        });
    };

    const resetFilters = () => {
        setFilters({ ...filters, maxCost: Infinity, accessLevels: [], eventTypes: [], dietaryNeeds: [] });
    };

    const activeFilterCount = 
        (filters.maxCost !== Infinity ? 1 : 0) +
        filters.accessLevels.length +
        filters.eventTypes.length +
        filters.dietaryNeeds.length;
    
    const getPriceActiveLabel = () => {
        if (filters.maxCost === 0) return "0";
        if (filters.maxCost === 2) return "2";
        if (filters.maxCost === 5) return "5";
        return undefined;
    };
    
    const getMultiSelectActiveLabel = (count: number) => {
        if (count === 0) return undefined;
        return count.toString();
    };

    return (
        <div className="border-b border-border-color bg-white">
            <div className="max-w-screen-xl mx-auto flex h-14">
                {/* Left Side: Sorting */}
                <div
                    className="flex-shrink-0 px-2 md:px-4 border-r border-border-color flex items-center justify-end"
                    style={{ width: `${venueColWidth}px` }}
                >
                    <div className="flex items-center gap-2">
                        <SortButton label="Sorteer op afstand" isActive={sortBy === 'distance'} onClick={() => setSortBy('distance')}>
                            <DistanceIcon className="w-5 h-5" />
                        </SortButton>
                        <SortButton label="Sorteer op tijd" isActive={sortBy === 'time'} onClick={() => setSortBy('time')}>
                            <TimeIcon className="w-5 h-5" />
                        </SortButton>
                    </div>
                </div>

                {/* Right Side: Filtering */}
                <div className="flex-grow flex flex-col justify-center px-3 relative min-w-0">
                     <div className="flex items-center gap-2 w-full">
                         {/* Price Filter */}
                         <div className="relative">
                            <FilterButton
                                defaultLabel="Prijs"
                                activeLabel={getPriceActiveLabel()}
                                isActive={filters.maxCost !== Infinity}
                                isOpen={openFilter === 'price'}
                                onClick={() => toggleFilter('price')}
                            >
                                <PriceIcon className="w-5 h-5" />
                            </FilterButton>
                            {openFilter === 'price' && (
                                <FilterDropdown onClose={() => setOpenFilter(null)}>
                                    <PriceSelectItem label="Geen filter" isActive={filters.maxCost === Infinity} onClick={() => handleMaxCost('Infinity')} />
                                    <PriceSelectItem label="€0" isActive={filters.maxCost === 0} onClick={() => handleMaxCost(0)} />
                                    <PriceSelectItem label="< €2" isActive={filters.maxCost === 2} onClick={() => handleMaxCost(2)} />
                                    <PriceSelectItem label="< €5" isActive={filters.maxCost === 5} onClick={() => handleMaxCost(5)} />
                                </FilterDropdown>
                            )}
                         </div>
                         {/* Access Filter */}
                         <div className="relative">
                            <FilterButton
                                defaultLabel="Toegang"
                                activeLabel={getMultiSelectActiveLabel(filters.accessLevels.length)}
                                isActive={filters.accessLevels.length > 0}
                                isOpen={openFilter === 'access'}
                                onClick={() => toggleFilter('access')}
                            >
                                <AccessIcon className="w-5 h-5" />
                            </FilterButton>
                             {openFilter === 'access' && (
                                <FilterDropdown onClose={() => setOpenFilter(null)}>
                                    <CheckboxItem label="Vrije inloop" checked={filters.accessLevels.includes('WALK_IN')} onChange={() => onAccessToggle('WALK_IN')} />
                                    <CheckboxItem label="Aanmelden vereist" checked={filters.accessLevels.includes('REGISTRATION') || filters.accessLevels.includes('REFERRAL')} onChange={() => onAccessToggle('aanmelden')} />
                                </FilterDropdown>
                            )}
                         </div>
                         {/* Type Filter */}
                         <div className="relative">
                             <FilterButton
                                defaultLabel="Type"
                                activeLabel={getMultiSelectActiveLabel(filters.eventTypes.length)}
                                isActive={filters.eventTypes.length > 0}
                                isOpen={openFilter === 'type'}
                                onClick={() => toggleFilter('type')}
                            >
                                <EventTypeIcon className="w-5 h-5" />
                            </FilterButton>
                             {openFilter === 'type' && (
                                <FilterDropdown onClose={() => setOpenFilter(null)}>
                                    <CheckboxItem label="Maaltijden" checked={filters.eventTypes.includes('MEALS')} onChange={() => handleEventTypeToggle('MEALS')} />
                                    <CheckboxItem label="Pakketten" checked={filters.eventTypes.includes('PACKAGES')} onChange={() => handleEventTypeToggle('PACKAGES')} />
                                </FilterDropdown>
                            )}
                         </div>
                         {/* Diet Filter */}
                         <div className="relative">
                             <FilterButton
                                defaultLabel="Dieet"
                                activeLabel={getMultiSelectActiveLabel(filters.dietaryNeeds.length)}
                                isActive={filters.dietaryNeeds.length > 0}
                                isOpen={openFilter === 'diet'}
                                onClick={() => toggleFilter('diet')}
                            >
                                <DietIcon className="w-5 h-5" />
                            </FilterButton>
                            {openFilter === 'diet' && (
                                <FilterDropdown onClose={() => setOpenFilter(null)}>
                                     <CheckboxItem label="Vegetarisch" checked={filters.dietaryNeeds.includes('vegetarian')} onChange={() => handleDietaryToggle('vegetarian')} />
                                     <CheckboxItem label="Vegan" checked={filters.dietaryNeeds.includes('vegan')} onChange={() => handleDietaryToggle('vegan')} />
                                     <CheckboxItem label="Halal" checked={filters.dietaryNeeds.includes('halal')} onChange={() => handleDietaryToggle('halal')} />
                                </FilterDropdown>
                            )}
                         </div>
                     </div>
                     {activeFilterCount > 0 && (
                        <div className="text-xs text-text-secondary h-4 mt-1 absolute top-full left-3">
                            {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} actief —{' '}
                            <button onClick={resetFilters} className="underline hover:no-underline">Toon alles</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};