
import React from 'react';
import type { VenueWithDistance } from '../../types';

interface VenueCardProps {
  venue: VenueWithDistance;
}

const categoryColors: Record<string, string> = {
  RELIGIOUS: 'bg-red-100 text-red-800',
  COMMUNITY: 'bg-green-100 text-green-800',
  FOOD_BANK: 'bg-blue-100 text-blue-800',
  COMMERCIAL: 'bg-purple-100 text-purple-800',
};

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);


export const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const categoryColor = categoryColors[venue.category] || 'bg-gray-100 text-gray-800';
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-transparent hover:border-border-color transition-all">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-text-primary text-base leading-tight pr-2">{venue.name}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColor}`}>{venue.category}</span>
      </div>
      <div className="flex items-center text-text-secondary text-sm mt-2">
        <PinIcon />
        <span className="ml-1">{venue.distance.toFixed(1)} km</span>
      </div>
    </div>
  );
};
