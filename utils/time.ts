
export const getDateThisWeek = (dayOffset: number, hours: number, minutes: number = 0): Date => {
  const now = new Date();
  // We want to get the date for *today* + offset, not based on day of the week.
  const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, hours, minutes, 0, 0);
  return targetDate;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
};

export const getFirstDayOfWeek = (date: Date): Date => {
    const d = new Date(date);
    // Set hours to 0 to avoid DST issues
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    // Adjust so Monday is the first day (1) and Sunday is the last (0 -> 7)
    const weekDay = day === 0 ? 7 : day;
    const diff = d.getDate() - weekDay + 1;
    return new Date(d.setDate(diff));
};

export const getLastDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};
