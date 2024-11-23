import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { EventForm } from '@/app/components/calendar/EventForm';
import type { CalendarEvent, CalendarEventFormData } from '@/app/types/event';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent;
  onSubmit: (data: CalendarEventFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function EventDialog({
  isOpen,
  onClose,
  event,
  onSubmit,
  onDelete,
}: EventDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'Create Event'}
          </DialogTitle>
        </DialogHeader>
        <EventForm
          initialData={event}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      </DialogContent>
    </Dialog>
  );
}