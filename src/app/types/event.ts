export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// フォーム入力用の型
export interface CalendarEventFormData {
  title: string;
  description?: string;
  startDate: string;  // datetime-local input用
  endDate: string;    // datetime-local input用
  allDay: boolean | string;  // checkbox input用
}

// APIに送信するデータの型
export interface CalendarEventCreate {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
}