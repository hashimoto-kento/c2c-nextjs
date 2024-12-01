import { useState } from "react";
import { CalendarEvent, CalendarEventFormData } from "@/app/types/event";

export function useEventOperations() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const fetchEvents = async (): Promise<CalendarEvent[]> => {
    const response = await fetch('/api/events');
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    setEvents(data);
    return data;
  };

  const handleSubmit = async (data: CalendarEventFormData, selectedEvent: CalendarEvent | null): Promise<CalendarEvent> => {
    const method = selectedEvent ? 'PUT' : 'POST';
    const url = selectedEvent ? `/api/events/${selectedEvent.id}` : '/api/events';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create/update event');
    return await response.json();
  };

  const handleDelete = async (event: CalendarEvent): Promise<void> => {
    const response = await fetch(`/api/events?id=${event.id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete event');
  };

  return { fetchEvents, handleSubmit, handleDelete };
}