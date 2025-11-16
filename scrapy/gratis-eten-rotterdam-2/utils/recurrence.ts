import type { FoodEvent, RecurrenceRule, DayOfWeek, WeekOfMonth, RecurrenceDeadline } from '../types';
import { getFirstDayOfWeek, getLastDayOfMonth } from './time';

// A check for Central European Summer Time (CEST).
// DST in Europe/Amsterdam starts on the last Sunday of March at 01:00 UTC
// and ends on the last Sunday of October at 01:00 UTC.
const isCEST = (date: Date): boolean => {
  const year = date.getUTCFullYear();
  
  // Find last Sunday in March
  const dstStart = new Date(Date.UTC(year, 2, 31)); // March 31
  dstStart.setUTCDate(31 - dstStart.getUTCDay());
  dstStart.setUTCHours(1, 0, 0, 0);

  // Find last Sunday in October
  const dstEnd = new Date(Date.UTC(year, 9, 31)); // October 31
  dstEnd.setUTCDate(31 - dstEnd.getUTCDay());
  dstEnd.setUTCHours(1, 0, 0, 0);

  return date.getTime() >= dstStart.getTime() && date.getTime() < dstEnd.getTime();
};

// Helper to get all dates for a specific weekday in a month
const getDatesForWeekdayInMonth = (year: number, month: number, dayOfWeek: DayOfWeek): Date[] => {
    const dates: Date[] = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        if (date.getDay() === dayOfWeek) {
            dates.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
    }
    return dates;
};

export const generateOccurrences = (event: FoodEvent, windowStart: Date, windowEnd: Date): FoodEvent[] => {
    if (!event.recurrence || event.recurrence.frequency === 'NONE') {
        // For non-recurring events, check if they fall within the window
        if (event.startTime < windowEnd && event.endTime > windowStart) {
            const singleEvent = {...event};
            // Ensure deadline is a Date object if it exists
            if (singleEvent.registrationDeadline && !(singleEvent.registrationDeadline instanceof Date)) {
                delete singleEvent.registrationDeadline; // Invalid rule for non-recurring
            }
            return [singleEvent];
        }
        return [];
    }
    
    const occurrences: FoodEvent[] = [];
    const { recurrence, startTime, endTime } = event;
    const duration = endTime.getTime() - startTime.getTime();
    
    const eventStartDate = new Date(startTime);
    eventStartDate.setHours(0, 0, 0, 0);

    let cursor = getFirstDayOfWeek(windowStart);
    // To be safe, let's start checking from the week before the window starts
    cursor.setDate(cursor.getDate() - 7);


    // Iterate up to 9 weeks to cover bi-weekly and monthly cases that might span across window boundaries
    for (let i = 0; i < 9 * 7; i++) {
        const currentDate = new Date(cursor);
        currentDate.setDate(cursor.getDate() + i);

        if (currentDate > windowEnd) {
            break; // Stop if we've passed the window
        }

        // FIX: Don't generate occurrences before the event's official start date
        if (currentDate < eventStartDate) {
            continue;
        }

        let shouldCreateOccurrence = false;

        if (recurrence.frequency === 'WEEKLY') {
            if (recurrence.daysOfWeek && recurrence.daysOfWeek.includes(currentDate.getDay() as DayOfWeek)) {
                shouldCreateOccurrence = true;
            } else if (!recurrence.daysOfWeek && recurrence.dayOfWeek !== undefined && currentDate.getDay() === recurrence.dayOfWeek) {
                // Backwards compatibility for old data with single day
                shouldCreateOccurrence = true;
            }
        } else if (recurrence.frequency === 'BIWEEKLY') {
            const firstEventDate = getFirstDayOfWeek(startTime);
            firstEventDate.setDate(firstEventDate.getDate() + (recurrence.dayOfWeek! - firstEventDate.getDay() + 7) % 7);
            
            const diffWeeks = Math.floor((currentDate.getTime() - firstEventDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

            if (currentDate.getDay() === recurrence.dayOfWeek && diffWeeks % 2 === 0) {
                shouldCreateOccurrence = true;
            }
        } else if (recurrence.frequency === 'MONTHLY') {
            if (recurrence.monthDay) {
                if (currentDate.getDate() === recurrence.monthDay) {
                    shouldCreateOccurrence = true;
                }
            } else if (recurrence.weeksOfMonth && recurrence.dayOfWeek !== undefined) {
                 const year = currentDate.getFullYear();
                 const month = currentDate.getMonth();
                 if (currentDate.getDay() === recurrence.dayOfWeek) {
                    const weekdaysInMonth = getDatesForWeekdayInMonth(year, month, recurrence.dayOfWeek);
                    for (const week of recurrence.weeksOfMonth) {
                        let targetDate: Date | undefined;
                        if (week === 'FIRST') targetDate = weekdaysInMonth[0];
                        if (week === 'SECOND') targetDate = weekdaysInMonth[1];
                        if (week === 'THIRD') targetDate = weekdaysInMonth[2];
                        if (week === 'FOURTH') targetDate = weekdaysInMonth[3];
                        if (week === 'LAST') targetDate = weekdaysInMonth[weekdaysInMonth.length - 1];

                        if (targetDate && targetDate.getDate() === currentDate.getDate()) {
                           shouldCreateOccurrence = true;
                           break; 
                        }
                    }
                 }
            }
        }

        if (shouldCreateOccurrence) {
            const newDateYear = currentDate.getFullYear();
            const newDateMonth = currentDate.getMonth();
            const newDateDay = currentDate.getDate();

            // Create a new date at noon UTC to check its DST status
            const occurrenceDateForDSTCheck = new Date(Date.UTC(newDateYear, newDateMonth, newDateDay, 12));

            const baseIsSummer = isCEST(startTime);
            const occurrenceIsSummer = isCEST(occurrenceDateForDSTCheck);

            let utcHour = startTime.getUTCHours();
            // Adjust hour to keep local time consistent across DST changes
            if (baseIsSummer && !occurrenceIsSummer) {
                utcHour += 1; // From summer (CEST) to winter (CET)
            } else if (!baseIsSummer && occurrenceIsSummer) {
                utcHour -= 1; // From winter (CET) to summer (CEST)
            }

            const newStartTime = new Date(Date.UTC(
                newDateYear,
                newDateMonth,
                newDateDay,
                utcHour,
                startTime.getUTCMinutes(),
                startTime.getUTCSeconds(),
                startTime.getUTCMilliseconds()
            ));

            const newEndTime = new Date(newStartTime.getTime() + duration);

            if (newStartTime < windowEnd && newEndTime > windowStart) {
                // Ensure no duplicates are added
                const alreadyExists = occurrences.some(o => o.startTime.getTime() === newStartTime.getTime());
                if (!alreadyExists) {
                    let occurrenceDeadline: Date | undefined = undefined;
                    if (event.registrationDeadline && !(event.registrationDeadline instanceof Date)) {
                        const rule = event.registrationDeadline as RecurrenceDeadline;
                        const [hours, minutes] = rule.time.split(':').map(Number);
                        const deadlineDate = new Date(newStartTime);
                        deadlineDate.setDate(deadlineDate.getDate() - rule.daysBefore);
                        deadlineDate.setHours(hours, minutes, 0, 0);
                        occurrenceDeadline = deadlineDate;
                    }

                    occurrences.push({
                        ...event,
                        id: `${event.id}-occurrence-${newStartTime.toISOString().slice(0,10)}`,
                        startTime: newStartTime,
                        endTime: newEndTime,
                        registrationDeadline: occurrenceDeadline,
                    });
                }
            }
        }
    }
    
    return occurrences;
};


const dayNames: Record<DayOfWeek, string> = { 0: 'zondag', 1: 'maandag', 2: 'dinsdag', 3: 'woensdag', 4: 'donderdag', 5: 'vrijdag', 6: 'zaterdag' };
const weekNames: Record<WeekOfMonth, string> = { 'FIRST': 'eerste', 'SECOND': 'tweede', 'THIRD': 'derde', 'FOURTH': 'vierde', 'LAST': 'laatste' };

export const formatRecurrenceRule = (rule: RecurrenceRule): string => {
    switch (rule.frequency) {
        case 'NONE':
            return "Eenmalig evenement";
        case 'WEEKLY':
            const days = rule.daysOfWeek || (rule.dayOfWeek !== undefined ? [rule.dayOfWeek] : []);
            if (days.length > 0) {
                const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon -> Sun for display
                const sortedDays = [...days].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
                
                if (sortedDays.length === 7) return "Elke dag";
                if (sortedDays.join(',') === '1,2,3,4,5') return "Elke werkdag";

                const dayStr = sortedDays.map(d => dayNames[d]).join(', ');
                return `Elke week op ${dayStr}`;
            }
            return "Wekelijks";
        case 'BIWEEKLY':
            return `Elke 2 weken op ${dayNames[rule.dayOfWeek!]}`;
        case 'MONTHLY':
            if (rule.monthDay) {
                return `Elke maand op de ${rule.monthDay}e`;
            }
            if (rule.weeksOfMonth && rule.dayOfWeek !== undefined) {
                const weekStr = rule.weeksOfMonth.map(w => weekNames[w]).join(' en ');
                return `Elke ${weekStr} ${dayNames[rule.dayOfWeek!]} van de maand`;
            }
            return "Maandelijks";
        default:
            return "Onbekende herhaling";
    }
};