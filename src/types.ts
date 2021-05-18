import dayjs from 'dayjs';

export interface CalendarOptions {
  timeField?: string;
  descriptionField?: string;
  endTimeField?: string;
  textField?: string;
  labelFields?: string[];
}

export interface CalendarEvent {
  text: string;
  start: dayjs.Dayjs;
  end?: dayjs.Dayjs;
  description?: string;
  labels?: string[];
  open: boolean;
}
