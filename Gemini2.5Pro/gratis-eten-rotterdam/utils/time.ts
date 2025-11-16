
export const getDateThisWeek = (dayOffset: number, hours: number, minutes: number = 0): Date => {
  const now = new Date();
  // We want to get the date for *today* + offset, not based on day of the week.
  const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, hours, minutes, 0, 0);
  return targetDate;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
};
