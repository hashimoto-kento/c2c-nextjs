"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CalendarView } from "@/app/components/calendar/CalendarView";
import { EventDialog } from "@/app/components/calendar/EventDialog";
import { useEventOperations } from "@/app/hooks/useEventOperations";
import { CalendarEvent, CalendarEventCreate } from "@/app/types/event";

const CalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { handleSubmit, handleDelete } = useEventOperations();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };
    loadEvents();
  }, [fetchEvents]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: CalendarEventCreate) => {
    try {
      const transformedData = {
        ...data,
        startDate:
          data.startDate instanceof Date
            ? data.startDate.toISOString()
            : data.startDate,
        endDate:
          data.endDate instanceof Date
            ? data.endDate.toISOString()
            : data.endDate,
      };

      const newEvent = await handleSubmit(transformedData, selectedEvent);
      setEvents((prevEvents) => {
        if (selectedEvent) {
          return prevEvents.map((event) =>
            event.id === selectedEvent.id ? newEvent : event
          );
        }
        return [...prevEvents, newEvent];
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating/updating event:", error);
    }
  };

  const onDelete = async () => {
    if (selectedEvent) {
      try {
        await handleDelete(selectedEvent);
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEvent.id)
        );
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="h-screen p-4">
      <CalendarView
        events={events}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />
      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        event={selectedEvent}
        onSubmit={onSubmit}
        onDelete={selectedEvent ? onDelete : undefined}
      />
    </div>
  );
};

export default CalendarPage;
