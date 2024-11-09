'use client';

import React, { useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { useToast } from "../../components/ui/use-toast";


function MyComponent() {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title: "予約完了",
      description: "予約が正常に完了しました。",
    })
  }

  return <button onClick={handleClick}>予約する</button>
}



const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    allDay: false,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(
        data.map((event: Event) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
        }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    }
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setIsEditMode(false);
    setFormData({
      title: "",
      description: "",
      startDate: start,
      endDate: end,
      allDay: false,
    });
    setIsDialogOpen(true);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditMode(true);
    setFormData({
      title: event.title,
      description: event.description || "",
      startDate: event.startDate,
      endDate: event.endDate,
      allDay: event.allDay,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && selectedEvent) {
        await fetch(`/api/events`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedEvent.id, ...formData }),
        });
      } else {
        await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      await fetchEvents();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: isEditMode ? "Event updated" : "Event created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      await fetch(`/api/events?id=${selectedEvent.id}`, {
        method: "DELETE",
      });

      await fetchEvents();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Event deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="startDate"
        endAccessor="endDate"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        defaultView={Views.MONTH}
        views={["month", "week", "day"]}
        className="h-full"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Event" : "Create Event"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-day"
                checked={formData.allDay}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, allDay: checked as boolean })
                }
              />
              <label htmlFor="all-day">All Day Event</label>
            </div>
            <div>
              <Input
                type="datetime-local"
                value={moment(formData.startDate).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                value={moment(formData.endDate).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive" // Add the variant prop with the value of "destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
              <Button type="submit">{isEditMode ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;