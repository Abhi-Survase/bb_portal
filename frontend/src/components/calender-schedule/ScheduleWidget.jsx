import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Dummy data: Grouped by day, similar to how an Agenda view works
const schedule_data = [
  {
    date: "2026-01-13",
    dayMonth: "Jan",
    dayName: "Wed",
    dayNumber: "13",
    events: [
      { id: 1, time: "9:00 AM", title: "Past Event", color: "bg-gray-400" },
    ],
  },
  {
    date: "2026-01-14",
    dayMonth: "Jan",
    dayName: "Thu",
    dayNumber: "14",
    events: [
      { id: 1, time: "9:00 AM", title: "Past Event", color: "bg-gray-400" },
    ],
  },
  {
    date: "2026-01-15",
    dayMonth: "Jan",
    dayName: "Fri",
    dayNumber: "15",
    events: [
      { id: 1, time: "9:00 AM", title: "Past Event", color: "bg-gray-400" },
    ],
  },
  {
    date: "2026-03-16",
    dayMonth: "Mar",
    dayName: "Mon",
    dayNumber: "16",
    events: [
      { id: 1, time: "10:00 AM", title: "Team Standup", color: "bg-blue-500" },
      {
        id: 2,
        time: "1:30 PM",
        title: "Design Review",
        color: "bg-purple-500",
      },
    ],
  },
  {
    date: "2026-03-17",
    dayMonth: "Mar",
    dayName: "Tue",
    dayNumber: "17",
    events: [
      { id: 3, time: "9:00 AM", title: "Client Pitch", color: "bg-green-500" },
      {
        id: 4,
        time: "All Day",
        title: "Company Holiday",
        color: "bg-yellow-500",
      },
    ],
  },
  {
    date: "2026-03-18",
    dayMonth: "Mar",
    dayName: "Wed",
    dayNumber: "18",
    events: [
      {
        id: 5,
        time: "3:00 PM",
        title: "Backend API Sync",
        color: "bg-blue-500",
      },
    ],
  },
  {
    date: "2026-03-19",
    dayMonth: "Mar",
    dayName: "Thu",
    dayNumber: "19",
    events: [
      {
        id: 6,
        time: "3:00 PM",
        title: "Backend API Sync",
        color: "bg-blue-500",
      },
    ],
  },
  {
    date: "2026-03-20",
    dayMonth: "Mar",
    dayName: "Fri",
    dayNumber: "20",
    events: [
      {
        id: 7,
        time: "3:00 PM",
        title: "Backend API Sync",
        color: "bg-blue-500",
      },
    ],
  },
];

export default function ScheduleWidget() {
  const [scheduleData, setScheduleData] = useState(schedule_data);
  const todayRef = useRef(null);
  // const todayString = new Date().toISOString().split("T")[0];
  const todayString = "2026-03-16";
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);
  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Upcoming Schedule</CardTitle>
      </CardHeader>

      {scheduleData.length === 0 ? (
        <Skeleton className="h-[17rem] px-6 pb-6 !mx-6" />
      ) : (
        <CardContent className="p-0">
          <ScrollArea className="h-[17rem] px-6 pb-6">
            <div className="flex flex-col gap-4 mt-2">
              {scheduleData.map((dayGroup, index) => {
                const isToday = dayGroup.date === todayString;
                return (
                  <div
                    key={dayGroup.date}
                    ref={isToday ? todayRef : null}
                    className="scroll-mt-3" // Adds a little padding so it doesn't stick perfectly to the top edge
                  >
                    {/* Day Row */}
                    <div className="flex gap-6">
                      {/* Left Column: Date */}
                      <div className="flex flex-col items-center w-10 pt-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">
                          {dayGroup.dayName}
                        </span>
                        <span className="text-xl font-light text-foreground">
                          {dayGroup.dayNumber}
                        </span>
                        <span className="text-sm font-light text-foreground">
                          {dayGroup.dayMonth}
                        </span>
                      </div>

                      {/* Right Column: Events */}
                      <div className="flex-1 flex flex-col gap-3">
                        {dayGroup.events.map((event) => (
                          <div
                            key={event.id}
                            className="flex gap-3 items-start group cursor-pointer"
                          >
                            {/* Event Color Dot */}
                            <div
                              className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${event.color}`}
                            />

                            {/* Event Details */}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors">
                                {event.title}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {event.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Separator between days (except the last one) */}
                    {index < scheduleData.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
