import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  CalendarEvent,
  CalendarEventFormData,
  CalendarEventCreate,
} from "@/app/types/event";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { ensureDate } from "@/app/utils/date";

interface EventFormProps {
  initialData?: CalendarEvent;
  onSubmit: (data: CalendarEventCreate, eventId?: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function EventForm({ initialData, onSubmit, onDelete }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitialValues = () => {
    if (!initialData) return { allDay: false };

    return {
      title: initialData.title,
      description: initialData.description,
      startDate: ensureDate(initialData.startDate).toISOString().slice(0, 16),
      endDate: ensureDate(initialData.endDate).toISOString().slice(0, 16),
      allDay: initialData.allDay,
    };
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CalendarEventFormData>({
    defaultValues: getInitialValues(),
  });

  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleSubmitForm = async (data: CalendarEventFormData) => {
    setIsSubmitting(true);
    try {
      const formattedData: CalendarEventCreate = {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        allDay: data.allDay,
      };

      // Pass the eventId if we're updating an existing event
      await onSubmit(formattedData, initialData?.id);
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error; // Re-throw the error to be handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Input id="description" {...register("description")} />
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="allDay"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="allDay"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label htmlFor="allDay" className="text-sm font-medium">
          All Day Event
        </label>
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium mb-1">
          Start Date
        </label>
        <Input
          id="startDate"
          type="datetime-local"
          {...register("startDate", { required: "Start date is required" })}
        />
        {errors.startDate && (
          <p className="text-red-500 text-sm">{errors.startDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium mb-1">
          End Date
        </label>
        <Input
          id="endDate"
          type="datetime-local"
          {...register("endDate", { required: "End date is required" })}
        />
        {errors.endDate && (
          <p className="text-red-500 text-sm">{errors.endDate.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            Delete
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
