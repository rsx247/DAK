import React from 'react';

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
      <svg xmlns="http://www.w.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z" />
      </svg>
      <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      <p className="text-text-secondary mt-2 max-w-md">
        {message}
      </p>
    </div>
  );
};