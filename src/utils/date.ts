import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export function getMonthDays(date: Date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  return eachDayOfInterval({ start: monthStart, end: monthEnd });
}

export function formatDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatMonthYear(date: Date) {
  return format(date, 'MMMM yyyy');
}