import React from 'react';
import { ChevronLeftIcon } from '../Layout/Icons';

interface TimelineHeaderProps {
    venueColumnWidth: number;
    slotWidth: number;
    totalHours: number;
    venueCount: number;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
    venueColumnWidth,
    slotWidth,
    totalHours,
    venueCount,
    isCollapsed,
    onToggleCollapse,
}) => {
    return (
        <div className="sticky top-0 z-20 flex bg-surface shadow-[0_1px_0_0_#EBEBEB] dark:shadow-[0_1px_0_0_#374151]">
            {/* Sticky "LOCATIES" Header */}
            <div
                className="flex-shrink-0 border-r border-border-color sticky left-0 px-2 md:px-4 flex items-center h-7 bg-surface z-10"
                style={{ width: `${venueColumnWidth}px` }}
            >
                <div className={`flex items-center flex-grow min-w-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && (
                        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                            LOCATIES ({venueCount})
                        </h2>
                    )}
                     <button 
                        onClick={onToggleCollapse} 
                        className={`p-1 rounded-full hover:bg-border-color text-text-secondary flex-shrink-0 ${isCollapsed ? '' : 'ml-1'}`}
                        aria-label={isCollapsed ? "Locatiekolom uitvouwen" : "Locatiekolom invouwen"}
                    >
                        <ChevronLeftIcon className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                </div>
            </div>

            {/* Scrollable Time Ruler */}
            <div className="flex-grow flex">
                {Array.from({ length: totalHours }).map((_, hour) => (
                    <div
                        key={hour}
                        className="text-sm text-text-secondary text-center border-r border-border-color flex-shrink-0 flex items-center justify-center h-7"
                        style={{ width: `${slotWidth}px` }}
                    >
                        {`${hour.toString().padStart(2, '0')}:00`}
                    </div>
                ))}
            </div>
        </div>
    );
};