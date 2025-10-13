import { isSameMonth } from "date-fns";
import { useCalendarContext } from "../../calendar-context";

export default function CalendarHeaderDateBadge() {
  const { events, date } = useCalendarContext();
  const monthEvents = events.filter((event) => isSameMonth(event.start, date));

  if (!monthEvents.length) return <></>;
  return (
    <div className="whitespace-nowrap rounded-sm border px-1.5 py-0.5 text-xs">
      {monthEvents.length} events
    </div>
  );
}
