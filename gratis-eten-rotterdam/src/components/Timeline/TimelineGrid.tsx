import { useState, useMemo } from 'react';
import { FoodEventWithDistance, VenueWithDistance, TimeViewMode } from '../../types';
// import { EventBlock } from '../Events/EventBlock';
import { VenueInfo } from '../Venues/VenueInfo';
import { EmptyState } from './EmptyState';
import { isHappeningNow, formatTimeRange } from '../../utils/time';

interface TimelineGridProps {
  events: FoodEventWithDistance[];
  venues: VenueWithDistance[];
  timeViewMode: TimeViewMode;
}

export function TimelineGrid({ events, venues }: TimelineGridProps) {
  const [selectedEvent, setSelectedEvent] = useState<FoodEventWithDistance | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueWithDistance | null>(null);

  // Generate time slots for the timeline (24-hour view with 30-minute increments)
  const timeSlots = useMemo(() => {
    const slots = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push({
          hour,
          minute,
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        });
      }
    }
    return slots;
  }, []);

  // Calculate current time position for the red line (dynamic)
  const currentTimePosition = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Calculate position based on 30-minute slots (40px per slot)
    const totalMinutes = (currentHour * 60) + currentMinute;
    const slotPosition = Math.floor(totalMinutes / 30);
    return slotPosition * 40; // 40px per 30-minute slot
  }, []);

  // Calculate event positions for 24-hour timeline
  const eventPositions = useMemo(() => {
    return events.map(event => {
      const startHour = event.startTime.getHours();
      const endHour = event.endTime.getHours();
      const startMinute = event.startTime.getMinutes();
      const endMinute = event.endTime.getMinutes();
      
      // Calculate position based on 30-minute slots (40px per slot)
      const startTotalMinutes = (startHour * 60) + startMinute;
      const endTotalMinutes = (endHour * 60) + endMinute;
      
      const startSlot = Math.floor(startTotalMinutes / 30);
      const endSlot = Math.floor(endTotalMinutes / 30);
      
      const left = startSlot * 40; // 40px per 30-minute slot
      const width = (endSlot - startSlot) * 40;
      
      return {
        event,
        left: Math.max(0, left),
        width: Math.max(40, width), // Minimum width of one slot
        isCurrent: isHappeningNow(event.startTime, event.endTime),
      };
    });
  }, [events]);

  if (events.length === 0) {
    return <EmptyState reason="NO_EVENTS_IN_TIME" />;
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Venue Column (Fixed Left) - 140px like prototype */}
      <div className="w-[140px] bg-white border-r border-gray-200 overflow-y-auto overflow-x-hidden z-10">
        <div className="h-14 flex items-center px-3 border-b border-gray-200 bg-white sticky top-0 z-5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Locaties ({venues.length})
        </div>
        
        {venues.map(venue => (
          <div
            key={venue.id}
            className="h-20 p-3 border-b border-gray-200 flex flex-col justify-center cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedVenue(venue)}
          >
            <div className="text-[13px] font-semibold text-gray-900 leading-tight mb-1">
              {venue.name}
            </div>
            <div className="text-[11px] text-gray-400">
              📍 {venue.distance.toFixed(1)}km
            </div>
          </div>
        ))}
      </div>

      {/* Events Column (Scrollable Right) */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        {/* Time Header */}
        <div className="flex h-14 sticky top-0 bg-white border-b border-gray-200 z-5 min-w-max">
          {timeSlots.map((slot, index) => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const isCurrentSlot = slot.hour === currentHour && Math.floor(currentMinute / 30) === Math.floor(slot.minute / 30);
            
            return (
              <div
                key={`${slot.hour}-${slot.minute}`}
                className={`w-10 flex-shrink-0 flex items-center justify-center text-[13px] font-medium text-gray-500 border-r border-dashed border-gray-200 ${
                  isCurrentSlot ? 'text-primary font-semibold' : ''
                }`}
              >
                {slot.minute === 0 ? slot.time : ''}
              </div>
            );
          })}
        </div>

        {/* Event Rows */}
        <div className="relative min-w-max">
          {/* Current Time Indicator (Dynamic) */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-primary z-8 pointer-events-none"
            style={{ left: `${currentTimePosition}px` }}
          >
            <div className="absolute top-1 -left-5 bg-primary text-white text-[10px] font-semibold px-2 py-1 rounded whitespace-nowrap">
              NU
            </div>
          </div>

          {/* Event Rows - one per venue */}
                  {venues.map((venue) => (
            <div key={venue.id} className="flex h-20 border-b border-gray-200 relative">
              {/* Time Grid Background */}
              {timeSlots.map(slot => (
                <div key={`${slot.hour}-${slot.minute}`} className="w-10 flex-shrink-0 border-r border-dashed border-gray-200"></div>
              ))}
              
              {/* Events for this venue */}
              {eventPositions
                .filter(pos => pos.event.venue.id === venue.id)
                .map((pos, eventIndex) => (
                  <div
                    key={`${pos.event.id}-${eventIndex}`}
                    className={`absolute bg-white border border-gray-200 rounded-lg p-2 shadow-sm cursor-pointer transition-all duration-100 hover:shadow-md active:scale-95 overflow-hidden ${
                      pos.isCurrent ? 'border-l-4 border-l-primary bg-red-50' : ''
                    }`}
                    style={{
                      left: pos.left,
                      top: 8,
                      width: pos.width,
                      height: 64,
                    }}
                    onClick={() => setSelectedEvent(pos.event)}
                  >
                    <div className={`text-[11px] font-medium mb-0.5 ${
                      pos.isCurrent ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {formatTimeRange(pos.event.startTime, pos.event.endTime)}
                    </div>
                    <div className="text-[13px] font-semibold text-gray-900 leading-tight mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                      {pos.event.title}
                    </div>
                    <div className="text-[10px] text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                      {pos.event.cost || 'Gratis'} • {pos.event.accessLevel === 'WALK_IN' ? 'Vrije inloop' : 'Aanmelden vereist'}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedEvent.title}</h4>
              <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📍</span>
                  <span>{selectedEvent.venue.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🕐</span>
                  <span>{formatTimeRange(selectedEvent.startTime, selectedEvent.endTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">💰</span>
                  <span>{selectedEvent.cost}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🚶</span>
                  <span>{selectedEvent.accessLevel === 'WALK_IN' ? 'Vrije inloop' : 'Aanmelding vereist'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Venue Detail Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Venue Details</h3>
                <button
                  onClick={() => setSelectedVenue(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <VenueInfo venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
          </div>
        </div>
      )}
    </div>
  );
}