import React, { useState, useEffect } from 'react';
import type { FilterState, AccessLevel, DietaryTag, FoodType } from '../../types';
import { ResetIcon } from './Icons';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    onReset: () => void;
    totalResults: number;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-6 border-b border-border-color">
        <h3 className="px-6 text-sm font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
        <div className="mt-4 space-y-1">{children}</div>
    </div>
);

const RadioItem: React.FC<{
    label: string;
    name: string;
    checked: boolean;
    onChange: () => void;
}> = ({ label, name, checked, onChange }) => (
    <label className="flex items-center justify-between px-6 py-3 text-sm cursor-pointer transition-colors hover:bg-surface group">
        <span className={`${checked ? 'font-bold text-accent' : 'text-text-primary'}`}>{label}</span>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${checked ? 'border-accent' : 'border-gray-300'}`}>
            {checked && <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>}
        </div>
        <input
            type="radio"
            name={name}
            checked={checked}
            onChange={onChange}
            className="sr-only"
        />
    </label>
);


const CheckboxItem: React.FC<{
    label: string;
    checked: boolean;
    onChange: () => void;
}> = ({ label, checked, onChange }) => (
     <label className="flex items-center justify-between px-6 py-3 text-sm cursor-pointer transition-colors hover:bg-surface group">
        <span className={`${checked ? 'font-bold text-accent' : 'text-text-primary'}`}>{label}</span>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-accent border-accent' : 'border-gray-300'}`}>
            {checked && (
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            )}
        </div>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
        />
    </label>
);


export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, setFilters, onReset, totalResults }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    const handleMaxCost = (cost: number | 'Infinity') => {
        const value = cost === 'Infinity' ? Infinity : Number(cost);
        setFilters(prev => ({ ...prev, maxCost: value }));
    };

    const handleAccessToggle = (level: AccessLevel | 'aanmelden') => {
        setFilters(prev => {
            let currentLevels = [...prev.accessLevels];
            if (level === 'aanmelden') {
                const hasAanmelden = currentLevels.includes('REGISTRATION') || currentLevels.includes('REFERRAL');
                if (hasAanmelden) {
                    currentLevels = currentLevels.filter(l => l !== 'REGISTRATION' && l !== 'REFERRAL');
                } else {
                    currentLevels.push('REGISTRATION', 'REFERRAL');
                }
            } else {
                 if (currentLevels.includes(level)) {
                    currentLevels = currentLevels.filter(l => l !== level);
                } else {
                    currentLevels.push(level);
                }
            }
            return { ...prev, accessLevels: [...new Set(currentLevels)] };
        });
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

    if (!isOpen) {
        return null;
    }
    
    const backdropClasses = `fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isVisible ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`;
    const panelClasses = `fixed top-0 right-0 bottom-0 bg-white shadow-2xl flex flex-col w-full max-w-sm z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`;


    return (
        <div role="dialog" aria-modal="true" aria-labelledby="filter-title" className="fixed inset-0 z-40">
            <div className={backdropClasses} onClick={handleClose} />
            <div className={panelClasses}>
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-border-color flex-shrink-0">
                    <button onClick={onReset} className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-surface transition-colors">Reset</button>
                    <h2 id="filter-title" className="text-lg font-bold text-text-primary">Filters</h2>
                    <button onClick={handleClose} className="p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors" aria-label="Sluiten">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-grow overflow-y-auto">
                    <FilterSection title="Afstand">
                        <div className="px-6 pt-2">
                            <p className="text-sm font-semibold text-text-primary mb-2">Toon locaties binnen {filters.distance === Infinity ? 'onbeperkte afstand' : `${filters.distance} km`}</p>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                step="1"
                                value={filters.distance === Infinity ? 50 : filters.distance}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setFilters(p => ({...p, distance: value >= 50 ? Infinity : value}))
                                }}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                            />
                            <div className="flex justify-between text-xs text-text-secondary mt-1">
                                <span>1km</span>
                                <span>Alles</span>
                            </div>
                        </div>
                    </FilterSection>

                    <FilterSection title="Prijs">
                        <RadioItem label="Alles" name="price" checked={filters.maxCost === Infinity} onChange={() => handleMaxCost('Infinity')} />
                        <RadioItem label="Gratis" name="price" checked={filters.maxCost === 0} onChange={() => handleMaxCost(0)} />
                        <RadioItem label="Tot €2" name="price" checked={filters.maxCost === 2} onChange={() => handleMaxCost(2)} />
                        <RadioItem label="Tot €5" name="price" checked={filters.maxCost === 5} onChange={() => handleMaxCost(5)} />
                    </FilterSection>

                    <FilterSection title="Toegang">
                        <CheckboxItem label="Vrije inloop" checked={filters.accessLevels.includes('WALK_IN')} onChange={() => handleAccessToggle('WALK_IN')} />
                        <CheckboxItem label="Aanmelden vereist" checked={filters.accessLevels.includes('REGISTRATION') || filters.accessLevels.includes('REFERRAL')} onChange={() => handleAccessToggle('aanmelden')} />
                    </FilterSection>

                    <FilterSection title="Type">
                         <CheckboxItem label="Maaltijden" checked={filters.eventTypes.includes('MEALS')} onChange={() => handleEventTypeToggle('MEALS')} />
                         <CheckboxItem label="Pakketten" checked={filters.eventTypes.includes('PACKAGES')} onChange={() => handleEventTypeToggle('PACKAGES')} />
                    </FilterSection>

                     <FilterSection title="Dieet">
                        <CheckboxItem label="Vegetarisch" checked={filters.dietaryNeeds.includes('vegetarian')} onChange={() => handleDietaryToggle('vegetarian')} />
                        <CheckboxItem label="Vegan" checked={filters.dietaryNeeds.includes('vegan')} onChange={() => handleDietaryToggle('vegan')} />
                        <CheckboxItem label="Halal" checked={filters.dietaryNeeds.includes('halal')} onChange={() => handleDietaryToggle('halal')} />
                    </FilterSection>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-border-color flex-shrink-0">
                    <button onClick={handleClose} className="w-full px-6 py-3 text-sm font-bold rounded-full text-white bg-accent hover:bg-red-600 transition-colors">
                        Toon {totalResults} resultaten
                    </button>
                </div>
            </div>
        </div>
    );
};