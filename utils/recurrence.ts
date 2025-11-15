import type { FoodEvent, RecurrenceRule, DayOfWeek, WeekOfMonth, RecurrenceDeadline } from '../types';
import { getFirstDayOfWeek, getLastDayOfMonth } from './time';

// Helper to get all dates for a specific weekday in a month
const getDatesForWeekdayInMonth = (year: number, month: number, dayOfWeek: DayOfWeek): Date[] => {
    const dates: Date[] = [];
    const date = new Date(Date.UTC(year, month, 1));
    while (date.getUTCMonth() === month) {
        if (date.getUTCDay() === dayOfWeek) {
            dates.push(new Date(date));
        }
        date.setUTCDate(date.getUTCDate() + 1);
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
    eventStartDate.setUTCHours(0, 0, 0, 0);

    let cursor = new Date(windowStart);
    cursor.setUTCHours(0,0,0,0);
    // To be safe, let's start checking from the week before the window starts
    cursor.setUTCDate(cursor.getUTCDate() - 7);


    // Iterate up to 9 weeks to cover bi-weekly and monthly cases that might span across window boundaries
    for (let i = 0; i < 9 * 7; i++) {
        const currentDate = new Date(cursor);
        currentDate.setUTCDate(cursor.getUTCDate() + i);

        if (currentDate > windowEnd) {
            break; // Stop if we've passed the window
        }

        // FIX: Don't generate occurrences before the event's official start date
        if (currentDate < eventStartDate) {
            continue;
        }

        let shouldCreateOccurrence = false;

        if (recurrence.frequency === 'WEEKLY') {
            if (recurrence.daysOfWeek && recurrence.daysOfWeek.includes(currentDate.getUTCDay() as DayOfWeek)) {
                shouldCreateOccurrence = true;
            } else if (!recurrence.daysOfWeek && recurrence.dayOfWeek !== undefined && currentDate.getUTCDay() === recurrence.dayOfWeek) {
                // Backwards compatibility for old data with single day
                shouldCreateOccurrence = true;
            }
        } else if (recurrence.frequency === 'BIWEEKLY') {
            const firstEventDate = new Date(startTime);
            firstEventDate.setUTCHours(0,0,0,0);
            const dayOfWeek = firstEventDate.getUTCDay();
            const diff = firstEventDate.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday is start of week
            firstEventDate.setUTCDate(diff);

            const recurrenceDay = (recurrence.dayOfWeek! === 0 ? 6 : recurrence.dayOfWeek! - 1);
            firstEventDate.setUTCDate(firstEventDate.getUTCDate() + recurrenceDay);

            
            const diffWeeks = Math.floor((currentDate.getTime() - firstEventDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

            if (currentDate.getUTCDay() === recurrence.dayOfWeek && diffWeeks >= 0 && diffWeeks % 2 === 0) {
                shouldCreateOccurrence = true;
            }
        } else if (recurrence.frequency === 'MONTHLY') {
            if (recurrence.monthDay) {
                if (currentDate.getUTCDate() === recurrence.monthDay) {
                    shouldCreateOccurrence = true;
                }
            } else if (recurrence.weeksOfMonth && recurrence.dayOfWeek !== undefined) {
                 const year = currentDate.getUTCFullYear();
                 const month = currentDate.getUTCMonth();
                 if (currentDate.getUTCDay() === recurrence.dayOfWeek) {
                    const weekdaysInMonth = getDatesForWeekdayInMonth(year, month, recurrence.dayOfWeek);
                    for (const week of recurrence.weeksOfMonth) {
                        let targetDate: Date | undefined;
                        if (week === 'FIRST') targetDate = weekdaysInMonth[0];
                        if (week === 'SECOND') targetDate = weekdaysInMonth[1];
                        if (week === 'THIRD') targetDate = weekdaysInMonth[2];
                        if (week === 'FOURTH') targetDate = weekdaysInMonth[3];
                        if (week === 'LAST') targetDate = weekdaysInMonth[weekdaysInMonth.length - 1];

                        if (targetDate && targetDate.getUTCDate() === currentDate.getUTCDate()) {
                           shouldCreateOccurrence = true;
                           break; 
                        }
                    }
                 }
            }
        }

        if (shouldCreateOccurrence) {
            const year = currentDate.getUTCFullYear();
            const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getUTCDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            const baseHours = String(startTime.getUTCHours()).padStart(2, '0');
            const baseMinutes = String(startTime.getUTCMinutes()).padStart(2, '0');
            const baseSeconds = String(startTime.getUTCSeconds()).padStart(2, '0');
            const timeString = `${baseHours}:${baseMinutes}:${baseSeconds}`;
            
            const newStartTime = new Date(`${dateString}T${timeString}Z`); // Add Z to specify UTC

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
                        deadlineDate.setUTCDate(deadlineDate.getUTCDate() - rule.daysBefore);
                        deadlineDate.setUTCHours(hours, minutes, 0, 0);
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