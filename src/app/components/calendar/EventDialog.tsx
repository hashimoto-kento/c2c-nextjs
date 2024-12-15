"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { EventForm } from "./EventForm";
import { CalendarEvent, CalendarEventCreate } from "@/app/types/event";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onSubmit: (data: CalendarEventCreate) => Promise<void>;
  onDelete?: () => Promise<void>;
  isSubmitting?: boolean; // 追加
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
          <DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
        </DialogHeader>
        <EventForm
          initialData={event || undefined} // nullの場合はundefinedに変換
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      </DialogContent>
    </Dialog>
  );
}
