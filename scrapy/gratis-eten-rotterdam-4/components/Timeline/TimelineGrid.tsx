import React, { useRef, useEffect, useState, useLayoutEffect, useMemo } from 'react';
import type { FoodEvent, VenueWithDistance } from '../../types';
import { EventBlock } from '../Events/EventBlock';
import { CurrentTimeLine } from './CurrentTimeLine';
import { VenueCard } from '../Venues/VenueCard';
import { getCurrentVenueColumnWidth, zoomConfigs } from '../../config/layout';
import { TimelineHeader } from './TimelineHeader';

interface TimelineGridProps {
  venues: VenueWithDistance[];
  eventsByVenue: Map<string, FoodEvent[]>;
  currentTime: Date;
  onEventClick: (event: FoodEvent) => void;
  venueCount: number;
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


export const TimelineGrid: React.FC<TimelineGridProps> = ({ venues, eventsByVenue, currentTime, onEventClick, venueCount, isCollapsed, onToggleCollapse }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level is 1

  // Refs for FLIP animation
  const venueCardRefs = useRef(new Map<string, HTMLDivElement>());
  const venueRowRefs = useRef(new Map<string, HTMLDivElement>());
  const prevPositions = useRef(new Map<string, DOMRect>());
  const isInitialMount = useRef(true);


  const currentZoomConfig = zoomConfigs[zoomLevel];
  const SLOT_WIDTH_PX = currentZoomConfig.slotWidth;
  const ROW_HEIGHT_PX = currentZoomConfig.rowHeight;
  const currentVenueColWidth = getCurrentVenueColumnWidth(isCollapsed, zoomLevel);
  
  const { timelineSegments, totalTimelineWidth, minutesToPosition } = useMemo(() => {
    // 1. Determine active hours across all visible events
    const activeHours = Array(TOTAL_HOURS).fill(false);
    for (const events of eventsByVenue.values()) {
        for (const event of events) {
            const startHour = event.startTime.getHours();
            // If an event ends at 11:30, it occupies the 11th hour slot. 
            // If it ends exactly at 11:00, it only occupies up to the 10th hour slot.
            const endHour = event.endTime.getMinutes() === 0 && event.endTime.getHours() > 0
                ? event.endTime.getHours() - 1 
                : event.endTime.getHours();
            
            for (let h = startHour; h <= endHour; h++) {
                if (h >= 0 && h < TOTAL_HOURS) {
                    activeHours[h] = true;
                }
            }
        }
    }

    // 2. Create timeline segments by grouping consecutive active/inactive hours
    const segments: { type: 'active' | 'collapsed'; startHour: number; duration: number; width: number; }[] = [];
    if (activeHours.length > 0 && venues.length > 0) { // Only truncate if there are venues
        // FIX: Explicitly type `currentSegment` to prevent its `type` property from being widened to `string`.
        let currentSegment: { type: 'active' | 'collapsed'; startHour: number; duration: number } = { type: activeHours[0] ? 'active' : 'collapsed', startHour: 0, duration: 1 };
        for (let i = 1; i < TOTAL_HOURS; i++) {
            const isHourActive = activeHours[i];
            const currentSegmentType = isHourActive ? 'active' : 'collapsed';
            if (currentSegment.type === currentSegmentType) {
                currentSegment.duration++;
            } else {
                segments.push({
                    ...currentSegment,
                    width: currentSegment.type === 'active' ? currentSegment.duration * SLOT_WIDTH_PX : COLLAPSED_SEGMENT_WIDTH,
                });
                currentSegment = { type: currentSegmentType, startHour: i, duration: 1 };
            }
        }
        segments.push({
            ...currentSegment,
            width: currentSegment.type === 'active' ? currentSegment.duration * SLOT_WIDTH_PX : COLLAPSED_SEGMENT_WIDTH,
        });
    } else {
        // Default to a full 24h timeline if no events are present
        segments.push({ type: 'active', startHour: 0, duration: 24, width: 24 * SLOT_WIDTH_PX });
    }

    // 3. Calculate total width and start positions for each segment
    const totalWidth = segments.reduce((sum, seg) => sum + seg.width, 0);
    const segmentStartPositions = segments.reduce((acc, seg, index) => {
        acc.push(index > 0 ? acc[index - 1] + segments[index - 1].width : 0);
        return acc;
    }, [] as number[]);

    // 4. Create a function to calculate the pixel position for any given minute of the day
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
            // For a collapsed segment, snap all times within it to the middle
            return segmentStartPos + segment.width / 2;
        } else {
            // For an active segment, calculate position proportionally
            const hourIntoSegment = targetHour - segment.startHour;
            const minutesIntoSegment = (hourIntoSegment * 60) + minutesInHour;
            return segmentStartPos + (minutesIntoSegment / 60) * SLOT_WIDTH_PX;
        }
    };

    return { timelineSegments: segments, totalTimelineWidth: totalWidth, minutesToPosition: posFn };
  }, [eventsByVenue, SLOT_WIDTH_PX, venues.length]);


  // Center on current time on initial load or when view changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const totalMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      const scrollPosition = minutesToPosition(totalMinutes);
      const containerWidth = scrollContainerRef.current.offsetWidth - currentVenueColWidth;
      // Center the current time in the visible timeline area
      const centeredScrollLeft = scrollPosition - (containerWidth / 2);
      
      scrollContainerRef.current.scrollLeft = Math.max(0, centeredScrollLeft);
    }
  }, [zoomLevel, currentVenueColWidth, minutesToPosition]);
  
  // FLIP Animation logic for sorting venues
  useLayoutEffect(() => {
    const newPositions = new Map<string, DOMRect>();
    const elementsToAnimate = new Map<string, { card?: HTMLDivElement; row?: HTMLDivElement }>();
    
    // LAST: Get new positions and elements
    venues.forEach(v => {
        const row = venueRowRefs.current.get(v.id);
        if (row) {
            newPositions.set(v.id, row.getBoundingClientRect());
            elementsToAnimate.set(v.id, {
                card: venueCardRefs.current.get(v.id),
                row: row
            });
        }
    });

    // Skip animation on first render, just capture initial positions
    if (isInitialMount.current) {
        isInitialMount.current = false;
        prevPositions.current = newPositions;
        return;
    }

    // INVERT: Apply transform based on position delta
    elementsToAnimate.forEach(({ card, row }, id) => {
        const prevRect = prevPositions.current.get(id);
        const newRect = newPositions.get(id);
        if (prevRect && newRect) {
            const deltaY = prevRect.top - newRect.top;
            if (Math.abs(deltaY) > 1) { // Only animate if there is a significant move
                [card, row].forEach(el => {
                    if (el) {
                        el.style.transform = `translateY(${deltaY}px)`;
                        el.style.transition = 'transform 0s';
                    }
                });
            }
        }
    });

    // PLAY: In the next frame, remove the transform to trigger the animation
    requestAnimationFrame(() => {
        elementsToAnimate.forEach(({ card, row }) => {
            [card, row].forEach(el => {
                if (el && el.style.transform) {
                    el.style.transform = '';
                    // The "jumpy smooth landing motion" without overshooting
                    el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    
                    // Cleanup transition style after animation to prevent conflicts
                    const handleTransitionEnd = () => {
                        if (el) el.style.transition = '';
                    };
                    el.addEventListener('transitionend', handleTransitionEnd, { once: true });
                }
            });
        });
    });
    
    // Update previous positions for the next render
    prevPositions.current = newPositions;
  }, [venues]); // Rerun when venues array changes its order or content

  const handleScroll = () => {
    // Only auto-collapse on mobile screens
    if (window.innerWidth < 768) {
      if (scrollContainerRef.current) {
        // If user scrolls horizontally and the panel is not collapsed, collapse it.
        if (scrollContainerRef.current.scrollLeft > 10 && !isCollapsed) {
          onToggleCollapse();
        }
      }
    }
  };

  const handleVenueColumnClick = () => {
    if (isCollapsed) {
      onToggleCollapse();
    }
  };
  
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, zoomConfigs.length - 1));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 0));

  const ZoomControls = () => (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center space-y-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-border-color">
      <button onClick={handleZoomIn} disabled={zoomLevel === zoomConfigs.length - 1} className="p-2 rounded-full text-text-secondary enabled:hover:bg-surface disabled:opacity-50 transition-colors" aria-label="Inzoomen">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
      </button>
      <span className="text-xs font-mono text-text-secondary w-6 text-center" aria-live="polite" aria-atomic="true">{`x${zoomLevel+1}`}</span>
      <button onClick={handleZoomOut} disabled={zoomLevel === 0} className="p-2 rounded-full text-text-secondary enabled:hover:bg-surface disabled:opacity-50 transition-colors" aria-label="Uitzoomen">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
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
          venueCount={venueCount}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
        
        {/* Main Content Grid Wrapper */}
        <div className="relative z-0">
            <div className="flex">
              {/* Sticky Venues List */}
              <div 
                onClick={handleVenueColumnClick}
                className={`flex-shrink-0 border-r border-border-color sticky left-0 bg-white z-10 transition-all duration-300 ease-in-out ${isCollapsed ? 'cursor-pointer' : ''}`}
                style={{ width: `${currentVenueColWidth}px`}}
              >
                <div className="divide-y divide-border-color">
                    {venues.map(venue => {
                        const eventsForVenue = eventsByVenue.get(venue.id) || [];
                        const isActive = eventsForVenue.some(e => 
                            e.startTime.getTime() <= currentTime.getTime() && 
                            e.endTime.getTime() > currentTime.getTime()
                        );
                        const hasOnlyPastEvents = eventsForVenue.length > 0 && eventsForVenue.every(e => e.endTime < currentTime);
                        return (
                            <div 
                                key={venue.id}
                                // FIX: The callback ref was returning a value, which is not allowed. 
                                // Wrapped the expression in curly braces to create a block statement and prevent an implicit return.
                                ref={el => { el ? venueCardRefs.current.set(venue.id, el) : venueCardRefs.current.delete(venue.id); }}
                                className="flex items-center justify-center transition-all duration-300 ease-in-out" 
                                style={{height: `${ROW_HEIGHT_PX}px`}}
                            >
                                <VenueCard 
                                    venue={venue} 
                                    isCollapsed={isCollapsed} 
                                    zoomLevel={zoomLevel} 
                                    isActive={isActive} 
                                    hasOnlyPastEvents={hasOnlyPastEvents} 
                                />
                            </div>
                        )
                    })}
                </div>
              </div>
              
              {/* Events Timeline */}
              <div className="relative flex-grow" style={{ width: `${totalTimelineWidth}px` }}>
                  <CurrentTimeLine currentTime={currentTime} minutesToPosition={minutesToPosition} />
                  
                  {/* Grid Background */}
                  <div className="absolute inset-0 flex">
                    {timelineSegments.map((seg) => {
                        if (seg.type === 'active') {
                            return Array.from({ length: seg.duration }).map((_, hourIndex) => (
                                <div key={`${seg.startHour}-${hourIndex}`} className="h-full border-r border-dashed border-border-color" style={{ width: `${SLOT_WIDTH_PX}px` }}></div>
                            ));
                        } else {
                            return <CollapsedGridSegment key={`collapsed-bg-${seg.startHour}`} width={seg.width} />;
                        }
                    })}
                  </div>
                  
                  {/* Event Rows */}
                  <div className="divide-y divide-border-color relative">
                      {venues.map((venue) => {
                        const eventsForVenue = (eventsByVenue.get(venue.id) || []);
                        const hasOnlyPastEvents = eventsForVenue.length > 0 && eventsForVenue.every(e => e.endTime < currentTime);
                        
                        return (
                            <div 
                                key={venue.id}
                                // FIX: The callback ref was returning a value, which is not allowed.
                                // Wrapped the expression in curly braces to create a block statement and prevent an implicit return.
                                ref={el => { el ? venueRowRefs.current.set(venue.id, el) : venueRowRefs.current.delete(venue.id); }}
                                className={`relative transition-colors ${hasOnlyPastEvents ? 'bg-surface' : ''}`} 
                                style={{height: `${ROW_HEIGHT_PX}px`}}
                            >
                              {eventsForVenue.map((event) => {
                                const startMinutes = event.startTime.getHours() * 60 + event.startTime.getMinutes();
                                const endMinutes = event.endTime.getHours() * 60 + event.endTime.getMinutes();
                                
                                const left = minutesToPosition(startMinutes);
                                const width = Math.max(1, minutesToPosition(endMinutes) - left);
                                const isPast = event.endTime < currentTime;
                                
                                return (
                                  <EventBlock
                                    key={event.id}
                                    event={event}
                                    onClick={onEventClick}
                                    style={{ left: `${left}px`, width: `${width}px` }}
                                    stickyLeft={currentVenueColWidth}
                                    zoomLevel={zoomLevel}
                                    isPast={isPast}
                                  />
                                );
                              })}
                            </div>
                        )
                      })}
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};