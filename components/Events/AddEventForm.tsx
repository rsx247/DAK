import React, { useState, useEffect, useCallback } from 'react';
import type { Venue, FoodEvent, AccessLevel, VerificationStatus, VenueCategory, EventSubmissionData, RecurrenceRule, DayOfWeek, WeekOfMonth } from '../../types';

interface AddEventFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EventSubmissionData) => void;
    venues: Venue[];
    eventToEdit: FoodEvent | null;
}

const initialNewVenueState = {
    name: '',
    address: '',
    category: 'COMMUNITY' as VenueCategory,
    logoUrl: '',
};

const initialRecurrenceState: RecurrenceRule = {
    frequency: 'NONE',
};

const weekOfMonthOptions: { label: string, value: WeekOfMonth }[] = [
    { label: 'Eerste', value: 'FIRST' },
    { label: 'Tweede', value: 'SECOND' },
    { label: 'Derde', value: 'THIRD' },
    { label: 'Vierde', value: 'FOURTH' },
    { label: 'Laatste', value: 'LAST' },
];

const dayOfWeekOptions: { label: string, value: DayOfWeek }[] = [
    { label: 'Maandag', value: 1 },
    { label: 'Dinsdag', value: 2 },
    { label: 'Woensdag', value: 3 },
    { label: 'Donderdag', value: 4 },
    { label: 'Vrijdag', value: 5 },
    { label: 'Zaterdag', value: 6 },
    { label: 'Zondag', value: 0 },
];

export const AddEventForm: React.FC<AddEventFormProps> = ({ isOpen, onClose, onSubmit, venues, eventToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    
    const [baseDate, setBaseDate] = useState('');
    
    const [foodType, setFoodType] = useState('MEALS');
    const [dietaryTags, setDietaryTags] = useState<string[]>([]);
    const [accessLevel, setAccessLevel] = useState<AccessLevel>('WALK_IN');
    const [cost, setCost] = useState('Gratis');
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('NEEDS_VERIFICATION');
    const [sourceUrl, setSourceUrl] = useState('');
    const [registrationDeadlineDate, setRegistrationDeadlineDate] = useState('');
    const [registrationDeadlineTime, setRegistrationDeadlineTime] = useState('');
    
    const [venueOption, setVenueOption] = useState('existing');
    const [selectedVenueId, setSelectedVenueId] = useState<string>('');
    const [newVenue, setNewVenue] = useState(initialNewVenueState);
    
    const [recurrence, setRecurrence] = useState<RecurrenceRule>(initialRecurrenceState);
    const [monthlyRecurrenceType, setMonthlyRecurrenceType] = useState<'date' | 'day'>('date');

    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!eventToEdit;

    const formatDateForInput = (date: Date) => date.toISOString().slice(0, 10);
    const formatTimeForInput = (date: Date) => date.toTimeString().slice(0, 5);

    const resetForm = useCallback(() => {
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        setTitle('');
        setDescription('');
        setBaseDate(formatDateForInput(now));
        setStartTime(formatTimeForInput(now));
        setEndTime(formatTimeForInput(oneHourLater));
        setFoodType('MEALS');
        setDietaryTags([]);
        setAccessLevel('WALK_IN');
        setCost('Gratis');
        setVerificationStatus('NEEDS_VERIFICATION');
        setSourceUrl('');
        setRegistrationDeadlineDate('');
        setRegistrationDeadlineTime('');
        setVenueOption('existing');
        setSelectedVenueId(venues.length > 0 ? venues[0].id : '');
        setNewVenue(initialNewVenueState);
        setRecurrence({ frequency: 'WEEKLY', daysOfWeek: [now.getDay() as DayOfWeek] });
        setMonthlyRecurrenceType('date');
        setError(null);
    }, [venues]);

    useEffect(() => {
        if (isOpen) {
            if (eventToEdit) {
                setTitle(eventToEdit.title);
                setDescription(eventToEdit.description);
                setBaseDate(formatDateForInput(eventToEdit.startTime));
                setStartTime(formatTimeForInput(eventToEdit.startTime));
                setEndTime(formatTimeForInput(eventToEdit.endTime));
                setFoodType(eventToEdit.foodType);
                setDietaryTags(eventToEdit.dietaryTags);
                setAccessLevel(eventToEdit.accessLevel);
                setCost(eventToEdit.cost);
                setVerificationStatus(eventToEdit.verificationStatus);
                setSourceUrl(eventToEdit.sourceUrl || '');
                if (eventToEdit.registrationDeadline) {
                    setRegistrationDeadlineDate(formatDateForInput(eventToEdit.registrationDeadline));
                    setRegistrationDeadlineTime(formatTimeForInput(eventToEdit.registrationDeadline));
                } else {
                    setRegistrationDeadlineDate('');
                    setRegistrationDeadlineTime('');
                }
                setVenueOption('existing');
                setSelectedVenueId(eventToEdit.venueId);
                setNewVenue(initialNewVenueState);

                // FIX: Handle backward compatibility for recurrence rules
                const recurrenceToSet = { ...(eventToEdit.recurrence || { frequency: 'NONE' as const }) };
                if (recurrenceToSet.frequency === 'WEEKLY' && recurrenceToSet.dayOfWeek !== undefined && !recurrenceToSet.daysOfWeek) {
                    recurrenceToSet.daysOfWeek = [recurrenceToSet.dayOfWeek];
                    delete recurrenceToSet.dayOfWeek;
                }
                setRecurrence(recurrenceToSet);
                
                if(eventToEdit.recurrence?.frequency === 'MONTHLY' && eventToEdit.recurrence.weeksOfMonth) {
                    setMonthlyRecurrenceType('day');
                } else {
                    setMonthlyRecurrenceType('date');
                }
            } else {
                resetForm();
            }
        }
    }, [isOpen, eventToEdit, resetForm]);
    
    if (!isOpen) return null;

    const handleSubmit = () => {
        setError(null);
        if (!title || !baseDate || !startTime || !endTime) {
            setError('Vul alle verplichte velden in (titel, datum en tijden).');
            return;
        }

        if (venueOption === 'existing' && !selectedVenueId) {
             setError('Selecteer een bestaande locatie.');
            return;
        }

        if (venueOption === 'new' && (!newVenue.name || !newVenue.address)) {
            setError('Vul de naam en het adres voor de nieuwe locatie in.');
            return;
        }
        
        let finalRecurrence = { ...recurrence };
        // Clean up recurrence object before submitting
        if (finalRecurrence.frequency === 'WEEKLY') {
            delete finalRecurrence.dayOfWeek;
            delete finalRecurrence.monthDay;
            delete finalRecurrence.weeksOfMonth;
        } else if (finalRecurrence.frequency === 'BIWEEKLY' || (finalRecurrence.frequency === 'MONTHLY' && finalRecurrence.weeksOfMonth)) {
            delete finalRecurrence.daysOfWeek;
            delete finalRecurrence.monthDay;
        } else if (finalRecurrence.frequency === 'MONTHLY' && finalRecurrence.monthDay) {
            delete finalRecurrence.daysOfWeek;
            delete finalRecurrence.weeksOfMonth;
        }


        const submissionData: EventSubmissionData = {
            id: eventToEdit?.id,
            title,
            description,
            startTime: new Date(`${baseDate}T${startTime}`),
            endTime: new Date(`${baseDate}T${endTime}`),
            foodType,
            dietaryTags,
            accessLevel,
            cost,
            verificationStatus,
            sourceUrl: sourceUrl || undefined,
            registrationDeadline: registrationDeadlineDate && registrationDeadlineTime 
                ? new Date(`${registrationDeadlineDate}T${registrationDeadlineTime}`)
                : undefined,
            venueId: venueOption === 'existing' ? selectedVenueId : undefined,
            newVenue: venueOption === 'new' ? newVenue : undefined,
            recurrence: finalRecurrence,
        };
        
        onSubmit(submissionData);
    };

    const handleDietaryTagChange = (tag: string) => {
        setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFrequency = e.target.value as RecurrenceRule['frequency'];
        const date = new Date(baseDate + 'T12:00:00Z');
        const dayOfWeek = date.getUTCDay() as DayOfWeek;
        const monthDay = date.getUTCDate();

        let newRecurrence: RecurrenceRule = { frequency: newFrequency };

        if (newFrequency === 'WEEKLY') {
            newRecurrence.daysOfWeek = (recurrence.frequency === 'WEEKLY' && recurrence.daysOfWeek) ? recurrence.daysOfWeek : [dayOfWeek];
        } else if (newFrequency === 'BIWEEKLY') {
            newRecurrence.dayOfWeek = dayOfWeek;
        } else if (newFrequency === 'MONTHLY') {
            newRecurrence.monthDay = monthDay;
            setMonthlyRecurrenceType('date');
        }
        setRecurrence(newRecurrence);
    };

    const handleDayOfWeekChange = (day: DayOfWeek) => {
        const currentDays = recurrence.daysOfWeek || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day].sort((a,b) => a - b);
        setRecurrence(prev => ({...prev, daysOfWeek: newDays }));
    };

    const handleWeeksOfMonthChange = (week: WeekOfMonth) => {
        const currentWeeks = recurrence.weeksOfMonth || [];
        const newWeeks = currentWeeks.includes(week)
            ? currentWeeks.filter(w => w !== week)
            : [...currentWeeks, week];
        setRecurrence(prev => ({...prev, weeksOfMonth: newWeeks }));
    };


    const resetAndClose = () => {
        onClose();
    };
    
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white text-text-primary border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm";
    const labelClasses = "block text-sm font-medium text-text-secondary";

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold text-text-primary">{isEditMode ? 'Evenement Bewerken' : 'Nieuw Evenement'}</h2>
                        <button type="button" onClick={resetAndClose} className="text-text-secondary hover:text-text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
                    
                    {/* Main details */}
                    <div className="border-b border-border-color pb-6 space-y-4">
                        <div>
                            <label htmlFor="title" className={labelClasses}>Titel *</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="description" className={labelClasses}>Beschrijving</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputClasses}></textarea>
                        </div>
                    </div>
                    
                    {/* Time and Recurrence */}
                    <div className="border-b border-border-color pb-6 space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="baseDate" className={labelClasses}>Datum (voor herhaling) *</label>
                                <input type="date" id="baseDate" value={baseDate} onChange={e => setBaseDate(e.target.value)} className={inputClasses} required />
                            </div>
                            <div>
                                <label className={labelClasses}>Tijd *</label>
                                <div className="flex gap-2">
                                    <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputClasses} required aria-label="Starttijd"/>
                                    <input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputClasses} required aria-label="Eindtijd"/>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="recurrence" className={labelClasses}>Herhaling</label>
                             <select id="recurrence" value={recurrence.frequency} onChange={handleFrequencyChange} className={inputClasses}>
                                <option value="NONE">Niet herhalend</option>
                                <option value="WEEKLY">Wekelijks</option>
                                <option value="BIWEEKLY">Elke 2 weken</option>
                                <option value="MONTHLY">Maandelijks</option>
                            </select>
                        </div>
                        
                        {recurrence.frequency === 'WEEKLY' && (
                             <div className="pl-4 border-l-2 border-border-color">
                                <label className={labelClasses}>Dagen van de week</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                    {dayOfWeekOptions.map(opt => (
                                        <label key={opt.value} className="flex items-center text-sm">
                                            <input 
                                                type="checkbox" 
                                                checked={recurrence.daysOfWeek?.includes(opt.value)} 
                                                onChange={() => handleDayOfWeekChange(opt.value)}
                                                className="form-checkbox h-4 w-4 rounded text-accent focus:ring-accent"
                                            />
                                            <span className="ml-2">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {recurrence.frequency === 'MONTHLY' && (
                             <div className="pl-4 border-l-2 border-border-color space-y-4">
                                <div>
                                    <label className={labelClasses}>Maandelijkse herhaling op basis van:</label>
                                    <div className="flex gap-4 mt-1">
                                         <label className="flex items-center"><input type="radio" value="date" checked={monthlyRecurrenceType === 'date'} onChange={() => setMonthlyRecurrenceType('date')} className="form-radio text-accent focus:ring-accent mr-1"/> Datum</label>
                                         <label className="flex items-center"><input type="radio" value="day" checked={monthlyRecurrenceType === 'day'} onChange={() => setMonthlyRecurrenceType('day')} className="form-radio text-accent focus:ring-accent mr-1"/> Dag van de week</label>
                                    </div>
                                </div>
                                {monthlyRecurrenceType === 'day' && (
                                    <div>
                                        <label className={labelClasses}>Op welke week/weken van de maand?</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                            {weekOfMonthOptions.map(opt => (
                                                <label key={opt.value} className="flex items-center text-sm">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={recurrence.weeksOfMonth?.includes(opt.value)} 
                                                        onChange={() => handleWeeksOfMonthChange(opt.value)}
                                                        className="form-checkbox h-4 w-4 rounded text-accent focus:ring-accent mr-2"
                                                    />
                                                    {opt.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                             </div>
                        )}
                    </div>

                    {/* Event Details */}
                    <div className="border-b border-border-color pb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="foodType" className={labelClasses}>Type Event</label>
                                <select id="foodType" value={foodType} onChange={e => setFoodType(e.target.value)} className={inputClasses}>
                                    <option value="MEALS">Maaltijden</option>
                                    <option value="PACKAGES">Pakketten</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="accessLevel" className={labelClasses}>Toegang</label>
                                <select id="accessLevel" value={accessLevel} onChange={e => setAccessLevel(e.target.value as AccessLevel)} className={inputClasses}>
                                    <option value="WALK_IN">Vrije inloop</option>
                                    <option value="REGISTRATION">Registratie vereist</option>
                                    <option value="REFERRAL">Verwijzing nodig</option>
                                </select>
                            </div>
                        </div>

                        {accessLevel === 'REGISTRATION' && (
                            <div>
                                <label className={labelClasses}>Aanmelddeadline</label>
                                <div className="flex gap-2">
                                    <input type="date" value={registrationDeadlineDate} onChange={e => setRegistrationDeadlineDate(e.target.value)} className={inputClasses} aria-label="Aanmelddeadline datum"/>
                                    <input type="time" value={registrationDeadlineTime} onChange={e => setRegistrationDeadlineTime(e.target.value)} className={inputClasses} aria-label="Aanmelddeadline tijd"/>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cost" className={labelClasses}>Kosten</label>
                                <input type="text" id="cost" value={cost} onChange={e => setCost(e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor="sourceUrl" className={labelClasses}>Bron URL</label>
                                <input type="url" id="sourceUrl" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://..." className={inputClasses} />
                            </div>
                        </div>
                        
                        <div>
                            <label className={labelClasses}>Dieetopties</label>
                            <div className="flex flex-wrap gap-4 mt-2">
                                {['vegetarian', 'vegan', 'halal'].map(tag => (
                                    <label key={tag} className="flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            checked={dietaryTags.includes(tag)}
                                            onChange={() => handleDietaryTagChange(tag)}
                                            className="form-checkbox h-4 w-4 rounded text-accent focus:ring-accent"
                                        />
                                        <span className="ml-2 capitalize">{tag}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="verificationStatus" className={labelClasses}>Status</label>
                            <select id="verificationStatus" value={verificationStatus} onChange={e => setVerificationStatus(e.target.value as VerificationStatus)} className={inputClasses}>
                                <option value="NEEDS_VERIFICATION">Concept</option>
                                <option value="VERIFIED">Gepubliceerd</option>
                            </select>
                        </div>
                    </div>

                    {/* Venue */}
                    <div className="border-b border-border-color pb-6">
                        <fieldset>
                            <legend className={labelClasses}>Locatie *</legend>
                            <div className="mt-2 space-y-2">
                                <label className="flex items-center">
                                    <input type="radio" name="venueOption" value="existing" checked={venueOption === 'existing'} onChange={() => setVenueOption('existing')} className="form-radio text-accent focus:ring-accent" />
                                    <span className="ml-2 text-sm text-text-primary">Bestaande locatie</span>
                                </label>
                                {venueOption === 'existing' && (
                                    <select value={selectedVenueId} onChange={e => setSelectedVenueId(e.target.value)} className={`${inputClasses} ml-6 max-w-sm`}>
                                        {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                    </select>
                                )}
                                <label className="flex items-center">
                                    <input type="radio" name="venueOption" value="new" checked={venueOption === 'new'} onChange={() => setVenueOption('new')} className="form-radio text-accent focus:ring-accent" />
                                    <span className="ml-2 text-sm text-text-primary">Nieuwe locatie toevoegen</span>
                                </label>
                                {venueOption === 'new' && (
                                    <div className="ml-6 space-y-2">
                                        <input type="text" placeholder="Naam *" value={newVenue.name} onChange={e => setNewVenue(v => ({...v, name: e.target.value}))} className={inputClasses} />
                                        <input type="text" placeholder="Adres *" value={newVenue.address} onChange={e => setNewVenue(v => ({...v, address: e.target.value}))} className={inputClasses} />
                                        <input type="url" placeholder="Logo URL" value={newVenue.logoUrl} onChange={e => setNewVenue(v => ({...v, logoUrl: e.target.value}))} className={inputClasses} />
                                        <select value={newVenue.category} onChange={e => setNewVenue(v => ({...v, category: e.target.value as VenueCategory}))} className={inputClasses}>
                                          <option value="COMMUNITY">Community</option>
                                          <option value="RELIGIOUS">Religieus</option>
                                          <option value="FOOD_BANK">Voedselbank</option>
                                          <option value="FOOD_RESCUE">Voedselredding</option>
                                          <option value="COMMERCIAL">Commercieel</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </fieldset>
                    </div>

                    <div className="flex justify-end items-center space-x-4">
                        <button type="button" onClick={resetAndClose} className="px-4 py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-colors">
                            Annuleren
                        </button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium rounded-md border border-transparent text-white bg-accent hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                            {isEditMode ? 'Wijzigingen Opslaan' : 'Evenement Opslaan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};