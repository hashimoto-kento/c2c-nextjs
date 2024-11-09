import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EventFormData } from '../../types/event';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function EventForm({ initialData, onSubmit, onDelete }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EventFormData>({
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      setValue('startDate', initialData.startDate);
      setValue('endDate', initialData.endDate);
      setValue('description', initialData.description || '');
      setValue('allDay', initialData.allDay || false);
    }
  }, [initialData, setValue]);

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
    }
  };

  const handleSubmitForm = async (data: EventFormData) => {
    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <Input id="title" {...register('title', { required: 'Title is required' })} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <Input id="description" {...register('description')} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="allDay"
          {...register('allDay')}
        />
        <label htmlFor="allDay">All Day Event</label>
      </div>

      <div>
        <label htmlFor="startDate">Start Date</label>
        <Input
          id="startDate"
          type="datetime-local"
          {...register('startDate', { required: 'Start date is required' })}
        />
        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
      </div>

      <div>
        <label htmlFor="endDate">End Date</label>
        <Input
          id="endDate"
          type="datetime-local"
          {...register('endDate', { required: 'End date is required' })}
        />
        {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        {onDelete && (
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
}