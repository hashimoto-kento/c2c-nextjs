import React, { useState, useEffect } from 'react'; //useStateによりフォームの送信状態を管理、useEffectを使用してinitialDateが変更されたときにフォームフィールドの値を更新
import { useForm } from 'react-hook-form'; //フォームの状態を管理
import { CalendarEventFormData } from '@/app/types/event';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";

interface EventFormProps {
  initialData?: CalendarEventFormData;
  onSubmit: (data: CalendarEventFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function EventForm({ initialData, onSubmit, onDelete }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CalendarEventFormData>({
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

  //削除ボタンがクリックされたときにonDelete関数を呼び出す
  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
    }
  };

  //フォーム送信時に送信状態を更新
  const handleSubmitForm = async (data: CalendarEventFormData) => {
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