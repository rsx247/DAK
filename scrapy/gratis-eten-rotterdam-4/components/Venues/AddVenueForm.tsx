
import React, { useState, useEffect } from 'react';
import type { Venue, VenueCategory, VenueSubmissionData } from '../../types';

const translateVenueCategory = (category: VenueCategory): string => {
    switch (category) {
        case 'COMMUNITY': return 'Sociaal';
        case 'RELIGIOUS': return 'Religieus';
        case 'FOOD_BANK': return 'Voedselbank';
        case 'COMMERCIAL': return 'Commercieel';
        default: return category;
    }
};

interface AddVenueFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: VenueSubmissionData) => void;
    venueToEdit: Venue | null;
}

export const AddVenueForm: React.FC<AddVenueFormProps> = ({ isOpen, onClose, onSubmit, venueToEdit }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [category, setCategory] = useState<VenueCategory>('COMMUNITY');
    const [logoUrl, setLogoUrl] = useState('');
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!venueToEdit;

    const resetForm = () => {
        setName('');
        setAddress('');
        setCategory('COMMUNITY');
        setLogoUrl('');
        setError(null);
    };

    const resetAndClose = () => {
        resetForm();
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            if (venueToEdit) {
                setName(venueToEdit.name);
                setAddress(venueToEdit.address);
                setCategory(venueToEdit.category);
                setLogoUrl(venueToEdit.logoUrl || '');
            } else {
                resetForm();
            }
        }
    }, [isOpen, venueToEdit]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = () => {
        setError(null);
        if (!name || !address) {
            setError('Naam en adres zijn verplichte velden.');
            return;
        }

        const submissionData: VenueSubmissionData = {
            id: venueToEdit?.id,
            name,
            address,
            category,
            logoUrl: logoUrl || undefined,
        };
        
        onSubmit(submissionData);
    };
    
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white text-text-primary border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm";
    const selectClasses = `${inputClasses} appearance-none bg-no-repeat bg-right-2`;
    const selectStyle = { backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em'};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold text-text-primary">{isEditMode ? 'Locatie Bewerken' : 'Nieuwe Locatie Toevoegen'}</h2>
                        <button type="button" onClick={resetAndClose} className="text-text-secondary hover:text-text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
                    
                    <div>
                        <label htmlFor="venueName" className="block text-sm font-medium text-text-secondary">Naam locatie *</label>
                        <input type="text" id="venueName" value={name} onChange={e => setName(e.target.value)} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="venueAddress" className="block text-sm font-medium text-text-secondary">Adres *</label>
                        <input type="text" id="venueAddress" value={address} onChange={e => setAddress(e.target.value)} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="venueCategory" className="block text-sm font-medium text-text-secondary">Categorie</label>
                        <select id="venueCategory" value={category} onChange={e => setCategory(e.target.value as VenueCategory)} className={selectClasses} style={selectStyle}>
                            <option value="COMMUNITY">{translateVenueCategory('COMMUNITY')}</option>
                            <option value="RELIGIOUS">{translateVenueCategory('RELIGIOUS')}</option>
                            <option value="FOOD_BANK">{translateVenueCategory('FOOD_BANK')}</option>
                            <option value="COMMERCIAL">{translateVenueCategory('COMMERCIAL')}</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-text-secondary">Logo URL (optioneel)</label>
                        <input type="url" id="logoUrl" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." className={inputClasses} />
                    </div>

                    <div className="border-t border-border-color pt-6 flex justify-end items-center space-x-4">
                        <button type="button" onClick={resetAndClose} className="px-4 py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-colors">
                            Annuleren
                        </button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium rounded-md border border-transparent text-white bg-accent hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                            {isEditMode ? 'Wijzigingen Opslaan' : 'Locatie Opslaan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
