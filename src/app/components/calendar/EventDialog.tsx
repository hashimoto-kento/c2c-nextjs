import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { EventForm } from './EventForm';
import type { Event, EventFormData } from '../../types/event';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  onSubmit: (data: EventFormData) => Promise<void>;
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