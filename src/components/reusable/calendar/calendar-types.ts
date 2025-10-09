export type CalendarProps = {
  events: CalendarEvent[];
  setEvents: (_events: CalendarEvent[]) => void;
  mode: Mode;
  setMode: (_mode: Mode) => void;
  date: Date;
  setDate: (_date: Date) => void;
  calendarIconIsToday?: boolean;
};

export type CalendarContextType = CalendarProps & {
  newEventDialogOpen: boolean;
  setNewEventDialogOpen: (_open: boolean) => void;
  manageEventDialogOpen: boolean;
  setManageEventDialogOpen: (_open: boolean) => void;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (_event: CalendarEvent | null) => void;
};
export type CalendarEvent = {
  id: string;
  title: string;
  color: string;
  start: Date;
  end: Date;
};

export const calendarModes = ["day", "week", "month"] as const;
export type Mode = (typeof calendarModes)[number];
