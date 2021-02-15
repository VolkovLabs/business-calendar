export interface CalendarOptions {
  timeField?: string;
  textField?: string;
}

export interface Annotation {
  text: string;
  time: number;
  timeEnd: number;
  tags: string[];
}
