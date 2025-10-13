import { isSameDay } from "date-fns";
import { useCalendarContext } from "../../calendar-context";
import CalendarEvent from "../../calendar-event";
import CalendarBodyHeader from "../calendar-body-header";
import { hours } from "./calendar-body-margin-day-margin";

export default function CalendarBodyDayContent({ date }: { date: Date }) {
  const { events } = useCalendarContext();

  const dayEvents = events.filter((event) => isSameDay(event.start, date));

  return (
    <div className="flex flex-grow flex-col">
      <CalendarBodyHeader date={date} />

      <div className="relative flex-1">
        {hours.map((hour) => (
          <div key={hour} className="group h-32 border-border/50 border-b" />
        ))}

        {dayEvents.map((event) => (
          <CalendarEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
