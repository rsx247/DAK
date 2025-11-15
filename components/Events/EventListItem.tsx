import React from 'react';
import type { FoodEvent, AccessLevel, VenueWithDistance } from '../../types';
import { formatTime } from '../../utils/time';
// FIX: Replaced ClockIcon with TimeIcon as it was not an exported member of Icons.
import { PinIcon, TimeIcon, CalendarIcon, AccessLevelWalkInIcon, AccessLevelRegIcon, AccessLevelRefIcon, CostFreeIcon, CostPaidIcon, DietaryVegIcon, DietaryHalalIcon } from '../Layout/Icons';

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
    currentTime: Date;
}

// --- Icon Components ---

const AccessLevelIcon: React.FC<{ level: AccessLevel }> = ({ level }) => {
    switch (level) {
        case 'WALK_IN':
            return <AccessLevelWalkInIcon className="h-4 w-4" />;
        case 'REGISTRATION':
            return <AccessLevelRegIcon className="h-4 w-4" />;
        case 'REFERRAL':
            return <AccessLevelRefIcon className="h-4 w-4" />;
        default: return null;
    }
};

const CostIcon: React.FC<{ cost: string }> = ({ cost }) => {
    if (cost.toLowerCase() === 'gratis') {
        return <CostFreeIcon className="h-4 w-4" />;
    }
    return <CostPaidIcon className="h-4 w-4" />;
};

const DietaryIcon: React.FC<{ tag: string }> = ({ tag }) => {
    switch (tag) {
        case 'vegetarian':
        case 'vegan':
            return <DietaryVegIcon className="h-4 w-4" />;
        case 'halal':
            return <DietaryHalalIcon className="h-4 w-4" />;
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


export const EventListItem: React.FC<EventListItemProps> = ({ event, onEventClick, currentTime }) => {
    const venue = event.venue;
    const now = new Date();
    const deadlinePassed = event.registrationDeadline && event.registrationDeadline instanceof Date && event.registrationDeadline < now;
    const distance = (venue as VenueWithDistance).distance;
    const formattedDate = event.startTime.toLocaleDateString('nl-NL', { weekday: 'short', day: '2-digit', month: 'short' }).replace(/\.$/, '');
    const isPast = event.endTime < currentTime;

    return (
        <div
            onClick={() => onEventClick(event)}
            className={`bg-white p-4 rounded-lg shadow-sm border border-border-color hover:border-accent hover:shadow-md transition-all cursor-pointer ${isPast ? 'opacity-60' : ''}`}
        >
            <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex-grow pr-4">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${isPast ? 'text-text-secondary' : 'text-accent'}`}>{venue.name}</p>
                    <h3 className={`text-lg font-bold text-text-primary mt-1 ${isPast ? 'text-text-secondary' : 'text-text-primary'}`}>{event.title}</h3>
                    <p className="text-sm text-text-secondary mt-1 max-w-prose line-clamp-2">{event.description}</p>
                </div>
                <div className="flex-shrink-0 mt-3 sm:mt-0 sm:ml-6 text-sm text-text-secondary flex flex-col items-start sm:items-end">
                    <div className="flex flex-wrap items-center justify-start sm:justify-end gap-x-3 gap-y-1">
                        <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1.5 text-text-secondary" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center">
                            <TimeIcon className="h-4 w-4 mr-1.5 text-text-secondary" />
                            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                    </div>
                     <div className="flex items-center mt-2">
                        <PinIcon className="h-4 w-4 mr-1.5 text-text-secondary" />
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
                        icon={<CalendarIcon className="h-4 w-4" />}
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
