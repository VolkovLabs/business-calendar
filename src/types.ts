import dayjs from 'dayjs';

export interface CalendarOptions {
  timeField?: string;
  endTimeField?: string;
  textField?: string;
}

export interface CalendarEvent {
  label: string;
  start: dayjs.Dayjs;
  end?: dayjs.Dayjs;

  // color: string;
  open: boolean;
}
