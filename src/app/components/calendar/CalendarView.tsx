import React, { useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { CalendarEvent } from "@/app/types/event";
import { set } from "zod";

const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  events: CalendarEvent[];
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}

export function CalendarView({ events, onSelectSlot, onSelectEvent, currentDate, onDateChange }: CalendarViewProps) {
  const [view, setView] = useState(Views.MONTH);

  const handleNavigate = (newDate: Date) => {
    onDateChange(newDate);
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="startDate"
      endAccessor="endDate"
      selectable
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
      view={view}
      onView={setView}
      date={currentDate}
      onNavigate={handleNavigate}
      views={[Views.MONTH, Views.WEEK, Views.DAY]}
      className="h-full"
    />
  );
}