import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axiosInstance from "../../utils/axiosInstance";

const COLOR_OPTIONS = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-gray-400", label: "Gray" },
];

const eventSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(255),
    description: z.string().trim().max(1000).optional(),
    event_date: z.string().min(1, "Date is required"),
    is_all_day: z.boolean().default(false),
    event_time: z.string().optional(),
    color: z.string().default("bg-blue-500"),
  })
  .refine((data) => data.is_all_day || !!data.event_time, {
    message: "Pick a time, or mark this as an all-day event",
    path: ["event_time"],
  });

export default function AddEventDialog({
  open,
  onOpenChange,
  defaultDate,
  onCreated,
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      event_date: defaultDate || "",
      is_all_day: false,
      event_time: "",
      color: "bg-blue-500",
    },
  });

  const isAllDay = watch("is_all_day");

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        description: "",
        event_date: defaultDate || "",
        is_all_day: false,
        event_time: "",
        color: "bg-blue-500",
      });
    }
  }, [open, defaultDate, reset]);

  const onSubmit = async (values) => {
    try {
      const apiUrl = import.meta.env.VITE_CALENDAR_ADD_EVENT_API;
      const response = await axiosInstance.post(apiUrl, values);
      toast.success("Event added");
      onCreated?.(response.data.data);
      onOpenChange(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Couldn't add that event");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Team Standup"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Optional details"
              className="border-input placeholder:text-muted-foreground flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event_date">Date</Label>
              <Input id="event_date" type="date" {...register("event_date")} />
              {errors.event_date && (
                <p className="text-xs text-destructive">
                  {errors.event_date.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event_time">Time</Label>
              <Input
                id="event_time"
                type="time"
                disabled={isAllDay}
                {...register("event_time")}
              />
              {errors.event_time && (
                <p className="text-xs text-destructive">
                  {errors.event_time.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is_all_day"
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              {...register("is_all_day")}
            />
            <Label htmlFor="is_all_day" className="font-normal">
              All-day event
            </Label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Color</Label>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${opt.value}`}
                          />
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
