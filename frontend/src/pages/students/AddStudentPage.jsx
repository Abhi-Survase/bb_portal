import * as React from "react";
import { Link } from "react-router";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Search,
  TrendingDown,
  Bell,
  GraduationCap,
  FileText,
  Settings,
  ChevronRight,
  TrendingUp,
  MoreHorizontal,
  List,
  Edit,
  Moon,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle.tsx";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import axios from "axios";

const addSTudentFormSchema = z.object({
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
  parent_email: z.string().email({
    message: "Please enter a valid email address.",
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
  pincode: z
    .string()
    .regex(/^\d{6}$/, {
      message: "Pincode must be exactly 6 digits.",
    })
    .default("400701"),
  disability: z.string().default("None"),
});

function AddStudentPage() {
  // const [studentDetails, setStudentDetails] = useState({});
  const form = useForm({
    resolver: zodResolver(addSTudentFormSchema),
    mode: "onBlur",
    defaultValues: {
      admission_no: "",
      // date_of_admission: new Date().toISOString().split("T")[0],
      date_of_admission: "",
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
    },
  });

  // function onSubmit(formInputData) {
  //   console.log("Submitting form...", formInputData);
  // }

  async function handleAddStudent(filledStudentDetails) {
    const loadingToastAfterSubmit = toast.loading("Processing...");
    const studentDataPayload = {
      ...filledStudentDetails,
      date_of_admission: format(
        filledStudentDetails.date_of_admission,
        "yyyy-MM-dd HH:mm",
      ),
      date_of_birth: format(filledStudentDetails.date_of_birth, "yyyy-MM-dd"),
    };
    console.log(
      new Date(),
      " INFO ",
      "AddStudentPage | handleAddStudent | Request =>> ",
      studentDataPayload,
    );

    try {
      const apiUrl = import.meta.env.VITE_ADD_STUDENT_API;
      const response = await axios.post(apiUrl, studentDataPayload);
      // alert("SUCCESS! " + response.data);
      toast.dismiss(loadingToastAfterSubmit);
      toast.success(response.data.message);
      console.log(
        new Date(),
        "INFO",
        "AddStudentPage | handleAddStudent | Response =>>",
        response.data,
      );
      form.reset();
    } catch (error) {
      console.log(
        new Date(),
        " ERROR ",
        "AddStudentPage | handleAddStudent | Exception =>>",
        error,
      );
      // alert("ERROR! " + error.response.data.error);
      toast.dismiss(loadingToastAfterSubmit);
      toast.error(error.response.data.error);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold --foreground flex items-center gap-4">
          <SidebarTrigger />
          Add Student Admission
        </h1>
        <div className="flex items-center gap-4">
          {/* Global Search Bar (Replaces 'Find Student' Page) */}
          <div className="relative hidden sm:block group">
            <Link
              to={`/${import.meta.env.VITE_ALL_STUDENT_URL}/${
                import.meta.env.VITE_FIND_STUDENT_URL
              }`}
            >
              <Button variant="muted_outline">
                <Search size={16} />
                Search Students
              </Button>
            </Link>
          </div>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback className="bg-rose-100  text-rose-700 ">
                    BP
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-red-700 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Toaster />
      <div className="space-y-6 p-4 max-w-6xl">
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
                  name="date_of_birth"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-add-student-date_of_birth">
                        Date of Birth
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="form-add-student-date_of_birth"
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
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Parent & Contact Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="father_name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-add-student-father_name">
                        Father Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-father_name"
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
                  name="parent_contact_number"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-add-student-parent_contact_number">
                        Primary Contact Number
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-parent_contact_number"
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
                      <FieldLabel htmlFor="form-add-student-parent_email">
                        Parent Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-student-parent_email"
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
            <CardHeader>
              <CardTitle>Residential Address</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="permanent_address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="md:col-span-2"
                    >
                      <FieldLabel htmlFor="form-add-permanent-address">
                        Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-add-permanent-address"
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
