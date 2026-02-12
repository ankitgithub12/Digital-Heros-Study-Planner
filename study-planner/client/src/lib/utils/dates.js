import { format, differenceInDays, addDays, isToday, isBefore, isAfter, parseISO } from 'date-fns';

export function formatDate(dateStr) {
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr) {
  try {
    return format(parseISO(dateStr), 'MMM dd');
  } catch {
    return dateStr;
  }
}

export function getDayName(dateStr) {
  try {
    return format(parseISO(dateStr), 'EEEE');
  } catch {
    return '';
  }
}

export function getDaysRemaining(deadline) {
  try {
    const end = typeof deadline === 'string' ? parseISO(deadline) : deadline;
    const remaining = differenceInDays(end, new Date());
    return Math.max(0, remaining);
  } catch {
    return 0;
  }
}

export function getDateRange(startDate, days) {
  const dates = [];
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  for (let i = 0; i < days; i++) {
    dates.push(format(addDays(start, i), 'yyyy-MM-dd'));
  }
  return dates;
}

export function isTodayDate(dateStr) {
  try {
    return isToday(parseISO(dateStr));
  } catch {
    return false;
  }
}

export function isPastDate(dateStr) {
  try {
    return isBefore(parseISO(dateStr), new Date()) && !isToday(parseISO(dateStr));
  } catch {
    return false;
  }
}

export function isFutureDate(dateStr) {
  try {
    return isAfter(parseISO(dateStr), new Date());
  } catch {
    return false;
  }
}

export function getTodayISO() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getMinDeadline() {
  return format(new Date(), 'yyyy-MM-dd');
}
