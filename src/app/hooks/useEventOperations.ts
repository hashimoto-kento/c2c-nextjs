import useSWR, { mutate } from 'swr';
import { CalendarEvent, CalendarEventCreate } from "@/app/types/event";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useEventOperations() {
  const { data: events = [], error, isLoading } = useSWR<CalendarEvent[]>(
    '/api/events',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const handleSubmit = async (data: CalendarEventCreate, selectedEvent: CalendarEvent | null): Promise<CalendarEvent> => {
    try {
      const method = selectedEvent ? 'PUT' : 'POST';
      const url = selectedEvent ? `/api/events/${selectedEvent.id}` : '/api/events';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create/update event');
      
      const updatedEvent = await response.json();
      await mutate('/api/events'); // キャッシュを更新
      
      return updatedEvent;
    } catch (error) {
      console.error('Error submitting event:', error);
      throw error;
    }
  };

  const handleDelete = async (event: CalendarEvent): Promise<void> => {
    try {
      const response = await fetch(`/api/events?id=${event.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete event');
      await mutate('/api/events'); // キャッシュを更新
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  return {
    events,
    error,
    isLoading,
    handleSubmit,
    handleDelete,
  };
}