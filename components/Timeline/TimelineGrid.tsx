
import React, { useRef, useEffect, useState, useMemo } from 'react';
import type { FoodEvent, VenueWithDistance, DailyEventGrouping } from '../../types';
import { EventBlock } from '../Events/EventBlock';
import { CurrentTimeLine } from './CurrentTimeLine';
import { VenueCard } from '../Venues/VenueCard';
import { getCurrentVenueColumnWidth, zoomConfigs } from '../../config/layout';
import { TimelineHeader } from './TimelineHeader';
import { ZoomInIcon, ZoomOutIcon, ChevronLeftIcon } from '../Layout/Icons';

interface TimelineGridProps {
  dailyGroupings: DailyEventGrouping[];
  currentTime: Date;
  onEventClick: (event: FoodEvent) => void;
  totalVenues: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const TOTAL_HOURS = 24;
const COLLAPSED_SEGMENT_WIDTH = 32;

const CollapsedGridSegment: React.FC<{ width: number }> = ({ width }) => {
    return (
        <div 
            className="h-full bg-repeat-y"
            style={{ 
                width: `${width}px`,
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='10' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none'/%3e%3cpath d='M0 5 L100 5' stroke='%23EBEBEB' stroke-width='1' stroke-dasharray='1, 3' stroke-linecap='square'/%3e%3c/svg%3e")`,
                borderRight: '1px solid #EBEBEB'
            }}
        />
    );
};


export const TimelineGrid: React.FC<TimelineGridProps> = ({ dailyGroupings, currentTime, onEventClick, totalVenues, isCollapsed, onToggleCollapse }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());

  const currentZoomConfig = zoomConfigs[zoomLevel];
  const SLOT_WIDTH_PX = currentZoomConfig.slotWidth;
  const ROW_HEIGHT_PX = currentZoomConfig.rowHeight;
  const currentVenueColWidth = getCurrentVenueColumnWidth(isCollapsed, zoomLevel);
  
  const { timelineSegments, totalTimelineWidth, minutesToPosition } = useMemo(() => {
    const allEventsAcrossDays = dailyGroupings.flatMap(day => Array.from(day.eventsByVenue.values()).flat());

    // 1. Determine active hours across all visible events based on UTC time
    const activeHours = Array(TOTAL_HOURS).fill(false);
    for (const event of allEventsAcrossDays) {
        const startHour = event.startTime.getUTCHours();
        const endHour = event.endTime.getUTCMinutes() === 0 && event.endTime.getUTCHours() > 0 ? event.endTime.getUTCHours() - 1 : event.endTime.getUTCHours();
        for (let h = startHour; h <= endHour; h++) {
            if (h >= 0 && h < TOTAL_HOURS) activeHours[h] = true;
        }
    }

    // 2. Create timeline segments
    const segments: { type: 'active' | 'collapsed'; startHour: number; duration: number; width: number; }[] = [];
    if (activeHours.length > 0 && allEventsAcrossDays.length > 0) {
        let currentSegment: { type: 'active' | 'collapsed'; startHour: number; duration: number } = { type: activeHours[0] ? 'active' : 'collapsed', startHour: 0, duration: 1 };
        for (let i = 1; i < TOTAL_HOURS; i++) {
            const isHourActive = activeHours[i];
            const currentSegmentType = isHourActive ? 'active' : 'collapsed';
            if (currentSegment.type === currentSegmentType) {
                currentSegment.duration++;
            } else {
                segments.push({ ...currentSegment, width: currentSegment.type === 'active' ? currentSegment.duration * SLOT_WIDTH_PX : COLLAPSED_SEGMENT_WIDTH });
                currentSegment = { type: currentSegmentType, startHour: i, duration: 1 };
            }
        }
        segments.push({ ...currentSegment, width: currentSegment.type === 'active' ? currentSegment.duration * SLOT_WIDTH_PX : COLLAPSED_SEGMENT_WIDTH });
    } else {
        segments.push({ type: 'active', startHour: 0, duration: 24, width: 24 * SLOT_WIDTH_PX });
    }

    // 3. Calculate total width and start positions
    const totalWidth = segments.reduce((sum, seg) => sum + seg.width, 0);
    const segmentStartPositions = segments.reduce((acc, seg, index) => {
        acc.push(index > 0 ? acc[index - 1] + segments[index - 1].width : 0);
        return acc;
    }, [] as number[]);

    // 4. Create a function to calculate the pixel position for any given minute
    const posFn = (minutes: number): number => {
        if (minutes < 0) return 0;
        if (minutes >= 24 * 60) return totalWidth;
        const targetHour = Math.floor(minutes / 60);
        const minutesInHour = minutes % 60;
        const segmentIndex = segments.findIndex(seg => targetHour >= seg.startHour && targetHour < seg.startHour + seg.duration);
        if (segmentIndex === -1) return totalWidth;
        const segment = segments[segmentIndex];
        const segmentStartPos = segmentStartPositions[segmentIndex];
        if (segment.type === 'collapsed') {
            return segmentStartPos + segment.width / 2;
        } else {
            const hourIntoSegment = targetHour - segment.startHour;
            const minutesIntoSegment = (hourIntoSegment * 60) + minutesInHour;
            return segmentStartPos + (minutesIntoSegment / 60) * SLOT_WIDTH_PX;
        }
    };

    return { timelineSegments: segments, totalTimelineWidth: totalWidth, minutesToPosition: posFn };
  }, [dailyGroupings, SLOT_WIDTH_PX]);

  // Center on current time on initial load or when view changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const totalMinutes = currentTime.getUTCHours() * 60 + currentTime.getUTCMinutes();
      const scrollPosition = minutesToPosition(totalMinutes);
      const containerWidth = scrollContainerRef.current.offsetWidth - currentVenueColWidth;
      const centeredScrollLeft = scrollPosition - (containerWidth / 2);
      scrollContainerRef.current.scrollLeft = Math.max(0, centeredScrollLeft);
    }
  }, [zoomLevel, currentVenueColWidth, minutesToPosition, currentTime]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, zoomConfigs.length - 1));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 0));
  
  const dayVerticalPositions = useMemo(() => {
    let cumulativeHeight = 0;
    const DATE_HEADER_HEIGHT = 32; // h-8
    return dailyGroupings.map(day => {
        const dateKey = day.date.toISOString().slice(0, 10);
        const isDayCollapsed = collapsedDays.has(dateKey);
        const top = cumulativeHeight;
        const venuesHeight = isDayCollapsed ? 0 : day.venues.length * ROW_HEIGHT_PX;
        const height = DATE_HEADER_HEIGHT + venuesHeight;
        cumulativeHeight += height;
        return { top, height: venuesHeight, dateHeaderHeight: DATE_HEADER_HEIGHT };
    });
  }, [dailyGroupings, collapsedDays, ROW_HEIGHT_PX]);

  const todayKey = new Date(currentTime.getTime() - currentTime.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const todayIndex = dailyGroupings.findIndex(day => day.date.toISOString().slice(0, 10) === todayKey);

  const ZoomControls = () => (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center space-y-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-border-color">
      <button onClick={handleZoomIn} disabled={zoomLevel === zoomConfigs.length - 1} className="p-2 rounded-full text-text-secondary enabled:hover:bg-surface disabled:opacity-50 transition-colors" aria-label="Inzoomen">
        <ZoomInIcon className="h-6 w-6" />
      </button>
      <span className="text-xs font-mono text-text-secondary w-6 text-center" aria-live="polite" aria-atomic="true">{`x${zoomLevel+1}`}</span>
      <button onClick={handleZoomOut} disabled={zoomLevel === 0} className="p-2 rounded-full text-text-secondary enabled:hover:bg-surface disabled:opacity-50 transition-colors" aria-label="Uitzoomen">
        <ZoomOutIcon className="h-6 w-6" />
      </button>
    </div>
  );

  return (
    <div ref={scrollContainerRef} className="flex-grow overflow-auto relative">
      <ZoomControls />
      <div className="relative" style={{ width: `${currentVenueColWidth + totalTimelineWidth}px` }}>
        
        <TimelineHeader
          venueColumnWidth={currentVenueColWidth}
          timelineSegments={timelineSegments}
          slotWidth={SLOT_WIDTH_PX}
          venueCount={totalVenues}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
        
        <div className="relative">
          {dailyGroupings.map((day) => {
            const dateKey = day.date.toISOString().slice(0, 10);
            const isDayCollapsed = collapsedDays.has(dateKey);
            const isToday = dateKey === todayKey;

            let nuPosition = 0;
            if (isToday) {
                const currentMinutes = currentTime.getUTCHours() * 60 + currentTime.getUTCMinutes();
                nuPosition = minutesToPosition(currentMinutes);
            }

            return (
              <section key={dateKey} className="border-t border-border-color first:border-t-0">
                {/* Datebreak Lane Header */}
                <div 
                  className="h-8 flex items-center bg-gray-50/50 cursor-pointer sticky top-7 z-20" // top-7 to be below main header, z-20 to be above events
                  onClick={() => {
                    const newSet = new Set(collapsedDays);
                    if (newSet.has(dateKey)) newSet.delete(dateKey);
                    else newSet.add(dateKey);
                    setCollapsedDays(newSet);
                  }}
                  aria-expanded={!isDayCollapsed}
                >
                  <div 
                    className="flex-shrink-0 flex items-center justify-between px-2 md:px-4 sticky left-0 bg-gray-50/50 z-10 h-full border-r border-border-color" 
                    style={{ width: `${currentVenueColWidth}px` }}
                  >
                    <span className="font-semibold text-xs text-text-secondary uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                       {day.date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(/\.$/, '')}
                    </span>
                    <ChevronLeftIcon className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isDayCollapsed ? '-rotate-90' : 'rotate-0'}`} />
                  </div>
                  <div className="flex-grow flex justify-end items-center pr-4 relative">
                    {isToday && (
                        <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-md"
                            style={{ left: `${nuPosition}px` }}
                        >
                          NU
                        </div>
                    )}
                  </div>
                </div>

                {/* Collapsible Content */}
                <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isDayCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
                  <div className={`min-h-0 transition-all duration-500 ease-in-out ${isDayCollapsed ? '[clip-path:inset(0_0_100%_0)]' : '[clip-path:inset(0_0_0_0)]'}`}>
                    <div className="flex">
                      <div 
                        className={`flex-shrink-0 border-r border-border-color sticky left-0 bg-white z-10 transition-all duration-300 ease-in-out`}
                        style={{ width: `${currentVenueColWidth}px`}}
                      >
                        <div className="divide-y divide-border-color">
                          {day.venues.map(venue => {
                              const eventsForVenue = day.eventsByVenue.get(venue.id) || [];
                              const isActive = eventsForVenue.some(e => e.startTime.getTime() <= currentTime.getTime() && e.endTime.getTime() > currentTime.getTime());
                              const hasOnlyPastEvents = eventsForVenue.length > 0 && eventsForVenue.every(e => e.endTime < currentTime);
                              return (
                                <div key={venue.id} className="flex items-center justify-center transition-all duration-300 ease-in-out" style={{height: `${ROW_HEIGHT_PX}px`}}>
                                    <VenueCard venue={venue} isCollapsed={isCollapsed} zoomLevel={zoomLevel} isActive={isActive} hasOnlyPastEvents={hasOnlyPastEvents} />
                                </div>
                              )
                          })}
                        </div>
                      </div>
                      
                      <div className="relative flex-grow" style={{ width: `${totalTimelineWidth}px` }}>
                        <div className="absolute inset-0 flex">
                          {timelineSegments.map((seg, index) => seg.type === 'active' 
                              ? Array.from({ length: seg.duration }).map((_, hourIndex) => <div key={`${seg.startHour}-${hourIndex}`} className="h-full border-r border-dashed border-border-color" style={{ width: `${SLOT_WIDTH_PX}px` }}></div>)
                              : <CollapsedGridSegment key={`collapsed-bg-${seg.startHour}`} width={seg.width} />
                          )}
                        </div>
                        
                        <div className="divide-y divide-border-color relative">
                            {day.venues.map((venue) => {
                              const eventsForVenue = (day.eventsByVenue.get(venue.id) || []);
                              const hasOnlyPastEvents = eventsForVenue.length > 0 && eventsForVenue.every(e => e.endTime < currentTime);
                              return (
                                <div key={venue.id} className={`relative transition-colors ${hasOnlyPastEvents ? 'bg-surface' : ''}`} style={{height: `${ROW_HEIGHT_PX}px`}}>
                                  {eventsForVenue.map((event) => {
                                    const startMinutes = event.startTime.getUTCHours() * 60 + event.startTime.getUTCMinutes();
                                    const endMinutes = event.endTime.getUTCHours() * 60 + event.endTime.getUTCMinutes();
                                    const left = minutesToPosition(startMinutes);
                                    const width = Math.max(1, minutesToPosition(endMinutes) - left);
                                    const isPast = event.endTime < currentTime;
                                    return <EventBlock key={event.id} event={event} onClick={onEventClick} style={{ left: `${left}px`, width: `${width}px` }} stickyLeft={currentVenueColWidth} zoomLevel={zoomLevel} isPast={isPast} />;
                                  })}
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
          
          {todayIndex !== -1 && !collapsedDays.has(todayKey) && (
            <div className="absolute top-0 left-0" style={{
                transform: `translateY(${dayVerticalPositions[todayIndex].top + dayVerticalPositions[todayIndex].dateHeaderHeight}px)`,
                height: `${dayVerticalPositions[todayIndex].height}px`,
                width: `${currentVenueColWidth + totalTimelineWidth}px`,
                pointerEvents: 'none',
                zIndex: 10
            }}>
                <div className="relative h-full">
                    <CurrentTimeLine currentTime={currentTime} minutesToPosition={minutesToPosition} offsetLeft={currentVenueColWidth} />
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
