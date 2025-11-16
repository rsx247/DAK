import React, { useState, useRef, useEffect, ReactNode } from 'react';
import type { FilterState, AccessLevel, DietaryTag, FoodType, SortByType } from '../../types';
import { TimeIcon, DistanceIcon, AlphabeticalSortIcon, SortIcon, PriceIcon, AccessIcon, EventTypeIcon, DietIcon } from './Icons';

// --- Reusable Chip & Popover Component ---
interface FilterChipProps {
    label: string;
    valueLabel: string;
    isActive: boolean;
    children: ReactNode;
    onClose: () => void;
    icon: ReactNode;
}
const FilterChipPopover: React.FC<FilterChipProps> = ({ label, valueLabel, isActive, children, onClose, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isActive) {
            setIsOpen(false);
        }
    }, [isActive]);

    // Effect to check for text overflow and apply fade only when needed.
    useEffect(() => {
        const checkOverflow = () => {
            if (textRef.current) {
                const hasOverflow = textRef.current.scrollWidth > textRef.current.clientWidth;
                if (isOverflowing !== hasOverflow) {
                    setIsOverflowing(hasOverflow);
                }
            }
        };

        // Use rAF to ensure check happens after paint when dimensions are correct.
        const animationFrameId = requestAnimationFrame(checkOverflow);
        
        window.addEventListener('resize', checkOverflow);
        
        return () => {
            window.removeEventListener('resize', checkOverflow);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActive, isOpen, valueLabel, label, isOverflowing]);


    // Style for the fade-out truncation effect, applied conditionally.
    const fadeStyle: React.CSSProperties = isOverflowing ? {
        maskImage: 'linear-gradient(to right, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent)',
    } : {};

    return (
        <div className="relative min-w-0" ref={popoverRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 h-8 flex items-center justify-center md:justify-start gap-1.5 text-xs font-medium rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 ${
                    isActive || isOpen
                        ? 'bg-accent/10 border-accent text-accent'
                        : 'bg-white border-border-color text-text-secondary hover:border-accent hover:text-accent hover:bg-accent/5 active:bg-accent/10'
                }`}
            >
                <span className={isActive ? 'hidden md:inline-block' : 'inline-block'}>{icon}</span>
                <span className="flex-1 min-w-0" style={fadeStyle}>
                    <span ref={textRef} className="block whitespace-nowrap overflow-hidden text-clip text-left">
                        {isActive ? valueLabel : <span className="hidden md:inline">{label}</span>}
                    </span>
                </span>
                <svg className={`w-3.5 h-3.5 transition-transform flex-shrink-0 hidden md:inline-block ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        {React.Children.map(children, child => 
                            React.isValidElement(child) ? React.cloneElement(child, { onClose: () => setIsOpen(false) } as any) : child
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const PopoverItem: React.FC<{ label: string; checked: boolean; onChange: () => void; onClose?: () => void; type: 'radio' | 'checkbox'}> = ({ label, checked, onChange, onClose, type }) => {
    const handleChange = () => {
        onChange();
        if (onClose && type === 'radio') {
            onClose();
        }
    };
    return (
        <label className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-surface">
            {type === 'radio' ? (
                 <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center ${checked ? 'border-accent' : 'border-gray-300'}`}>
                    {checked && <div className="w-2 h-2 bg-accent rounded-full"></div>}
                </div>
            ) : (
                <div className={`w-4 h-4 rounded border-2 mr-3 flex-shrink-0 flex items-center justify-center ${checked ? 'bg-accent border-accent' : 'border-gray-300'}`}>
                    {checked && <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
            )}
            <span className={checked ? 'font-semibold text-accent' : 'text-text-primary'}>{label}</span>
            <input type={type} checked={checked} onChange={handleChange} className="sr-only" />
        </label>
    );
};

// --- Main Inline Filter Bar Component ---

interface InlineFilterBarProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    sortBy: SortByType;
    setSortBy: React.Dispatch<React.SetStateAction<SortByType>>;
    sortInteracted: boolean;
    setSortInteracted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InlineFilterBar: React.FC<InlineFilterBarProps> = ({ filters, setFilters, sortBy, setSortBy, sortInteracted, setSortInteracted }) => {
    const handleMaxCost = (cost: number | 'Infinity') => setFilters(prev => ({ ...prev, maxCost: cost === 'Infinity' ? Infinity : cost }));
    const handleAccessToggle = (level: AccessLevel) => setFilters(prev => ({ ...prev, accessLevels: prev.accessLevels.includes(level) ? prev.accessLevels.filter(l => l !== level) : [...prev.accessLevels, level] }));
    const handleEventTypeToggle = (type: FoodType) => setFilters(prev => ({ ...prev, eventTypes: prev.eventTypes.includes(type) ? prev.eventTypes.filter(t => t !== type) : [...prev.eventTypes, type] }));
    const handleDietaryToggle = (need: DietaryTag) => setFilters(prev => ({ ...prev, dietaryNeeds: prev.dietaryNeeds.includes(need) ? prev.dietaryNeeds.filter(n => n !== need) : [...prev.dietaryNeeds, need] }));

    // --- Value Label Getters for Active State ---
    const getPriceValueLabel = () => {
        if (filters.maxCost === 0) return 'Gratis';
        return `€${filters.maxCost}`;
    };

    const getAccessValueLabel = () => {
        const count = filters.accessLevels.length;
        if (count === 1) {
            const level = filters.accessLevels[0];
            if (level === 'WALK_IN') return 'Vrije inloop';
            if (level === 'REGISTRATION') return 'Aanmelden';
            if (level === 'REFERRAL') return 'Verwijzing';
        }
        return `${count} gekozen`;
    };

    const getTypeValueLabel = () => {
        if (filters.eventTypes.length === 1) {
            return filters.eventTypes[0] === 'MEALS' ? 'Maaltijden' : 'Pakketten';
        }
        return `${filters.eventTypes.length} gekozen`;
    };

    const getDietValueLabel = () => {
        const count = filters.dietaryNeeds.length;
        const translate = (tag: DietaryTag) => {
            if (tag === 'vegetarian') return 'Vegetarisch';
            if (tag === 'vegan') return 'Vegan';
            return 'Halal';
        };
        if (count === 1) return translate(filters.dietaryNeeds[0]);
        return `${count} gekozen`;
    };
    
    // --- Sort Logic ---
    // FIX: Changed the type of the 'icon' property from 'React.ReactNode' to 'React.ReactElement' to be more specific.
    const sortOptions: { type: SortByType, label: string, icon: React.ReactElement }[] = [
        { type: 'distance', label: 'Afstand', icon: <DistanceIcon /> },
        { type: 'time', label: 'Tijd', icon: <TimeIcon /> },
        { type: 'alphabetical', label: 'A-Z', icon: <AlphabeticalSortIcon /> },
    ];
    const activeSortOption = sortOptions.find(opt => opt.type === sortBy) || sortOptions[0];
    const isSortActive = sortInteracted && sortBy !== 'distance';
    // FIX: Removed the type assertion `as React.ReactElement` which is no longer needed after strengthening the type of `sortOptions`.
    const sortIcon = sortInteracted
        ? React.cloneElement(activeSortOption.icon, { className: "w-4 h-4 flex-shrink-0" })
        : <SortIcon className="w-4 h-4 flex-shrink-0" />;
    
    return (
        <div className="bg-surface border-b border-border-color">
            <div className="max-w-screen-xl mx-auto">
                <div className="px-4 h-14 flex items-center gap-2 flex-nowrap">
                    
                    {/* Sort Chip */}
                    <FilterChipPopover 
                        label={sortInteracted ? activeSortOption.label : "Sorteer"}
                        valueLabel={activeSortOption.label} 
                        isActive={isSortActive} 
                        icon={sortIcon}
                        onClose={() => {}}
                    >
                        {sortOptions.map(opt => (
                             <PopoverItem 
                                key={opt.type} 
                                label={opt.label} 
                                checked={sortBy === opt.type} 
                                onChange={() => { setSortBy(opt.type); setSortInteracted(true); }}
                                type="radio" 
                            />
                        ))}
                    </FilterChipPopover>
                    <div className="w-px h-6 bg-border-color mx-1 hidden md:block" />
                    
                    {/* Distance Filter Chip */}
                    <FilterChipPopover
                        label="Afstand"
                        valueLabel={filters.distance === Infinity ? 'Alles' : `< ${filters.distance} km`}
                        isActive={filters.distance !== Infinity}
                        icon={<DistanceIcon className="w-4 h-4 flex-shrink-0" />}
                        onClose={() => {}}
                    >
                        <PopoverItem label="Alles" checked={filters.distance === Infinity} onChange={() => setFilters(p => ({...p, distance: Infinity}))} type="radio" />
                        <PopoverItem label="< 1 km" checked={filters.distance === 1} onChange={() => setFilters(p => ({...p, distance: 1}))} type="radio" />
                        <PopoverItem label="< 5 km" checked={filters.distance === 5} onChange={() => setFilters(p => ({...p, distance: 5}))} type="radio" />
                        <PopoverItem label="< 10 km" checked={filters.distance === 10} onChange={() => setFilters(p => ({...p, distance: 10}))} type="radio" />
                        <PopoverItem label="< 25 km" checked={filters.distance === 25} onChange={() => setFilters(p => ({...p, distance: 25}))} type="radio" />
                    </FilterChipPopover>

                    {/* Price Filter Chip */}
                    <FilterChipPopover 
                        label="Prijs" 
                        valueLabel={getPriceValueLabel()} 
                        isActive={filters.maxCost !== Infinity}
                        icon={<PriceIcon className="w-4 h-4 flex-shrink-0" />}
                        onClose={() => {}}
                    >
                        <PopoverItem label="Alles" checked={filters.maxCost === Infinity} onChange={() => handleMaxCost('Infinity')} type="radio" />
                        <PopoverItem label="Gratis" checked={filters.maxCost === 0} onChange={() => handleMaxCost(0)} type="radio" />
                        <PopoverItem label="Tot €2" checked={filters.maxCost === 2} onChange={() => handleMaxCost(2)} type="radio" />
                        <PopoverItem label="Tot €5" checked={filters.maxCost === 5} onChange={() => handleMaxCost(5)} type="radio" />
                    </FilterChipPopover>
                    
                    {/* Access Filter Chip */}
                    <FilterChipPopover 
                        label="Toegang" 
                        valueLabel={getAccessValueLabel()} 
                        isActive={filters.accessLevels.length > 0}
                        icon={<AccessIcon className="w-4 h-4 flex-shrink-0" />}
                        onClose={() => {}}
                    >
                         <PopoverItem label="Vrije inloop" checked={filters.accessLevels.includes('WALK_IN')} onChange={() => handleAccessToggle('WALK_IN')} type="checkbox" />
                         <PopoverItem label="Aanmelden" checked={filters.accessLevels.includes('REGISTRATION')} onChange={() => handleAccessToggle('REGISTRATION')} type="checkbox" />
                         <PopoverItem label="Verwijzing" checked={filters.accessLevels.includes('REFERRAL')} onChange={() => handleAccessToggle('REFERRAL')} type="checkbox" />
                    </FilterChipPopover>

                    {/* Event Type Filter Chip */}
                    <FilterChipPopover 
                        label="Type" 
                        valueLabel={getTypeValueLabel()} 
                        isActive={filters.eventTypes.length > 0}
                        icon={<EventTypeIcon className="w-4 h-4 flex-shrink-0" />}
                        onClose={() => {}}
                    >
                         <PopoverItem label="Maaltijden" checked={filters.eventTypes.includes('MEALS')} onChange={() => handleEventTypeToggle('MEALS')} type="checkbox" />
                         <PopoverItem label="Pakketten" checked={filters.eventTypes.includes('PACKAGES')} onChange={() => handleEventTypeToggle('PACKAGES')} type="checkbox" />
                    </FilterChipPopover>
                    
                     {/* Dietary Needs Filter Chip */}
                    <FilterChipPopover 
                        label="Dieet" 
                        valueLabel={getDietValueLabel()} 
                        isActive={filters.dietaryNeeds.length > 0}
                        icon={<DietIcon className="w-4 h-4 flex-shrink-0" />}
                        onClose={() => {}}
                    >
                         <PopoverItem label="Vegetarisch" checked={filters.dietaryNeeds.includes('vegetarian')} onChange={() => handleDietaryToggle('vegetarian')} type="checkbox" />
                         <PopoverItem label="Vegan" checked={filters.dietaryNeeds.includes('vegan')} onChange={() => handleDietaryToggle('vegan')} type="checkbox" />
                         <PopoverItem label="Halal" checked={filters.dietaryNeeds.includes('halal')} onChange={() => handleDietaryToggle('halal')} type="checkbox" />
                    </FilterChipPopover>
                </div>
            </div>
        </div>
    );
};
