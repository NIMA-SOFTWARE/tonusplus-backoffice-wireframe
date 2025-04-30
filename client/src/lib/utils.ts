import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isToday, isBefore, isAfter, addDays, getDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy');
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const amPm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${amPm}`;
}

export function formatTimeRange(startTime: string, durationMins: number): string {
  const [hours, minutes] = startTime.split(':').map(part => parseInt(part, 10));
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + durationMins);
  
  return `${formatTime(startTime)} - ${format(endDate, 'h:mm a')}`;
}

export function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  const firstDay = startOfMonth(date);
  const lastDay = endOfMonth(date);
  return eachDayOfInterval({ start: firstDay, end: lastDay });
}

export function getPreviousMonthDays(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const dayOfWeek = getDay(firstDayOfMonth);
  
  if (dayOfWeek === 0) return []; // Sunday, no previous month days needed
  
  const prevMonthLastDate = new Date(year, month, 0);
  const daysFromPrevMonth = Array.from({ length: dayOfWeek }, (_, i) => {
    return new Date(year, month-1, prevMonthLastDate.getDate() - dayOfWeek + i + 1);
  });
  
  return daysFromPrevMonth;
}

export function getNextMonthDays(year: number, month: number) {
  const lastDayOfMonth = new Date(year, month+1, 0);
  const dayOfWeek = getDay(lastDayOfMonth);
  
  if (dayOfWeek === 6) return []; // Saturday, no next month days needed
  
  const daysToAdd = 6 - dayOfWeek;
  const nextMonthDays = Array.from({ length: daysToAdd }, (_, i) => {
    return new Date(year, month+1, i+1);
  });
  
  return nextMonthDays;
}

export function determineSessionStatus(date: string, startTime: string, duration: number, currentStatus: string) {
  if (currentStatus === 'cancelled') return 'cancelled';
  
  const sessionDate = parseISO(`${date}T${startTime}`);
  const endTime = new Date(sessionDate);
  endTime.setMinutes(endTime.getMinutes() + duration);
  
  const now = new Date();
  
  if (isBefore(endTime, now)) {
    return 'finished';
  } else if (isAfter(sessionDate, now) && isBefore(now, endTime)) {
    return 'ongoing';
  } else if (currentStatus === 'pending' || currentStatus === 'open' || currentStatus === 'closed') {
    return currentStatus;
  }
  
  return currentStatus;
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function getStatusColor(status: string): string {
  switch(status) {
    case 'pending': return 'bg-slate-100 text-slate-800';
    case 'open': return 'bg-green-100 text-green-800';
    case 'closed': return 'bg-slate-100 text-slate-800';
    case 'ongoing': return 'bg-amber-100 text-amber-800';
    case 'finished': return 'bg-slate-100 text-slate-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
}

export function getSessionColor(activity: string): string {
  const colors: Record<string, string> = {
    'Mat Pilates': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    'Reformer Pilates': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    'Barre Fusion': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
    'Prenatal Pilates': 'bg-green-100 text-green-800 hover:bg-green-200',
  };
  
  return colors[activity] || 'bg-blue-100 text-blue-800 hover:bg-blue-200';
}
