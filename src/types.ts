import { Field, LinkModel } from '@grafana/data';
import dayjs from 'dayjs';

export interface CalendarOptions {
  autoScroll: boolean;
  timeField?: string;
  descriptionField?: string;
  endTimeField?: string;
  textField?: string;
  labelFields?: string[];
  quickLinks?: boolean;
}

export interface CalendarEvent {
  text: string;
  start: dayjs.Dayjs;
  end?: dayjs.Dayjs;
  description?: string;
  labels?: string[];
  color: string;
  links?: Array<LinkModel<Field>>;
}
