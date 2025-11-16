import React from 'react';
import type { FoodEvent, AccessLevel, VenueWithDistance } from '../../types';
import { formatTime } from '../../utils/time';

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

interface EventListItemProps {
    event: FoodEvent;
    onEventClick: (event: FoodEvent) => void;
}

// --- Icon Components ---

const PinIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const ClockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
);

const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 8.25a.75.75 0 000 1.5h11a.75.75 0 000-1.5h-11z" clipRule="evenodd" />
    </svg>
);


const AccessLevelIcon: React.FC<{ level: AccessLevel }> = ({ level }) => {
    switch (level) {
        case 'WALK_IN':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
        case 'REGISTRATION':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
        case 'REFERRAL':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
        default: return null;
    }
};

const CostIcon: React.FC<{ cost: string }> = ({ cost }) => {
    if (cost.toLowerCase() === 'gratis') {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v-2m0 2v.01M12 12a2 2 0 100 4 2 2 0 000-4zm0 0H9.571m2.429 0H12m0 0H9.571m2.429 0A2.5 2.5 0 0112 14.5m0 0V12m0 2.5a2.5 2.5 0 01-2.5-2.5M12 14.5A2.5 2.5 0 0014.5 12m0 0h2.429" /></svg>;
};

const DietaryIcon: React.FC<{ tag: string }> = ({ tag }) => {
    switch (tag) {
        case 'vegetarian':
        case 'vegan':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477A2 2 0 005.21 6.05l2.387.477a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387-.477a2 2 0 001.806-.547 2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86L18.79 4.21a2 2 0 00-1.806-.547 2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.022-.547z" /></svg>;
        case 'halal':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>;
        default: return null;
    }
};

// --- Main Components ---

const Tag: React.FC<{
    icon: React.ReactNode;
    label: string;
    className?: string;
}> = ({ icon, label, className }) => (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
        <div className="mr-1.5">{icon}</div>
        <span className="capitalize">{label}</span>
    </div>
);


export const EventListItem: React.FC<EventListItemProps> = ({ event, onEventClick }) => {
    const venue = event.venue;
    const now = new Date();
    const deadlinePassed = event.registrationDeadline && event.registrationDeadline instanceof Date && event.registrationDeadline < now;
    const distance = (venue as VenueWithDistance).distance;
    const formattedDate = event.startTime.toLocaleDateString('nl-NL', { weekday: 'short', day: '2-digit', month: 'short' }).replace(/\.$/, '');

    return (
        <div
            onClick={() => onEventClick(event)}
            className="bg-white p-4 rounded-lg shadow-sm border border-border-color hover:border-accent hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex-grow pr-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">{venue.name}</p>
                    <h3 className="text-lg font-bold text-text-primary mt-1">{event.title}</h3>
                    <p className="text-sm text-text-secondary mt-1 max-w-prose line-clamp-2">{event.description}</p>
                </div>
                <div className="flex-shrink-0 mt-3 sm:mt-0 sm:ml-6 text-sm text-text-secondary flex flex-col items-start sm:items-end">
                    <div className="flex flex-wrap items-center justify-start sm:justify-end gap-x-3 gap-y-1">
                        <div className="flex items-center">
                            <CalendarIcon />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center">
                            <ClockIcon />
                            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                    </div>
                     <div className="flex items-center mt-2">
                        <PinIcon />
                        <span className="truncate">{distance !== undefined ? `${distance.toFixed(1)} km • ` : ''}{venue.address}</span>
                    </div>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border-color flex items-center flex-wrap gap-2">
                <Tag
                    icon={<AccessLevelIcon level={event.accessLevel} />}
                    label={translateAccessLevel(event.accessLevel)}
                    className="bg-gray-100 text-gray-800"
                />
                {event.accessLevel === 'REGISTRATION' && event.registrationDeadline && event.registrationDeadline instanceof Date && (
                    <Tag
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        label={`Aanmelden tot ${event.registrationDeadline.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}`}
                        className={deadlinePassed ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                    />
                )}
                 <Tag
                    icon={<CostIcon cost={event.cost || ''} />}
                    label={event.cost || 'Onbekend'}
                    className="bg-gray-100 text-gray-800"
                />
                {event.dietaryTags.map(tag => (
                    <Tag
                        key={tag}
                        icon={<DietaryIcon tag={tag} />}
                        label={translateDietaryTag(tag)}
                        className="bg-green-100 text-green-800"
                    />
                ))}
            </div>
        </div>
    );
};