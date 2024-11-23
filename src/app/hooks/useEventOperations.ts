// app/hooks/useEventOperations.ts
import { useState, useCallback } from 'react';
import { useToast } from "@/app/components/ui/use-toast";
import { CalendarEvent, CalendarEventFormData } from "@/app/types/event";

export function useEventOperations() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }
      const data = await response.json();
      setEvents(
        data.map((event: CalendarEvent) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch events. Please try again later.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleSubmit = async (data: CalendarEventFormData, selectedEvent: CalendarEvent | null) => {
    try {
      const method = selectedEvent ? "PUT" : "POST";
      const body = selectedEvent ? { id: selectedEvent.id, ...data } : data;

      await fetch("/api/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await fetchEvents();
      toast({
        title: "Success",
        description: selectedEvent ? "Event updated" : "Event created",
      });
    } catch (error) {
      console.error("Failed to save event:", error);
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (selectedEvent: CalendarEvent) => {
    try {
      await fetch(`/api/events?id=${selectedEvent.id}`, {
        method: "DELETE",
      });

      await fetchEvents();
      toast({
        title: "Success",
        description: "Event deleted",
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { events, fetchEvents, handleSubmit, handleDelete };
}