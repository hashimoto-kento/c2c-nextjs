export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CalendarEventFormData = Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>;