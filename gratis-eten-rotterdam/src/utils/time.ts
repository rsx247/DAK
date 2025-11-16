import { TimeViewMode } from '../types';

/**
 * Format time as HH:MM
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format date as "Mon 15 Oct"
 */
export function formatDate(date: Date): string {
  const days = ['Zon', 'Maa', 'Din', 'Woe', 'Don', 'Vri', 'Zat'];
  const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  
  const day = days[date.getDay()];
  const dateNum = date.getDate();
  const month = months[date.getMonth()];
  
  return `${day} ${dateNum} ${month}`;
}

/**
 * Format time range
 */
export function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

/**
 * Check if event is happening now
 */
export function isHappeningNow(start: Date, end: Date): boolean {
  const now = new Date();
  return now >= start && now <= end;
}

/**
 * Check if event is in the past
 */
export function isPast(end: Date): boolean {
  return new Date() > end;
}

/**
 * Check if event is upcoming (starts within next 30 minutes)
 */
export function isUpcoming(start: Date): boolean {
  const now = new Date();
  const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
  return start > now && start <= thirtyMinutesFromNow;
}

/**
 * Get time window boundaries based on view mode
 */
export function getTimeWindow(mode: TimeViewMode): { start: Date; end: Date } {
  const now = new Date();
  
  switch (mode) {
    case 'TODAY': {
      // Custom time window for prototype: 14:00-22:00
      const start = new Date(now);
      start.setHours(14, 0, 0, 0);
      const end = new Date(now);
      end.setHours(22, 0, 0, 0);
      return { start, end };
    }
    
    case 'NEXT_24H': {
      const start = new Date(now);
      const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return { start, end };
    }
    
    case 'WEEK': {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    
    default:
      return getTimeWindow('NEXT_24H');
  }
}

/**
 * Get hours array for timeline (0-23)
 */
export function getTimelineHours(): number[] {
  return Array.from({ length: 24 }, (_, i) => i);
}

/**
 * Calculate position percentage on timeline for a given time
 * @param time The time to position
 * @param windowStart Start of the time window
 * @param windowEnd End of the time window
 * @returns Percentage (0-100)
 */
export function getTimelinePosition(time: Date, windowStart: Date, windowEnd: Date): number {
  const windowDuration = windowEnd.getTime() - windowStart.getTime();
  const timeOffset = time.getTime() - windowStart.getTime();
  return (timeOffset / windowDuration) * 100;
}

/**
 * Calculate duration in hours
 */
export function getDurationInHours(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

/**
 * Get current hour (0-23)
 */
export function getCurrentHour(): number {
  return new Date().getHours();
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}


