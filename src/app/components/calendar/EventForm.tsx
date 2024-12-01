import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarEvent,CalendarEventFormData, CalendarEventCreate } from "@/app/types/event";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { get } from "http";

interface EventFormProps {
  initialData?: CalendarEvent;
  onSubmit: (data: CalendarEventCreate) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function EventForm({ initialData, onSubmit, onDelete }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 初期値の設定を修正
  const getInitialValues = () => {
    if (!initialData) return { allDay: false };

    return {
      title: initialData.title,
      description: initialData.description,
      startDate: initialData.startDate.toISOString().slice(0, 16),
      endDate: initialData.endDate.toISOString().slice(0, 16),
      allDay: initialData.allDay
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalendarEventFormData>({
    defaultValues: getInitialValues(),
  });

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
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
        allDay: data.allDay === true || data.allDay === "on",
      };
      await onSubmit(formattedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <Input
          id="title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <Input id="description" {...register("description")} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="allDay" {...register("allDay")} />
        <label htmlFor="allDay">All Day Event</label>
      </div>

      <div>
        <label htmlFor="startDate">Start Date</label>
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
        <label htmlFor="endDate">End Date</label>
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
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}