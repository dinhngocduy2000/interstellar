import { CalendarContext } from "./calendar-context";
import { CalendarEvent, Mode } from "./calendar-types";
import { useState } from "react";
import CalendarNewEventDialog from "./dialog/calendar-new-event-dialog";
import CalendarManageEventDialog from "./dialog/calendar-manage-event-dialog";

export default function CalendarProvider({
  events,
  setEvents,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
  children,
}: {
  events: CalendarEvent[];
  setEvents: (_events: CalendarEvent[]) => void;
  mode: Mode;
  setMode: (_mode: Mode) => void;
  date: Date;
  setDate: (_date: Date) => void;
  calendarIconIsToday: boolean;
  children: React.ReactNode;
}) {
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [manageEventDialogOpen, setManageEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  return (
    <CalendarContext.Provider
      value={{
        events,
        setEvents,
        mode,
        setMode,
        date,
        setDate,
        calendarIconIsToday,
        newEventDialogOpen,
        setNewEventDialogOpen,
        manageEventDialogOpen,
        setManageEventDialogOpen,
        selectedEvent,
        setSelectedEvent,
      }}
    >
      <CalendarNewEventDialog />
      <CalendarManageEventDialog />
      {children}
    </CalendarContext.Provider>
  );
}
