import React, { useState, useEffect, useCallback } from 'react';
// FIX: Add FoodType to import to resolve 'Cannot find name' errors.
import type { Venue, FoodEvent, FoodType, AccessLevel, VerificationStatus, VenueCategory, EventSubmissionData, RecurrenceRule, DayOfWeek, WeekOfMonth, RegistrationInfo, RecurrenceDeadline, DietaryTag } from '../../types';

const translateDietaryTag = (tag: string): string => {
    switch (tag.toLowerCase()) {
        case 'vegetarian': return 'Vegetarisch';
        case 'vegan': return 'Veganistisch';
        case 'halal': return 'Halal';
        default: return tag;
    }
};

const translateVenueCategory = (category: VenueCategory): string => {
    switch (category) {
        case 'COMMUNITY': return 'Sociaal';
        case 'RELIGIOUS': return 'Religieus';
        case 'FOOD_BANK': return 'Voedselbank';
        case 'COMMERCIAL': return 'Commercieel';
        default: return category;
    }
};

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

const initialRegistrationInfoState: RegistrationInfo = {
    type: 'URL',
    value: '',
    notes: '',
};

const weekOfMonthOptions: { label: string, value: WeekOfMonth }[] = [
    { label: 'Eerste', value: 'FIRST' },
    { label: 'Tweede', value: 'SECOND' },
    { label: 'Derde', value: 'THIRD' },
    { label: 'Vierde', value: 'FOURTH' },
    { label: 'Laatste', value: 'LAST' },
];

const dayOfWeekOptions: { label: string, value: DayOfWeek }[] = [
    { label: 'Ma', value: 1 },
    { label: 'Di', value: 2 },
    { label: 'Wo', value: 3 },
    { label: 'Do', value: 4 },
    { label: 'Vr', value: 5 },
    { label: 'Za', value: 6 },
    { label: 'Zo', value: 0 },
];

// FIX: Defined dietary options with the correct type.
const dietOptions: DietaryTag[] = ['vegetarian', 'vegan', 'halal'];

export const AddEventForm: React.FC<AddEventFormProps> = ({ isOpen, onClose, onSubmit, venues, eventToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    
    const [baseDate, setBaseDate] = useState('');
    
    const [foodType, setFoodType] = useState<FoodType>('MEALS');
    // FIX: Changed state to use the specific DietaryTag type instead of a generic string.
    const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
    const [accessLevel, setAccessLevel] = useState<AccessLevel>('WALK_IN');
    const [cost, setCost] = useState('Gratis');
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('NEEDS_VERIFICATION');
    const [sourceUrl, setSourceUrl] = useState('');
    
    const [deadlineDaysBefore, setDeadlineDaysBefore] = useState('1');
    const [deadlineTime, setDeadlineTime] = useState('11:00');
    
    const [venueOption, setVenueOption] = useState('existing');
    const [selectedVenueId, setSelectedVenueId] = useState<string>('');
    const [newVenue, setNewVenue] = useState(initialNewVenueState);
    
    const [recurrence, setRecurrence] = useState<RecurrenceRule>(initialRecurrenceState);
    const [monthlyRecurrenceType, setMonthlyRecurrenceType] = useState<'date' | 'day'>('date');
    const [registrationInfo, setRegistrationInfo] = useState(initialRegistrationInfoState);

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
        setDeadlineDaysBefore('1');
        setDeadlineTime('11:00');
        setRegistrationInfo(initialRegistrationInfoState);
        setVenueOption('existing');
        setSelectedVenueId(venues.length > 0 ? venues[0].id : '');
        setNewVenue(initialNewVenueState);
        setRecurrence({ frequency: 'WEEKLY', daysOfWeek: [(now.getDay() === 0 ? 0 : now.getDay()) as DayOfWeek] });
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

                if (eventToEdit.registrationDeadline && !(eventToEdit.registrationDeadline instanceof Date)) {
                    const rule = eventToEdit.registrationDeadline as RecurrenceDeadline;
                    setDeadlineDaysBefore(String(rule.daysBefore));
                    setDeadlineTime(rule.time);
                } else {
                    setDeadlineDaysBefore('1');
                    setDeadlineTime('11:00');
                }

                setRegistrationInfo(eventToEdit.registrationInfo ? { ...eventToEdit.registrationInfo, notes: eventToEdit.registrationInfo.notes || '' } : initialRegistrationInfoState);
                setVenueOption('existing');
                setSelectedVenueId(eventToEdit.venueId);
                setNewVenue(initialNewVenueState);

                const recurrenceToSet = { ...(eventToEdit.recurrence || { frequency: 'NONE' as const }) };
                if (recurrenceToSet.frequency === 'WEEKLY' && recurrenceToSet.dayOfWeek !== undefined && !recurrenceToSet.daysOfWeek) {
                    recurrenceToSet.daysOfWeek = [recurrenceToSet.dayOfWeek];
                    delete (recurrenceToSet as Partial<typeof recurrenceToSet>).dayOfWeek;
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
        
        // FIX: Replaced object property deletion with type-safe object construction
        // to prevent invalid properties from being included in the final object based on the selected recurrence frequency. This resolves multiple TypeScript errors related to discriminated unions.
        let finalRecurrence: RecurrenceRule;
        switch (recurrence.frequency) {
            case 'WEEKLY':
                finalRecurrence = {
                    frequency: 'WEEKLY',
                    daysOfWeek: recurrence.daysOfWeek,
                };
                break;
            case 'BIWEEKLY':
                finalRecurrence = {
                    frequency: 'BIWEEKLY',
                    dayOfWeek: recurrence.dayOfWeek,
                };
                break;
            case 'MONTHLY':
                if (monthlyRecurrenceType === 'date') {
                    finalRecurrence = {
                        frequency: 'MONTHLY',
                        monthDay: recurrence.monthDay,
                    };
                } else {
                    finalRecurrence = {
                        frequency: 'MONTHLY',
                        weeksOfMonth: recurrence.weeksOfMonth,
                        dayOfWeek: recurrence.dayOfWeek,
                    };
                }
                break;
            default:
                finalRecurrence = { frequency: 'NONE' };
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
            registrationDeadline: deadlineDaysBefore && deadlineTime && accessLevel === 'REGISTRATION'
                ? { daysBefore: parseInt(deadlineDaysBefore, 10), time: deadlineTime }
                : undefined,
            registrationInfo: registrationInfo.value ? {
                type: registrationInfo.type,
                value: registrationInfo.value,
                notes: registrationInfo.notes || undefined,
            } : undefined,
            venueId: venueOption === 'existing' ? selectedVenueId : undefined,
            newVenue: venueOption === 'new' ? newVenue : undefined,
            recurrence: finalRecurrence,
        };
        
        onSubmit(submissionData);
    };

    // FIX: Changed handler to accept the specific DietaryTag type.
    const handleDietaryTagChange = (tag: DietaryTag) => {
        setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    // FIX: Rewrote handleFrequencyChange to be type-safe by constructing a valid RecurrenceRule object for each frequency type. This resolves multiple type errors related to discriminated unions.
    const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFrequency = e.target.value as RecurrenceRule['frequency'];
        const date = new Date(baseDate + 'T12:00:00Z');
        const dayOfWeek = (date.getUTCDay() === 0 ? 0 : date.getUTCDay()) as DayOfWeek;
        const monthDay = date.getUTCDate();

        let newRecurrence: RecurrenceRule;

        switch (newFrequency) {
            case 'WEEKLY':
                newRecurrence = {
                    frequency: 'WEEKLY',
                    daysOfWeek: (recurrence.frequency === 'WEEKLY' && recurrence.daysOfWeek) ? recurrence.daysOfWeek : [dayOfWeek]
                };
                break;
            case 'BIWEEKLY':
                newRecurrence = {
                    frequency: 'BIWEEKLY',
                    dayOfWeek: dayOfWeek
                };
                break;
            case 'MONTHLY':
                newRecurrence = {
                    frequency: 'MONTHLY',
                    monthDay: monthDay
                };
                setMonthlyRecurrenceType('date');
                break;
            case 'NONE':
            default:
                 newRecurrence = { frequency: 'NONE' };
                 break;
        }

        setRecurrence(newRecurrence);
    };

    const handleDayOfWeekChange = (day: DayOfWeek) => {
        if (recurrence.frequency === 'WEEKLY') {
            const currentDays = recurrence.daysOfWeek || [];
            const newDays = currentDays.includes(day)
                ? currentDays.filter(d => d !== day)
                : [...currentDays, day].sort((a,b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
            setRecurrence({ ...recurrence, daysOfWeek: newDays });
        }
    };

    const handleWeeksOfMonthChange = (week: WeekOfMonth) => {
        if (recurrence.frequency === 'MONTHLY') {
            const currentWeeks = recurrence.weeksOfMonth || [];
            const newWeeks = currentWeeks.includes(week)
                ? currentWeeks.filter(w => w !== week)
                : [...currentWeeks, week];
            setRecurrence({ ...recurrence, weeksOfMonth: newWeeks });
        }
    };


    const resetAndClose = () => {
        onClose();
    };
    
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white text-text-primary border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent sm:text-sm transition-colors";
    const labelClasses = "block text-sm font-medium text-text-secondary";
    const selectClasses = `${inputClasses} appearance-none bg-no-repeat bg-right-2.5`;
    const selectStyle = { backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23717171' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.25em 1.25em'};

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 md:p-8 border-b border-border-color">
                     <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold text-text-primary">{isEditMode ? 'Evenement Bewerken' : 'Nieuw Evenement'}</h2>
                        <button type="button" onClick={resetAndClose} className="text-text-secondary hover:text-text-primary transition-colors p-1 -mt-1 -mr-1 rounded-full hover:bg-surface">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 md:p-8 space-y-6 overflow-y-auto">
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>}
                    
                    <fieldset className="space-y-4">
                        <div>
                            <label htmlFor="title" className={labelClasses}>Titel *</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="description" className={labelClasses}>Beschrijving</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputClasses}></textarea>
                        </div>
                    </fieldset>
                    
                    <fieldset className="space-y-4 pt-6 border-t border-border-color">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <label htmlFor="baseDate" className={labelClasses}>Datum (voor herhaling) *</label>
                                <input type="date" id="baseDate" value={baseDate} onChange={e => setBaseDate(e.target.value)} className={inputClasses} required />
                            </div>
                            <div>
                                <label className={labelClasses}>Tijd *</label>
                                <div className="flex items-center gap-2">
                                    <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputClasses} required aria-label="Starttijd"/>
                                    <span className="text-text-secondary">-</span>
                                    <input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputClasses} required aria-label="Eindtijd"/>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="recurrence" className={labelClasses}>Herhaling</label>
                             <select id="recurrence" value={recurrence.frequency} onChange={handleFrequencyChange} className={selectClasses} style={selectStyle}>
                                <option value="NONE">Niet herhalend</option>
                                <option value="WEEKLY">Wekelijks</option>
                                <option value="BIWEEKLY">Elke 2 weken</option>
                                <option value="MONTHLY">Maandelijks</option>
                            </select>
                        </div>
                        
                        {recurrence.frequency === 'WEEKLY' && (
                             <div className="pl-4">
                                <label className={labelClasses}>Dagen van de week</label>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-2">
                                    {dayOfWeekOptions.map(opt => (
                                        <label key={opt.value} className="flex flex-col items-center p-2 border border-border-color rounded-md cursor-pointer transition-colors has-[:checked]:bg-accent/10 has-[:checked]:border-accent">
                                            <span className="text-sm font-medium text-text-primary">{opt.label}</span>
                                            <input 
                                                type="checkbox" 
                                                checked={recurrence.daysOfWeek?.includes(opt.value)} 
                                                onChange={() => handleDayOfWeekChange(opt.value)}
                                                className="sr-only"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {recurrence.frequency === 'MONTHLY' && (
                             <div className="pl-4 space-y-4">
                                <div>
                                    <label className={labelClasses}>Maandelijkse herhaling op basis van:</label>
                                    <div className="flex gap-4 mt-2">
                                         <label className="flex items-center"><input type="radio" value="date" checked={monthlyRecurrenceType === 'date'} onChange={() => setMonthlyRecurrenceType('date')} className="form-radio h-4 w-4 text-accent focus:ring-accent mr-2"/> Datum</label>
                                         <label className="flex items-center"><input type="radio" value="day" checked={monthlyRecurrenceType === 'day'} onChange={() => setMonthlyRecurrenceType('day')} className="form-radio h-4 w-4 text-accent focus:ring-accent mr-2"/> Dag van de week</label>
                                    </div>
                                </div>
                                {monthlyRecurrenceType === 'day' && (
                                    <div>
                                        <label className={labelClasses}>Week van de maand</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                            {weekOfMonthOptions.map(opt => (
                                                <label key={opt.value} className="flex items-center text-sm p-2 border border-border-color rounded-md has-[:checked]:bg-accent/10 has-[:checked]:border-accent">
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
                    </fieldset>

                    <fieldset className="space-y-4 pt-6 border-t border-border-color">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <label htmlFor="foodType" className={labelClasses}>Type Event</label>
                                <select id="foodType" value={foodType} onChange={e => setFoodType(e.target.value as FoodType)} className={selectClasses} style={selectStyle}>
                                    <option value="MEALS">Maaltijden</option>
                                    <option value="PACKAGES">Pakketten</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="accessLevel" className={labelClasses}>Toegang</label>
                                <select id="accessLevel" value={accessLevel} onChange={e => setAccessLevel(e.target.value as AccessLevel)} className={selectClasses} style={selectStyle}>
                                    <option value="WALK_IN">Vrije inloop</option>
                                    <option value="REGISTRATION">Registratie vereist</option>
                                    <option value="REFERRAL">Verwijzing nodig</option>
                                </select>
                            </div>
                        </div>

                        {accessLevel === 'REGISTRATION' && (
                           <div className="pl-4 border-l-2 border-accent/50 space-y-4">
                                <div>
                                    <label className={labelClasses}>Aanmelddeadline</label>
                                    <div className="flex items-center gap-2">
                                        <input type="number" value={deadlineDaysBefore} onChange={e => setDeadlineDaysBefore(e.target.value)} className={inputClasses} aria-label="Dagen van tevoren" min="0"/>
                                        <span className="text-text-secondary text-sm">dagen van tevoren om</span>
                                        <input type="time" value={deadlineTime} onChange={e => setDeadlineTime(e.target.value)} className={inputClasses} aria-label="Aanmelddeadline tijd"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div>
                                        <label htmlFor="regInfoType" className={labelClasses}>Type aanmelding</label>
                                        <select id="regInfoType" value={registrationInfo.type} onChange={e => setRegistrationInfo(prev => ({...prev, type: e.target.value as RegistrationInfo['type'], value: ''}))} className={selectClasses} style={selectStyle}>
                                            <option value="URL">Website link</option>
                                            <option value="EMAIL">E-mailadres</option>
                                            <option value="PHONE">Telefoonnummer</option>
                                            <option value="TEXT">Alleen instructies</option>
                                        </select>
                                    </div>
                                    {registrationInfo.type !== 'TEXT' && (
                                        <div>
                                            <label htmlFor="regInfoValue" className={labelClasses}>Link / E-mail / Telefoon</label>
                                            <input 
                                                type={registrationInfo.type === 'URL' ? 'url' : registrationInfo.type === 'EMAIL' ? 'email' : 'tel'} 
                                                id="regInfoValue" 
                                                value={registrationInfo.value}
                                                onChange={e => setRegistrationInfo(prev => ({...prev, value: e.target.value}))}
                                                placeholder={registrationInfo.type === 'URL' ? 'https://...' : ''}
                                                className={inputClasses} 
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="regInfoNotes" className={labelClasses}>Extra instructies (optioneel)</label>
                                    <textarea 
                                        id="regInfoNotes" 
                                        rows={2} 
                                        value={registrationInfo.notes} 
                                        onChange={e => setRegistrationInfo(prev => ({...prev, notes: e.target.value}))} 
                                        className={inputClasses}
                                        placeholder="Bijv. bellen tussen 9 en 5"
                                    ></textarea>
                                </div>
                           </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                                {dietOptions.map(tag => (
                                    <label key={tag} className="flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            checked={dietaryTags.includes(tag)}
                                            onChange={() => handleDietaryTagChange(tag)}
                                            className="form-checkbox h-4 w-4 rounded text-accent focus:ring-accent"
                                        />
                                        <span className="ml-2 capitalize text-text-primary">{translateDietaryTag(tag)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="verificationStatus" className={labelClasses}>Status</label>
                             <select id="verificationStatus" value={verificationStatus} onChange={e => setVerificationStatus(e.target.value as VerificationStatus)} className={selectClasses} style={selectStyle}>
                                <option value="NEEDS_VERIFICATION">Concept</option>
                                <option value="VERIFIED">Gepubliceerd</option>
                            </select>
                        </div>
                    </fieldset>
                    
                    <fieldset className="pt-6 border-t border-border-color">
                        <legend className={labelClasses}>Locatie *</legend>
                        <div className="mt-2 space-y-4">
                            <label className="flex items-center">
                                <input type="radio" name="venueOption" value="existing" checked={venueOption === 'existing'} onChange={() => setVenueOption('existing')} className="form-radio h-4 w-4 text-accent focus:ring-accent" />
                                <span className="ml-2 text-sm text-text-primary">Bestaande locatie</span>
                            </label>
                            {venueOption === 'existing' && (
                                <select value={selectedVenueId} onChange={e => setSelectedVenueId(e.target.value)} className={`${selectClasses} ml-6 max-w-sm`} style={selectStyle}>
                                    {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            )}
                            <label className="flex items-center">
                                <input type="radio" name="venueOption" value="new" checked={venueOption === 'new'} onChange={() => setVenueOption('new')} className="form-radio h-4 w-4 text-accent focus:ring-accent" />
                                <span className="ml-2 text-sm text-text-primary">Nieuwe locatie toevoegen</span>
                            </label>
                            {venueOption === 'new' && (
                                <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <input type="text" placeholder="Naam *" value={newVenue.name} onChange={e => setNewVenue(v => ({...v, name: e.target.value}))} className={inputClasses} />
                                    <input type="text" placeholder="Adres *" value={newVenue.address} onChange={e => setNewVenue(v => ({...v, address: e.target.value}))} className={inputClasses} />
                                    <input type="url" placeholder="Logo URL" value={newVenue.logoUrl} onChange={e => setNewVenue(v => ({...v, logoUrl: e.target.value}))} className={inputClasses} />
                                    <select value={newVenue.category} onChange={e => setNewVenue(v => ({...v, category: e.target.value as VenueCategory}))} className={selectClasses} style={selectStyle}>
                                      <option value="COMMUNITY">{translateVenueCategory('COMMUNITY')}</option>
                                      <option value="RELIGIOUS">{translateVenueCategory('RELIGIOUS')}</option>
                                      <option value="FOOD_BANK">{translateVenueCategory('FOOD_BANK')}</option>
                                      <option value="COMMERCIAL">{translateVenueCategory('COMMERCIAL')}</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </fieldset>
                </form>

                 <div className="p-6 md:p-8 border-t border-border-color bg-surface/50 rounded-b-lg">
                    <div className="flex justify-end items-center space-x-4">
                        <button type="button" onClick={resetAndClose} className="px-4 py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-colors">
                            Annuleren
                        </button>
                        <button type="button" onClick={handleSubmit} className="px-6 py-2 text-sm font-medium rounded-md border border-transparent text-white bg-accent hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                            {isEditMode ? 'Wijzigingen Opslaan' : 'Evenement Opslaan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};