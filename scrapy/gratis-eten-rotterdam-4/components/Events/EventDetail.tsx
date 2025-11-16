import React from 'react';
import type { FoodEvent, AccessLevel, Venue, VenueCategory, RegistrationInfo, RecurrenceDeadline, RecurrenceRule, DayOfWeek } from '../../types';
import { formatTime } from '../../utils/time';
import { formatRecurrenceRule, generateOccurrences } from '../../utils/recurrence';
import { CountdownTimer } from './CountdownTimer';

// --- Helper Functions ---
const translateAccessLevel = (level: AccessLevel): string => {
    switch (level) {
        case 'WALK_IN': return 'Vrije inloop';
        case 'REGISTRATION': return 'Registratie vereist';
        case 'REFERRAL': return 'Verwijzing nodig';
        default: return level;
    }
};

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

// --- Icon Components (simplified for brevity) ---
const ClockIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const PinIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const InfoIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const CalendarIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const LinkIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>;
const TagIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A1 1 0 012 10V5a1 1 0 011-1h5a1 1 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const UserGroupIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>;
const RepeatIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>;
const EditIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

const ExternalLinkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const ModalIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 6.75h4.5m-4.5 10.5h4.5m-7.5-5.25h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const PanelIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="15" y1="3" x2="15" y2="21"></line>
    </svg>
);

// --- Registration-specific Icons ---
const TargetIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12h.01M12 12h.01M9 12h.01M12 9v.01M12 15v.01" /></svg>;
const EmailIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const PhoneIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;


// --- Sub-components ---
const MetadataItem: React.FC<{
    icon: React.ReactNode;
    primary: React.ReactNode;
    secondary?: React.ReactNode;
}> = ({ icon, primary, secondary }) => (
    <div className="flex items-start text-sm">
        <div className="w-5 h-5 mr-4 text-text-secondary flex-shrink-0">{icon}</div>
        <div>
            <p className="font-semibold text-text-primary">{primary}</p>
            {secondary && <div className="text-text-secondary">{secondary}</div>}
        </div>
    </div>
);


const DetailSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string; showStatusDot?: boolean; }> = ({ title, icon, children, className = '', showStatusDot = false }) => (
    <div className={`pt-4 mt-4 ${className}`}>
        <div className="flex items-center text-text-secondary mb-3 relative">
            {showStatusDot && (
                <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"
                    title="Aanmelding voor huidige selectie is gesloten"
                ></div>
            )}
            <div className="w-5 h-5 mr-3">{icon}</div>
            <h3 className="font-semibold text-sm uppercase tracking-wider">{title}</h3>
        </div>
        <div className="pl-8">{children}</div>
    </div>
);

const RegistrationButton: React.FC<{ info: RegistrationInfo }> = ({ info }) => {
    const getLink = (): string | undefined => {
        switch (info.type) {
            case 'URL': return info.value;
            case 'EMAIL': return `mailto:${info.value}`;
            case 'PHONE': return `tel:${info.value}`;
            default: return undefined;
        }
    };

    const getIcon = (): React.ReactNode => {
        switch (info.type) {
            case 'URL': return <TargetIcon />;
            case 'EMAIL': return <EmailIcon />;
            case 'PHONE': return <PhoneIcon />;
            default: return <InfoIcon />;
        }
    };
    
    const link = getLink();
    const icon = getIcon();

    if (!link && !info.notes) return null;

    if (!link) {
        return (
            <div className="relative group flex-shrink-0 ml-auto w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-text-secondary cursor-default" title={info.notes}>
                {icon}
            </div>
        );
    }
    
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 ml-auto w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-accent hover:bg-red-100 transition-colors"
            title={info.notes || 'Aanmelden'}
        >
            {icon}
        </a>
    );
};

const RegistrationSection: React.FC<{ event: FoodEvent, baseEvent?: FoodEvent }> = ({ event, baseEvent }) => {
    // This status is for the *currently selected* event instance.
    const isCurrentDeadlinePassed = event.registrationDeadline instanceof Date && event.registrationDeadline < new Date();
    
    // The source for static info like title and registration method is always the base event.
    const infoSource = baseEvent || event;
    if (infoSource.accessLevel !== 'REGISTRATION' && infoSource.accessLevel !== 'REFERRAL') {
        return null;
    }

    const [deadlineForDisplay, setDeadlineForDisplay] = React.useState<Date | null>(null);

    // Find the next available registration deadline to display.
    React.useEffect(() => {
        let nextDeadline: Date | null = null;
        const now = new Date();
        
        if (baseEvent) { // For recurring events, find the next upcoming one.
            const windowEnd = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90-day window
            const occurrences = generateOccurrences(baseEvent, now, windowEnd);
            const nextUpcomingEvent = occurrences.find(o => o.registrationDeadline instanceof Date && o.registrationDeadline > now);
            if (nextUpcomingEvent && nextUpcomingEvent.registrationDeadline instanceof Date) {
                nextDeadline = nextUpcomingEvent.registrationDeadline;
            }
        } else if (event.registrationDeadline instanceof Date && event.registrationDeadline > now) {
            // For non-recurring events that are still open.
            nextDeadline = event.registrationDeadline;
        }
        setDeadlineForDisplay(nextDeadline);
    }, [baseEvent, event]);
    
    const title = infoSource.accessLevel === 'REFERRAL' ? 'Verwijzing' : 'Aanmelden';

    return (
        <DetailSection 
            title={title} 
            icon={<CalendarIcon />} 
            className="border-t border-border-color"
            showStatusDot={isCurrentDeadlinePassed}
        >
            {deadlineForDisplay instanceof Date ? (
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                         <div className="relative flex items-center justify-center w-2.5 h-2.5" title="Aanmelden is open">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></div>
                         </div>
                         <p className="text-sm font-semibold text-text-primary whitespace-nowrap">
                            {deadlineForDisplay.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\.$/, '')}
                         </p>
                    </div>
                    <CountdownTimer deadline={deadlineForDisplay} />
                    {infoSource.registrationInfo && <RegistrationButton info={infoSource.registrationInfo} />}
                </div>
            ) : (
                <p className="text-sm text-text-secondary">
                    {infoSource.registrationInfo?.notes || "Er is geen volgende aanmelddatum bekend."}
                </p>
            )}
        </DetailSection>
    );
};


const NextOccurrence: React.FC<{ baseEvent: FoodEvent }> = ({ baseEvent }) => {
    if (!baseEvent.recurrence || baseEvent.recurrence.frequency === 'NONE') return null;

    const [nextDate, setNextDate] = React.useState<Date | null>(null);

    React.useEffect(() => {
        const now = new Date();
        const windowEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        const occurrences = generateOccurrences(baseEvent, now, windowEnd);
        const upcoming = occurrences
            .filter(o => o.startTime > now)
            .slice(0, 1) // Only show the very next one
            .map(o => o.startTime);
        setNextDate(upcoming.length > 0 ? upcoming[0] : null);
    }, [baseEvent]);

    if (!nextDate) return null;

    const formattedNextDate = nextDate.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\.$/, '');

    return (
        <MetadataItem
            icon={<RepeatIcon />}
            primary="Volgende"
            secondary={formattedNextDate}
        />
    );
};

// --- Main Component ---
interface EventDetailProps {
    event: FoodEvent;
    onClose: () => void;
    isAdmin: boolean;
    onEdit: (event: FoodEvent) => void;
    onDelete: (eventId: string) => void;
    getBaseEventById: (id: string) => FoodEvent | undefined;
    mode: 'panel' | 'modal';
    setMode: (mode: 'panel' | 'modal') => void;
    currentTime: Date;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onClose, isAdmin, onEdit, onDelete, getBaseEventById, mode, setMode, currentTime }) => {
    const { venue } = event;
    const formattedDate = event.startTime.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\.$/, '');
    const isRecurring = event.recurrence && event.recurrence.frequency !== 'NONE';
    const [descriptionExpanded, setDescriptionExpanded] = React.useState(false);
    const isPast = event.endTime < currentTime;

    // If it's an occurrence, get the base event for recurrence info etc.
    const baseEventId = event.id.split('-occurrence-')[0];
    const baseEvent = isRecurring ? getBaseEventById(baseEventId) : event;
    
    const hasRegistration = event.accessLevel === 'REGISTRATION' || event.accessLevel === 'REFERRAL';

    const isPanel = mode === 'panel';
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Match animation duration
    };

    const handleEdit = () => {
        if (baseEvent) {
            onEdit(baseEvent);
        }
    };
    
    const handleDelete = () => {
        if (baseEvent) {
            onDelete(baseEvent.id);
        }
    };

    const showReadMore = event.description && (event.description.split('\n').length > 3 || event.description.length > 150);

    const backdropClasses = `fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isVisible ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`;
    const positionerClasses = `fixed inset-0 z-50 flex justify-center items-end md:items-center ${isPanel ? 'md:justify-end' : 'md:justify-center'} md:p-4`;

    const baseMobileClasses = 'bg-white shadow-2xl flex flex-col w-full rounded-t-2xl max-h-[90vh] md:max-w-md md:rounded-2xl';
    const mobileAnimationClasses = `transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`;
    let desktopClasses = `md:transform-none md:transition-all`;

    if (isPanel) {
        desktopClasses += ` md:h-full md:w-96 lg:w-[450px] md:rounded-none ${isVisible ? 'md:translate-x-0' : 'md:translate-x-full'}`;
    } else {
        desktopClasses += ` md:max-h-[90vh] ${isVisible ? 'md:scale-100 md:opacity-100' : 'md:scale-95 md:opacity-0'}`;
    }
    const contentClasses = `${baseMobileClasses} ${mobileAnimationClasses} ${desktopClasses}`;

    return (
        <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-detail-title"
            className="fixed inset-0 z-40"
        >
            <div className={backdropClasses} onClick={handleClose} />
            
            <div className={positionerClasses}>
                <div className={contentClasses} onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b border-border-color flex-shrink-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`text-sm font-semibold uppercase tracking-wide ${isPast ? 'text-text-secondary' : 'text-accent'}`}>{venue.name}</p>
                                <h2 id="event-detail-title" className={`text-2xl font-bold text-text-primary mt-1 ${isPast ? 'text-text-secondary' : 'text-text-primary'}`}>{event.title}</h2>
                            </div>
                            <div className="flex items-center gap-2 -mr-2 -mt-1">
                                <button
                                    onClick={() => setMode(isPanel ? 'modal' : 'panel')}
                                    className="hidden md:block p-1 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors"
                                    aria-label={isPanel ? 'Toon als overlay' : 'Toon als zijpaneel'}
                                >
                                    {isPanel ? <ModalIcon /> : <PanelIcon />}
                                </button>
                                <button onClick={handleClose} className="p-1 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors" aria-label="Sluiten">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-4 sm:p-6 flex-grow overflow-y-auto">
                        <div className="bg-surface rounded-lg p-4 grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
                            <MetadataItem
                                icon={<ClockIcon />}
                                primary={formattedDate}
                                secondary={`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                            />
                             <MetadataItem
                                icon={<UserGroupIcon />}
                                primary={translateAccessLevel(event.accessLevel)}
                                secondary={event.cost}
                            />
                            {event.sourceUrl && (
                                <MetadataItem
                                    icon={<LinkIcon />}
                                    primary="Bron"
                                    secondary={
                                        <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary hover:underline">
                                            Website <ExternalLinkIcon />
                                        </a>
                                    }
                                />
                            )}
                            {baseEvent && <NextOccurrence baseEvent={baseEvent} />}
                        </div>
                        
                        {event.description && (
                            <DetailSection title="Over dit evenement" icon={<InfoIcon />} className="border-t border-border-color">
                                <p className={`text-text-primary whitespace-pre-wrap text-sm ${!descriptionExpanded ? 'line-clamp-3' : ''}`}>{event.description}</p>
                                {showReadMore && (
                                     <button onClick={() => setDescriptionExpanded(!descriptionExpanded)} className="text-accent font-semibold text-sm hover:underline mt-1">
                                        {descriptionExpanded ? 'Lees minder' : 'Lees meer'}
                                    </button>
                                )}
                            </DetailSection>
                        )}

                        {hasRegistration && <RegistrationSection event={event} baseEvent={baseEvent} />}

                        {event.dietaryTags.length > 0 && (
                            <DetailSection title="Dieet" icon={<TagIcon />} className="border-t border-border-color">
                                <div className="flex flex-wrap gap-2">
                                    {event.dietaryTags.map(tag => (
                                        <span key={tag} className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                            {translateDietaryTag(tag)}
                                        </span>
                                    ))}
                                </div>
                            </DetailSection>
                        )}
                        
                    </div>
                    
                    <div className="p-4 sm:p-6 bg-surface/50 border-t border-border-color flex-shrink-0">
                        <div className="flex justify-between items-center gap-3">
                             {isAdmin && baseEvent ? (
                                <div className="flex gap-2">
                                    <button onClick={handleDelete} className="p-2 text-text-secondary rounded-full hover:bg-red-50 hover:text-accent transition-colors" aria-label="Verwijderen">
                                        <DeleteIcon />
                                    </button>
                                    <button onClick={handleEdit} className="p-2 text-text-secondary rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors" aria-label="Bewerken">
                                        <EditIcon />
                                    </button>
                                </div>
                            ) : ( <div /> )}

                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-6 py-2.5 text-sm font-bold rounded-full text-white bg-accent hover:bg-red-600 transition-colors flex-grow sm:flex-grow-0 text-center"
                            >
                                Routebeschrijving
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};