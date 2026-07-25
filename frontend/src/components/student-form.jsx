import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import axiosInstance from "../utils/axiosInstance";

const sectionPalette = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
];

function SectionHeader({ step, title, description }) {
  const colors = sectionPalette[(step - 1) % sectionPalette.length];
  return (
    <CardHeader>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${colors.bg} ${colors.text}`}
        >
          {step}
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}

export const studentFormSchema = z.object({
  admission_no: z.string().regex(/^\d{6,}$/, {
    message: "Must be at least 6 digits and contain only numbers.",
  }),
  date_of_admission: z.coerce.date({
    required_error: "A date of admission is required.",
  }),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  last_name: z.string().optional(),
  gender: z.string({
    required_error: "Please select child's gender at birth.",
  }),
  date_of_birth: z.coerce.date({
    required_error: "A date of birth is required.",
  }),
  parent_contact_number: z.string().regex(/^\d{10,10}$/, {
    message: "Contact Number must be 10 digits.",
  }),
  parent_email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .optional()
    .or(z.literal("")),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  city: z.string().min(2, {
    message: "City name must be at least 2 characters.",
  }),
  state: z
    .string()
    .min(3, {
      message: "State name must be at least 3 characters.",
    })
    .default("Maharashtra"),
  pincode: z
    .string()
    .regex(/^\d{6}$/, {
      message: "Pincode must be exactly 6 digits.",
    })
    .default("400701"),
  disability: z.string().default("None"),
});

const emptyDefaults = {
  admission_no: "",
  date_of_admission: new Date(),
  first_name: "",
  father_name: "",
  mother_name: "",
  last_name: "",
  gender: "",
  date_of_birth: "",
  parent_contact_number: "",
  parent_email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  disability: "None",
};

/*
 * IMPORTANT layout contract: render this inside a wrapper with `p-4` padding
 * (see AddStudentPage.jsx / EditStudentSheet.jsx) - the sticky footer uses
 * `-mx-4` to cancel that padding out so it sits edge-to-edge. If your
 * wrapper's padding value changes, update the footer's `-mx-4` to match.
 *
 * Props:
 * - mode: "add" | "edit" - controls button labels and footer behavior.
 * - defaultValues: partial values to merge over the empty defaults. For "edit", pass the existing student record here
 * - apiUrl: full URL to submit to.
 * - httpMethod: "post" (default for add), "put", or "patch".
 * - buildPayload(values): optional. Shapes the validated form values into the exact request body your API expects. If omitted, a simple default shape is sent as-is.
 * - onSuccess(responseData): called after a successful submit.
 * - onCancel(): called when Cancel/Reset is pressed (for "edit", this should close the sheet)
 */
export function StudentForm({
  mode = "add",
  defaultValues,
  apiUrl,
  httpMethod = mode === "edit" ? "put" : "post",
  buildPayload,
  onSuccess,
  onCancel,
  formId = "student-form",
}) {
  const form = useForm({
    resolver: zodResolver(studentFormSchema),
    mode: "onBlur",
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  async function handleFormSubmit(filledStudentDetails) {
    const loadingToast = toast.loading(
      mode === "edit" ? "Saving changes..." : "Processing...",
    );
    const studentDataPayload = buildPayload
      ? buildPayload(filledStudentDetails)
      : {
          ...filledStudentDetails,
          date_of_admission: format(
            filledStudentDetails.date_of_admission,
            "yyyy-MM-dd HH:mm",
          ),
          date_of_birth: format(
            filledStudentDetails.date_of_birth,
            "yyyy-MM-dd",
          ),
        };

    try {
      const submit =
        httpMethod === "put" ? axiosInstance.put : axiosInstance.post;
      const response = await submit(apiUrl, studentDataPayload);
      toast.dismiss(loadingToast);
      toast.success(response.data.message);
      if (mode === "add") form.reset();
      onSuccess?.(response.data);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.response?.data?.error ?? "Something went wrong");
    }
  }

  return (
    <>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        <Card>
          <SectionHeader
            step={1}
            title="Admission Details"
            description="Enter the student's official admission information."
          />
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="admission_no"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-admission_no`}>
                      Admission Number
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-admission_no`}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. 123456"
                      autoComplete="on"
                    />
                    <FieldDescription htmlFor={`${formId}-admission_no`}>
                      Must be atleast a 6-digit number.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="date_of_admission"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-date_of_admission`}>
                      Date of Admission
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id={`${formId}-date_of_admission`}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <SectionHeader
            step={2}
            title="Student's Personal Details"
            description="Basic identifying information for the student."
          />
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="first_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-first_name`}>
                      First Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-first_name`}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Abh"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="last_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-last_name`}>
                      Last Name{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-last_name`}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Surv"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="date_of_birth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-date_of_birth`}>
                      Date of Birth
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id={`${formId}-date_of_birth`}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Select date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="gender"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-gender`}>Gender</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id={`${formId}-gender`}>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                          <SelectItem value="O">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="disability"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="md:col-span-2"
                  >
                    <FieldLabel htmlFor={`${formId}-disability`}>
                      Disability
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id={`${formId}-disability`}>
                        <SelectValue placeholder="Select Disability if any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Visual">Visual</SelectItem>
                          <SelectItem value="Hearing">Hearing</SelectItem>
                          <SelectItem value="Learning">Learning</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <SectionHeader
            step={3}
            title="Parent & Contact Details"
            description="How we'll reach the family for school communication."
          />
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="father_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-father_name`}>
                      Father Name{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-father_name`}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Xyz"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="mother_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-mother_name`}>
                      Mother Name{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-mother_name`}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Mno"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="parent_contact_number"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-parent_contact_number`}>
                      Primary Contact Number
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-parent_contact_number`}
                      aria-invalid={fieldState.invalid}
                      placeholder="10 Digit Contact Number"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="parent_email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-parent_email`}>
                      Parent Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-parent_email`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Parent Email Id"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <SectionHeader
            step={4}
            title="Residential Address"
            description="Where the student currently resides."
          />
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="md:col-span-3"
                  >
                    <FieldLabel htmlFor={`${formId}-address`}>
                      Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-address`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Flat, House No., Building, Street"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-city`}>City</FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-city`}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g., Navi Mumbai"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="state"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-state`}>State</FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-state`}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g., Maharashtra"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="pincode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-pincode`}>
                      Pincode
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-pincode`}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. 400701"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
      </form>

      <Field
        orientation="horizontal"
        className="sticky bottom-0 -mx-4 flex justify-end gap-3 border-t bg-background/95 px-4 py-4 backdrop-blur"
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (mode === "edit") {
              onCancel?.();
            } else {
              form.reset();
              toast.warning("Details Cleared");
            }
          }}
          disabled={form.formState.isSubmitting}
        >
          {mode === "edit" ? "Cancel" : "Reset"}
        </Button>
        <Button type="submit" form={formId}>
          {form.formState.isSubmitting
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Add Student"}
        </Button>
      </Field>
    </>
  );
}
