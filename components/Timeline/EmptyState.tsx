import React from 'react';
import { EmptyStateSearchIcon } from '../Layout/Icons';

interface EmptyStateProps {
  isDraftView?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isDraftView }) => {
  const title = isDraftView ? "Geen concepten gevonden" : "Geen resultaten gevonden";
  const message = isDraftView 
    ? "Je hebt momenteel geen concept-evenementen. Klik op '+ Nieuw Event' om een nieuwe aan te maken."
    : "Probeer je filters aan te passen of een ander tijdvak te selecteren om te zien wat er beschikbaar is.";

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-surface">
      <EmptyStateSearchIcon className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      <p className="text-text-secondary mt-2 max-w-md">
        {message}
      </p>
    </div>
  );
};
