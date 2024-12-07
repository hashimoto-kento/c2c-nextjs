"use client";

import React, { useState } from "react";
import { CalendarView } from "@/app/components/calendar/CalendarView";
import { EventDialog } from "@/app/components/calendar/EventDialog";
import { useEventOperations } from "@/app/hooks/useEventOperations";
import { CalendarEvent, CalendarEventCreate } from "@/app/types/event";

const CalendarPage = () => {
  const { events, isLoading, error, handleSubmit, handleDelete } =
    useEventOperations();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

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
      // データを CalendarEventCreate の型に合わせて変換
      const transformedData: CalendarEventCreate = {
        ...data,
        startDate:
          data.startDate instanceof Date
            ? data.startDate
            : new Date(data.startDate),
        endDate:
          data.endDate instanceof Date ? data.endDate : new Date(data.endDate),
      };

      await handleSubmit(transformedData, selectedEvent);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating/updating event:", error);
    }
  };

  const onDelete = async () => {
    if (selectedEvent) {
      try {
        await handleDelete(selectedEvent);
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading events</div>;

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
