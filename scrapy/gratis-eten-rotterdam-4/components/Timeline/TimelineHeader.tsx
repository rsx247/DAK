import React from 'react';
import { ChevronLeftIcon } from '../Layout/Icons';

type TimelineSegment = {
    type: 'active' | 'collapsed';
    startHour: number;
    duration: number;
    width: number;
};

interface TimelineHeaderProps {
    venueColumnWidth: number;
    timelineSegments: TimelineSegment[];
    slotWidth: number;
    venueCount: number;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const BreakPatternIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300">
        <path d="M8 3L4 9L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3L20 9L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CollapsedHeaderSegment: React.FC<{ segment: TimelineSegment }> = ({ segment }) => (
    <div
        className="flex items-center justify-center h-7 border-r border-border-color"
        style={{ width: `${segment.width}px` }}
        title={`${String(segment.startHour).padStart(2, '0')}:00 - ${String(segment.startHour + segment.duration).padStart(2, '0')}:00`}
    >
        <BreakPatternIcon />
    </div>
);


export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
    venueColumnWidth,
    timelineSegments,
    slotWidth,
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
                {timelineSegments.map((seg) => {
                    if (seg.type === 'active') {
                        return Array.from({ length: seg.duration }).map((_, hourIndex) => {
                            const hour = seg.startHour + hourIndex;
                            return (
                                <div
                                    key={hour}
                                    className="text-sm text-text-secondary text-center border-r border-border-color flex-shrink-0 flex items-center justify-center h-7"
                                    style={{ width: `${slotWidth}px` }}
                                >
                                    {`${hour.toString().padStart(2, '0')}:00`}
                                </div>
                            );
                        });
                    } else {
                        return <CollapsedHeaderSegment key={`collapsed-${seg.startHour}`} segment={seg} />;
                    }
                })}
            </div>
        </div>
    );
};
