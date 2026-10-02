import { useState, useEffect, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday as isTodayFn,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "../../components/user-avatar";
import AddEventDialog from "@/components/calender-schedule/AddEventDialog";
import axiosInstance from "../../utils/axiosInstance";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const now = new Date();
const YEAR_OPTIONS = Array.from(
  { length: 8 },
  (_, i) => now.getFullYear() - 2 + i,
);

function SchoolCalendar() {
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [year, setYear] = useState(now.getFullYear());
  const [eventsByDate, setEventsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDate, setDialogDate] = useState(null);
  const [direction, setDirection] = useState(null); // 'next' | 'prev' | null

  const fetchMonthEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_CALENDAR_ALL_API;
      const response = await axiosInstance.get(apiUrl, {
        params: { month, year },
      });
      setEventsByDate(response.data.data.eventsByDate || {});
    } catch (err) {
      console.log(err);
      setError("Couldn't load events for this month.");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchMonthEvents();
  }, [fetchMonthEvents]);

  const refDate = new Date(year, month - 1, 1);
  const gridStart = startOfWeek(startOfMonth(refDate));
  const gridEnd = endOfWeek(endOfMonth(refDate));
  const gridDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const openAddDialog = (dateKey) => {
    setDialogDate(dateKey);
    setDialogOpen(true);
  };

  const goToPrevMonth = () => {
    setDirection("prev");
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    setDirection("next");
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const weeksCount = gridDays.length / 7;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="h-16 shrink-0 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-4">
          <SidebarTrigger />
          School Calendar
        </h1>
        <div className="flex items-center gap-4">
          <AddEventDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            defaultDate={dialogDate}
            onCreated={fetchMonthEvents}
          />
          <ModeToggle />
          <UserAvatar />
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-3 p-4 md:p-6 min-h-0">
        {/* Month / Year pagination */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className="transition-transform active:scale-90"
          >
            <ChevronLeft size={16} />
          </Button>

          <Select
            value={String(month)}
            onValueChange={(v) => {
              const next = Number(v);
              setDirection(next > month ? "next" : "prev");
              setMonth(next);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((name, idx) => (
                <SelectItem key={name} value={String(idx + 1)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(year)}
            onValueChange={(v) => {
              const next = Number(v);
              setDirection(next > year ? "next" : "prev");
              setYear(next);
            }}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            aria-label="Next month"
            className="transition-transform active:scale-90"
          >
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* Weekday header row */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground uppercase shrink-0">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="py-1.5">
              {d}
            </div>
          ))}
        </div>

        {/* Month grid */}
        {loading ? (
          <Skeleton className="flex-1 w-full" />
        ) : error ? (
          <div className="text-sm text-muted-foreground py-10 text-center">
            {error}
          </div>
        ) : (
          <div
            key={`${year}-${month}`}
            className={`grid grid-cols-7 gap-px bg-border border rounded-lg overflow-hidden flex-1 min-h-0 animate-in fade-in-0 duration-200 ease-out motion-reduce:animate-none ${
              direction === "prev"
                ? "slide-in-from-left-4"
                : direction === "next"
                  ? "slide-in-from-right-4"
                  : ""
            }`}
            style={{
              gridTemplateRows: `repeat(${weeksCount}, minmax(0, 1fr))`,
            }}
          >
            {gridDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const inMonth = isSameMonth(day, refDate);
              const isToday = isTodayFn(day);
              const dayEvents = eventsByDate[dateKey] || [];
              const visibleEvents = dayEvents.slice(0, 3);
              const overflowCount = dayEvents.length - visibleEvents.length;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => openAddDialog(dateKey)}
                  disabled={!inMonth}
                  className={`flex flex-col items-stretch text-left p-1.5 overflow-hidden bg-background transition-colors ${
                    inMonth
                      ? "hover:bg-accent/50 cursor-pointer"
                      : "bg-muted/30 text-muted-foreground/50 cursor-default"
                  }`}
                >
                  <span
                    className={`text-xs mb-0.5 shrink-0 ${
                      isToday
                        ? "inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground font-semibold"
                        : "font-medium text-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  {inMonth && dayEvents.length === 0 && (
                    <span className="text-[10px] text-muted-foreground/60">
                      No events
                    </span>
                  )}

                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {visibleEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-1.5 truncate"
                        title={`${event.title} - ${event.time}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${event.color}`}
                        />
                        <span className="text-[11px] truncate">
                          {event.title}
                        </span>
                      </div>
                    ))}
                    {overflowCount > 0 && (
                      <span className="text-[11px] text-muted-foreground">
                        +{overflowCount} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SchoolCalendar;
