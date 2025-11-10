import * as React from "react";
import { Link } from "react-router";
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
import { CalendarIcon, ArrowLeftIcon } from "lucide-react";
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
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import axios from "axios";

const formSchema = z.object({
  admission_no: z.string().regex(/^\d{6,}$/, {
    message: "Must be at least 6 digits and contain only numbers.",
  }),
  date_of_admission: z.coerce.date({
    required_error: "A date of admission is required.",
  }),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  middle_name: z.string().optional(),
  mother_name: z.string().optional(),
  last_name: z.string().optional(),
  gender: z.string({
    required_error: "Please select child's gender at birth.",
  }),
  d_o_b: z.coerce.date({
    required_error: "A date of birth is required.",
  }),
  contact_number: z.string().regex(/^\d{10,}$/, {
    message: "Contact Number must be 10 digits.",
  }),
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
  pincode: z.string().regex(/^\d{6}$/, {
    message: "Pincode must be exactly 6 digits.",
  }),
  disability: z.string().default("None"),
});

function AddStudentPage() {
  // const [studentDetails, setStudentDetails] = useState({});
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      admission_no: "",
      // date_of_admission: new Date().toISOString().split("T")[0],
      date_of_admission: "",
      first_name: "",
      middle_name: "",
      mother_name: "",
      last_name: "",
      gender: "",
      d_o_b: "",
      contact_number: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      disability: "None",
    },
  });

  // function onSubmit(formInputData) {
  //   console.log("Submitting form...", formInputData);
  // }

  async function handleAddStudent(filledStudentDetails) {
    // toast.loading("Processing...");
    // console.log(
    //   new Date(),
    //   " INFO ",
    //   "AddStudentPage | handleAddStudent | Request =>> ",
    //   studentDetails
    // );
    const studentDataPayload = {
      ...filledStudentDetails,
      date_of_admission: format(
        filledStudentDetails.date_of_admission,
        "yyyy-MM-dd HH:mm"
      ),
      d_o_b: format(filledStudentDetails.d_o_b, "yyyy-MM-dd"),
    };

    try {
      const apiUrl = "http://localhost:8810/add_student";
      const response = await axios.post(apiUrl, studentDataPayload);
      // alert("SUCCESS! " + response.data);
      toast.success(response.data);
      form.reset();
    } catch (error) {
      console.log(
        new Date(),
        " ERROR ",
        "AddStudentPage | handleAddStudent | Exception =>> ",
        error
      );
      // alert("ERROR! " + error.response.data.error);
      toast.error(error.response.data.error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Toaster />
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Add Student Admission
        </h2>
        <form
          id="form-add-student"
          onSubmit={form.handleSubmit(handleAddStudent)}
          className="space-y-8"
          // onSubmit={form.handleSubmit(onSubmit, (errors) => {
          //   console.log("Validation errors", errors);
          // })}
        >
          <Card>
            <CardHeader>
              <CardTitle>Admission Details</CardTitle>
              <CardDescription>
                Enter the student's official admission information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="admission_no"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-add-student-admission_no">
                          Admission Number
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-add-student-admission_no"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g. 000000"
                          autoComplete="on"
                        />
                        <FieldDescription htmlFor="form-add-student-admission_no">
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
                        <FieldLabel htmlFor="form-add-student-date_of_admission">
                          Date of Admission
                        </FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="form-add-student-date_of_admission"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
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
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Student's Personal Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="first_name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-add-student-first_name">
                        First Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-first_name"
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
                      <FieldLabel htmlFor="form-add-student-last_name">
                        Last Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-last_name"
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
                  name="d_o_b"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-add-student-d_o_b">
                        Date of Birth
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="form-add-student-d_o_b"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
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
                      <FieldLabel htmlFor="form-add-student-gender">
                        Gender
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        initialFocus
                      >
                        <SelectTrigger id="form-add-student-gender">
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
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-add-student-disability">
                        Disability
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="form-add-student-disability">
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
          </Card>{" "}
          <Card>
            <CardHeader>
              <CardTitle>Parent & Contact Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="middle_name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-add-student-middle_name">
                        Father Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-middle_name"
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
                      <FieldLabel htmlFor="form-add-student-mother_name">
                        Mother Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-mother_name"
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
                  name="contact_number"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-add-student-contact_number">
                        Primary Contact Number
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-contact_number"
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
              </FieldGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Residential Address</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="md:col-span-2"
                    >
                      <FieldLabel htmlFor="form-add-student-address">
                        Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-address"
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
                      <FieldLabel htmlFor="form-add-student-city">
                        City
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-city"
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
                      <FieldLabel htmlFor="form-add-student-state">
                        State
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-state"
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
                      <FieldLabel htmlFor="form-add-student-pincode">
                        Pincode:
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-pincode"
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
        <Field orientation="horizontal" className="flex justify-end">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              form.reset();
              toast.warning("Details Cleared");
            }}
            disabled={form.formState.isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" form="form-add-student">
            {form.formState.isSubmitting ? "Submitting..." : "Add Student"}
          </Button>
        </Field>
      </div>
    </div>
  );
}

export default AddStudentPage;
