"use client";

import React, { useState, useEffect } from "react";
import { CalendarView } from "@/app/components/calendar/CalendarView";
import { EventDialog } from "@/app/components/calendar/EventDialog";
import { useEventOperations } from "@/app/hooks/useEventOperations";
import { CalendarEvent, CalendarEventFormData } from "@/app/types/event";

const CalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { fetchEvents, handleSubmit, handleDelete } = useEventOperations();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
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

  const onSubmit = async (data: CalendarEventFormData) => {
    try {
      const newEvent = await handleSubmit(data, selectedEvent);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
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

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPrevious = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const goToNext = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  return (
    <div className="h-screen p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>{currentDate.toLocaleDateString()}</div>
      </div>
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
        event={selectedEvent || undefined}
        onSubmit={onSubmit}
        onDelete={selectedEvent ? onDelete : undefined}
      />
    </div>
  );
};

export default CalendarPage;
