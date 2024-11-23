'use client';

import React, { useState } from "react";
import { CalendarView } from "@/app/components/calendar/CalendarView";
import { EventDialog } from "@/app/components/calendar/EventDialog";
import { useEventOperations } from "@/app/hooks/useEventOperations";
import { CalendarEvent, CalendarEventFormData } from "@/app/types/event";
import { Button } from "@/app/components/ui/button";

const CalendarPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { events, fetchEvents, handleSubmit, handleDelete } = useEventOperations();

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: CalendarEventFormData) => {
    await handleSubmit(data, selectedEvent);
    setIsDialogOpen(false);
  };

  const onDelete = async () => {
    if (selectedEvent) {
      await handleDelete(selectedEvent);
      setIsDialogOpen(false);
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
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const goToNext = () => {
    setCurrentDate(prevDate => {
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