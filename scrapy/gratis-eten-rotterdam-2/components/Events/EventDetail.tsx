
import React, { useState, useEffect } from 'react';
import type { FoodEvent, AccessLevel, Venue, VenueCategory, RegistrationInfo, RecurrenceDeadline } from '../../types';
import { formatTime } from '../../utils/time';
import { formatRecurrenceRule } from '../../utils/recurrence';
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

const categoryStyles: Record<VenueCategory, { bg: string, text: string }> = {
  RELIGIOUS: { bg: 'bg-red-100', text: 'text-red-800' },
  COMMUNITY: { bg: 'bg-green-100', text: 'text-green-800' },
  FOOD_BANK: { bg: 'bg-blue-100', text: 'text-blue-800' },
  COMMERCIAL: { bg: 'bg-purple-100', text: 'text-purple-800' },
};

// --- Icon Components ---
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>;
const RecurrenceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5" /></svg>;
const CostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" /></svg>;
const PinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const SaladIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

// --- Helper Components ---

const InitialsFallback: React.FC<{ name: string; category: VenueCategory; className?: string }> = ({ name, category, className = '' }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const { bg, text } = categoryStyles[category] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
        <div className={`w-full h-full rounded-lg flex items-center justify-center ${bg} ${text} font-bold ${className}`}>
            {initials}
        </div>
    );
};

const VenueLogo: React.FC<{ venue: Venue; className: string; textClassName?: string; }> = ({ venue, className, textClassName }) => {
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        setLogoError(false);
    }, [venue.logoUrl]);

    if (venue.logoUrl && !logoError) {
        return <img src={venue.logoUrl} alt={`${venue.name} logo`} className={className} onError={() => setLogoError(true)} />;
    }
    
    return (
        <div className={className}> 
            <InitialsFallback name={venue.name} category={venue.category} className={textClassName}/>
        </div>
    );
};

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 text-text-secondary mt-1">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-text-primary">{label}</p>
      <div className="text-sm text-text-secondary">{children}</div>
    </div>
  </div>
);

const RegistrationAction: React.FC<{
    registrationInfo?: RegistrationInfo;
    registrationDeadline?: Date;
}> = ({ registrationInfo, registrationDeadline }) => {
    const now = new Date();
    const deadlinePassed = registrationDeadline && registrationDeadline < now;

    let icon: React.ReactNode;
    let href: string | undefined;
    let buttonText = "Nu Aanmelden";
    let actionType: 'link' | 'disabled' = 'link';

    if (deadlinePassed) {
        actionType = 'disabled';
        buttonText = "Aanmelden gesloten";
        icon = <CalendarIcon />;
    } else if (!registrationInfo?.value) {
        actionType = 'disabled';
        buttonText = "Aanmelden niet mogelijk";
        icon = <CalendarIcon />;
    } else {
        switch (registrationInfo.type) {
            case 'URL':
                icon = <LinkIcon />;
                href = registrationInfo.value;
                break;
            case 'EMAIL':
                icon = <EmailIcon />;
                href = `mailto:${registrationInfo.value}`;
                break;
            case 'PHONE':
                icon = <PhoneIcon />;
                href = `tel:${registrationInfo.value}`;
                break;
            case 'TEXT':
            default:
                actionType = 'disabled';
                buttonText = "Zie instructies";
                icon = <CalendarIcon />;
                break;
        }
    }

    const ButtonComponent = actionType === 'link' ? 'a' : 'button';

    return (
        <ButtonComponent
            href={href}
            target={registrationInfo?.type === 'URL' ? '_blank' : undefined}
            rel="noopener noreferrer"
            disabled={actionType === 'disabled'}
            aria-label={buttonText}
            className="w-12 h-12 flex items-center justify-center bg-accent text-white rounded-lg transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            {icon}
        </ButtonComponent>
    );
};


// --- Main Component ---

interface EventDetailProps {
  event: FoodEvent;
  onClose: () => void;
  isAdmin: boolean;
  onEdit: (event: FoodEvent) => void;
  onDelete: (eventId: string) => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onClose, isAdmin, onEdit, onDelete }) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue.address)}`;
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 flex items-start gap-4">
            <VenueLogo venue={event.venue} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-sm flex-shrink-0" textClassName="text-lg sm:text-xl"/>
            <div className="flex-grow">
                <div className="flex items-center gap-3">
                   <h2 className="text-xl sm:text-2xl font-bold text-text-primary leading-tight">{event.title}</h2>
                   {event.verificationStatus === 'NEEDS_VERIFICATION' && (
                      <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full whitespace-nowrap">Concept</span>
                   )}
                </div>
                <p className="text-base sm:text-lg text-text-secondary mt-1">{event.venue.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors p-1 -mt-1 -mr-1 rounded-full hover:bg-surface"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6 border-t border-border-color pt-4 sm:pt-6 overflow-y-auto">
            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 bg-surface p-4 rounded-lg">
                <DetailItem icon={<ClockIcon />} label="Tijd">{`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</DetailItem>
                <DetailItem icon={<AccessIcon />} label="Toegang">{translateAccessLevel(event.accessLevel)}</DetailItem>
                {event.recurrence && event.recurrence.frequency !== 'NONE' && (
                    <DetailItem icon={<RecurrenceIcon />} label="Herhaling">{formatRecurrenceRule(event.recurrence)}</DetailItem>
                )}
                <DetailItem icon={<CostIcon />} label="Kosten">{event.cost || 'Onbekend'}</DetailItem>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Beschrijving</h3>
              <p className="text-text-secondary whitespace-pre-wrap">{event.description || 'Geen beschrijving beschikbaar.'}</p>
            </div>

            {/* Other Details */}
            <div className="border-t border-border-color pt-4 sm:pt-6">
                <div className="grid grid-cols-2 gap-y-4 md:gap-y-6 gap-x-4 sm:gap-x-6">
                    <div className="col-span-2">
                        <DetailItem icon={<PinIcon />} label="Adres">{`${event.venue.address}, ${event.venue.city}`}</DetailItem>
                    </div>
                    
                    {event.dietaryTags.length > 0 && (
                        <div className="col-span-2">
                            <DetailItem icon={<SaladIcon />} label="Dieet">
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {event.dietaryTags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">{translateDietaryTag(tag)}</span>
                                  ))}
                                </div>
                            </DetailItem>
                        </div>
                    )}

                    {event.sourceUrl && (
                        <div>
                            <DetailItem icon={<LinkIcon />} label="Bron">
                                <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                                  Bekijk originele bron
                                </a>
                            </DetailItem>
                        </div>
                    )}
                    
                    {event.accessLevel === 'REGISTRATION' && (
                        <div>
                            <DetailItem icon={<CalendarIcon />} label="Aanmelden">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-grow">
                                        {event.registrationDeadline instanceof Date && (
                                            <div className="mb-2">
                                                <CountdownTimer deadline={event.registrationDeadline} />
                                            </div>
                                        )}
                                        {event.registrationInfo?.notes && (
                                            <p className="text-text-secondary text-sm italic">{event.registrationInfo.notes}</p>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0">
                                        <RegistrationAction 
                                            registrationInfo={event.registrationInfo} 
                                            registrationDeadline={event.registrationDeadline instanceof Date ? event.registrationDeadline : undefined} 
                                        />
                                    </div>
                                </div>
                            </DetailItem>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 bg-surface/80 border-t border-border-color rounded-b-lg mt-auto">
          <div className="flex items-center space-x-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow bg-accent text-white flex items-center justify-center font-bold h-12 rounded-lg hover:bg-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              <span>Navigeer</span>
            </a>
            {isAdmin && (
              <>
                <button
                  onClick={() => onEdit(event)}
                  aria-label="Bewerken"
                  className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
                  aria-label="Verwijderen"
                  className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
