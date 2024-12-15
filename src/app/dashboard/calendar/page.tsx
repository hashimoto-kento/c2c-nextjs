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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectSlot = () => {
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: CalendarEventCreate) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log("Submitting data:", data); // デバッグ用

      // 日付が文字列で来た場合の対応
      const transformedData: CalendarEventCreate = {
        title: data.title,
        description: data.description || "",
        startDate:
          data.startDate instanceof Date
            ? data.startDate
            : new Date(data.startDate),
        endDate:
          data.endDate instanceof Date ? data.endDate : new Date(data.endDate),
        allDay: Boolean(data.allDay),
      };

      console.log("Transformed data:", transformedData); // デバッグ用
      console.log("Selected event:", selectedEvent); // デバッグ用

      const result = await handleSubmit(transformedData, selectedEvent);
      console.log("Submit result:", result); // デバッグ用

      setIsDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error details:", error); // より詳細なエラー情報
      // エラー処理を追加（例：トースト通知など）
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!selectedEvent || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await handleDelete(selectedEvent);
      setIsDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      // エラー処理を追加（例：トースト通知など）
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading events
      </div>
    );

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
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEvent(null);
          setIsSubmitting(false);
        }}
        event={selectedEvent}
        onSubmit={onSubmit}
        onDelete={selectedEvent ? onDelete : undefined}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CalendarPage;
