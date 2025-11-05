import React from 'react';
import type { VenueWithDistance, VenueCategory } from '../../types';

interface VenueCardProps {
  venue: VenueWithDistance;
  isCollapsed: boolean;
}

const categoryStyles: Record<VenueCategory, { bg: string, text: string }> = {
  RELIGIOUS: { bg: 'bg-red-100', text: 'text-red-800' },
  COMMUNITY: { bg: 'bg-green-100', text: 'text-green-800' },
  FOOD_BANK: { bg: 'bg-blue-100', text: 'text-blue-800' },
  FOOD_RESCUE: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  COMMERCIAL: { bg: 'bg-purple-100', text: 'text-purple-800' },
};

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const VenueCategoryIcon: React.FC<{ category: VenueCategory }> = ({ category }) => {
    let icon;
    switch (category) {
        case 'COMMUNITY':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
            break;
        case 'RELIGIOUS':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
            break;
        case 'FOOD_BANK':
            icon = <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
            break;
        case 'FOOD_RESCUE':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477a2 2 0 00-1.022.547zM16.5 9.5l-8-8" /></svg>;
            break;
        case 'COMMERCIAL':
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
            break;
        default:
            return null;
    }
    const { bg, text } = categoryStyles[category] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return <div className={`w-6 h-6 rounded-full flex items-center justify-center ${bg} ${text}`}>{icon}</div>
}

const InitialsFallback: React.FC<{ name: string; category: VenueCategory }> = ({ name, category }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const { bg, text } = categoryStyles[category] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
        <div className={`w-full h-full rounded-lg flex items-center justify-center ${bg} ${text} font-bold text-lg`}>
            {initials}
        </div>
    );
};

export const VenueCard: React.FC<VenueCardProps> = ({ venue, isCollapsed }) => {
  if (isCollapsed) {
    return (
      <div className="w-14 h-14 transition-all duration-300 ease-in-out" title={venue.name}>
        {venue.logoUrl ? (
          <img 
            src={venue.logoUrl} 
            alt={`${venue.name} logo`} 
            className="w-full h-full object-cover rounded-lg shadow-sm"
          />
        ) : (
          <InitialsFallback name={venue.name} category={venue.category} />
        )}
      </div>
    );
  }
  
  const { text } = categoryStyles[venue.category] || { text: 'text-gray-800' };
  
  return (
    <div className="bg-white p-2 rounded-lg w-full transition-all duration-300 ease-in-out">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-text-primary text-sm leading-tight pr-2">{venue.name}</h3>
        <VenueCategoryIcon category={venue.category} />
      </div>
       <div className="flex items-center justify-between text-text-secondary text-xs mt-2">
        <div className="flex items-center">
            <PinIcon />
            <span className="ml-1">{venue.distance.toFixed(1)} km</span>
        </div>
        <span className={`font-medium ${text}`}>{venue.category}</span>
      </div>
    </div>
  );
};