import React, { useState, useRef, useEffect, ReactNode, useLayoutEffect } from 'react';
import type { FilterState, AccessLevel, DietaryTag, FoodType, SortByType } from '../../types';
import { TimeIcon, DistanceIcon, AlphabeticalSortIcon, SortIcon, PriceIcon, AccessIcon, EventTypeIcon, DietIcon, CloseIcon } from './Icons';

// --- Reusable Chip & Popover Component ---
interface FilterChipProps {
    label: string;
    valueLabel: string;
    isActive: boolean;
    children: ReactNode;
    onClose: () => void;
    icon: ReactNode;
    onReset: () => void;
}
const FilterChipPopover: React.FC<FilterChipProps> = ({ label, valueLabel, isActive, children, icon, onReset }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const dropdownMenuRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);
    
    // Check for text truncation to conditionally apply a fade effect
    useLayoutEffect(() => {
        const checkTruncation = () => {
            if (textRef.current) {
                const { scrollWidth, clientWidth } = textRef.current;
                setIsTruncated(scrollWidth > clientWidth);
            }
        };
        
        let timeoutId: number;
        const debouncedCheck = () => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(checkTruncation, 100);
        };
        
        checkTruncation();
        window.addEventListener('resize', debouncedCheck);
        return () => window.removeEventListener('resize', debouncedCheck);
    }, [label, valueLabel, isActive]); // Rerun when text content changes


    // Smartly position dropdown to not go off-screen
    useLayoutEffect(() => {
        if (isOpen && dropdownMenuRef.current && popoverRef.current) {
            const dropdownEl = dropdownMenuRef.current;
            const parentRect = popoverRef.current.getBoundingClientRect();
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
    }, [isOpen, children]); // Rerun when dropdown opens or its content changes

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

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        onReset();
        setIsOpen(false);
    };
    
    // Conditionally apply a mask to fade out overflowing text
    const fadeStyle: React.CSSProperties = isTruncated ? {
        maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
    } : {};


    return (
        <div className="relative min-w-0" ref={popoverRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full pl-3 pr-2 h-8 flex items-center justify-center md:justify-start gap-1.5 text-xs font-medium rounded-full border transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 ${
                    isActive || isOpen
                        ? 'bg-accent/10 border-accent text-accent shadow-sm'
                        : 'bg-white border-border-color text-text-secondary hover:border-gray-400 hover:text-text-primary'
                }`}
            >
                {icon}
                <span 
                    ref={textRef}
                    style={fadeStyle}
                    className="flex-1 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis text-left"
                >
                     {isActive ? valueLabel : label}
                </span>
                 <div className={`flex-shrink-0 ${isActive ? 'invisible' : ''}`}>
                    <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </button>

            {isActive && (
                <button
                    onClick={handleReset}
                    className="absolute top-0 right-0 z-10 w-4 h-4 flex items-center justify-center bg-gray-500 hover:bg-gray-700 text-white rounded-full transition-all duration-150 transform translate-x-1/4 -translate-y-1/4 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500"
                    aria-label={`Reset ${label} filter`}
                >
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            )}

            {isOpen && (
                <div 
                    ref={dropdownMenuRef} 
                    className="absolute top-full mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                >
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

const SortPopoverItem: React.FC<{ 
    label: string; 
    isActive: boolean; 
    onClick: () => void; 
    icon: React.ReactNode; 
    onClose?: () => void;
}> = ({ label, isActive, onClick, icon, onClose }) => {
    const handleClick = () => {
        onClick();
        if (onClose) {
            onClose();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3
                ${isActive ? 'font-semibold bg-accent/10 text-accent' : 'text-text-primary hover:bg-surface'}
            `}
            role="menuitem"
        >
            <span className={isActive ? 'text-accent' : 'text-text-secondary'}>{icon}</span>
            <span>{label}</span>
        </button>
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
    const handleMaxCost = (cost: number) => {
        setFilters(prev => ({
            ...prev,
            maxCost: prev.maxCost === cost ? Infinity : cost
        }));
    };
    const handleAccessToggle = (level: AccessLevel) => setFilters(prev => ({ ...prev, accessLevels: prev.accessLevels.includes(level) ? prev.accessLevels.filter(l => l !== level) : [...prev.accessLevels, level] }));
    const handleEventTypeToggle = (type: FoodType) => setFilters(prev => ({ ...prev, eventTypes: prev.eventTypes.includes(type) ? prev.eventTypes.filter(t => t !== type) : [...prev.eventTypes, type] }));
    const handleDietaryToggle = (need: DietaryTag) => setFilters(prev => ({ ...prev, dietaryNeeds: prev.dietaryNeeds.includes(need) ? prev.dietaryNeeds.filter(n => n !== need) : [...prev.dietaryNeeds, need] }));

    // --- Value Label Getters for Active State ---
    const getPriceValueLabel = () => {
        if (filters.maxCost === 0) return '€0';
        if (filters.maxCost === Infinity) return 'Alles';
        return `€${filters.maxCost} max`;
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
    const sortOptions: { type: SortByType, label: string, icon: React.ReactElement }[] = [
        { type: 'distance', label: 'Afstand', icon: <DistanceIcon className="w-4 h-4 flex-shrink-0" /> },
        { type: 'time', label: 'Tijd', icon: <TimeIcon className="w-4 h-4 flex-shrink-0" /> },
        { type: 'alphabetical', label: 'A-Z', icon: <AlphabeticalSortIcon className="w-4 h-4 flex-shrink-0" /> },
    ];
    const activeSortOption = sortOptions.find(opt => opt.type === sortBy) || sortOptions[0];
    
    const handleSort = (type: SortByType) => {
        if (sortBy === type) {
            setSortBy('distance'); // Reset to default
            setSortInteracted(false);
        } else {
            setSortBy(type);
            setSortInteracted(true);
        }
    };
    
    const sortIcon = sortInteracted
        ? activeSortOption.icon
        : <SortIcon className="w-4 h-4 flex-shrink-0" />;
    
    return (
        <div className="bg-surface border-b border-border-color">
            <div className="max-w-screen-xl mx-auto">
                <div className="px-4 h-14 flex items-center gap-2 flex-nowrap">
                    
                    {/* Sort Chip */}
                    <FilterChipPopover 
                        label="Sorteer"
                        valueLabel={activeSortOption.label} 
                        isActive={sortInteracted} 
                        icon={sortIcon}
                        onClose={() => {}}
                        onReset={() => { setSortBy('distance'); setSortInteracted(false); }}
                    >
                        {sortOptions.map(opt => (
                            <SortPopoverItem 
                                key={opt.type}
                                label={opt.label}
                                isActive={sortBy === opt.type}
                                onClick={() => handleSort(opt.type)}
                                icon={opt.icon}
                            />
                        ))}
                    </FilterChipPopover>
                    <div className="w-px h-6 bg-border-color mx-1" />
                    
                    {/* Price Filter Chip */}
                    <FilterChipPopover 
                        label="Prijs" 
                        valueLabel={getPriceValueLabel()} 
                        isActive={filters.maxCost !== Infinity}
                        icon={<PriceIcon className="w-4 h-4 flex-shrink-0" />}
                        onClose={() => {}}
                        onReset={() => handleMaxCost(Infinity)}
                    >
                        <PopoverItem label="€0 (Gratis)" checked={filters.maxCost === 0} onChange={() => handleMaxCost(0)} type="radio" />
                        <PopoverItem label="€2 max" checked={filters.maxCost === 2} onChange={() => handleMaxCost(2)} type="radio" />
                        <PopoverItem label="€5 max" checked={filters.maxCost === 5} onChange={() => handleMaxCost(5)} type="radio" />
                        <PopoverItem label="Alles" checked={filters.maxCost === Infinity} onChange={() => handleMaxCost(Infinity)} type="radio" />
                    </FilterChipPopover>
                    
                    {/* Access Filter Chip */}
                    <FilterChipPopover 
                        label="Toegang" 
                        valueLabel={getAccessValueLabel()} 
                        isActive={filters.accessLevels.length > 0}
                        icon={<AccessIcon className="w-4 h-4 flex-shrink-0" />}
                        onClose={() => {}}
                        onReset={() => setFilters(p => ({...p, accessLevels: []}))}
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
                        onReset={() => setFilters(p => ({...p, eventTypes: []}))}
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
                        onReset={() => setFilters(p => ({...p, dietaryNeeds: []}))}
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