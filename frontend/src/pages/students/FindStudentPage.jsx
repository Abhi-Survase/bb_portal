import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, ChevronRight, Pencil, List, UserPlus } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserAvatar from "../../components/user-avatar";

import axiosInstance from "../../utils/axiosInstance";

// Same accent cycle used on the dashboard table and the student directory,
// so a result without a photo still gets a distinct, on-brand avatar.
const avatarPalette = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
];

function FindStudentPage() {
  const [studentData, setStudentData] = useState("");
  const [studentSearchParam, setStudentSearchParam] =
    useState("Admission Number");
  const navigateTo = useNavigate();
  const SEARCH_FIELDS = {
    "Admission Number": 0,
    "Date of Admission": 1,
    "First Name": 2,
    "Last Name": 3,
    "Contact Number": 4,
  };

  const dynamicFormSchema = useMemo(() => {
    switch (studentSearchParam) {
      case "Admission Number":
        return z.object({
          searchValue: z
            .string()
            .regex(/^\d{5,}$/, "Enter at least a 5 Digit Number"),
        });
      case "Date of Admission":
        return z.object({
          searchValue: z.string().min(1, "A date of admission is required."),
        });
      case "First Name":
        return z.object({
          searchValue: z.string().min(2, "Must be at least 2 characters."),
        });
      case "Last Name":
        return z.object({
          searchValue: z.string().min(2, "Must be at least 2 characters."),
        });
      case "Contact Number":
        return z.object({
          searchValue: z
            .string()
            .regex(/^\d{10}$/, "Contact Number must be exactly 10 digits."),
        });
      default:
        return z.object({ searchValue: z.string() });
    }
  }, [studentSearchParam]);

  const form = useForm({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: {
      searchValue: "",
    },
  });

  async function onSubmitHandler(value) {
    // console.log(value);
    const inputValue = value.searchValue;
    const apiUrl = `${import.meta.env.VITE_SEARCH_STUDENT_API}?searchParam=${SEARCH_FIELDS[studentSearchParam]}&detailKeyword=${inputValue}`;
    console.log(apiUrl);
    try {
      const response = await axiosInstance.get(apiUrl);
      // console.log(response);
      if (response.data.length === 0) {
        toast.error(`No Student Found for: ${inputValue}`);
      } else {
        setStudentData(response.data);
        // console.log(response.data);
      }
    } catch (error) {
      setStudentData("");
      {
        if (error.message.includes("status code 403")) {
          toast.error("Timeout! Redirecting to login");
          setTimeout(() => {
            navigateTo(`/${import.meta.env.VITE_LOGIN_URL}`);
          }, 1500);
        } else {
          error.code === "ERR_BAD_REQUEST" || error.code === "ERR_BAD_RESPONSE"
            ? toast.error("No Student Found!")
            : toast.error("Something Went Wrong");
        }
      }
      console.log(error.message);
    }
  }
  const handleSearchParamChange = (value) => {
    setStudentSearchParam(value);
    form.reset({ searchValue: "" });
  };
  // const dataPlaceHolderText = "Hit Search!";
  // let placeHolderText = "Enter Admission Number";
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-8 border-b bg-background">
        <h1 className="flex items-center gap-4 text-xl font-semibold text-foreground">
          <SidebarTrigger />
          Search for Student
        </h1>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <Link to={`/${import.meta.env.VITE_ALL_STUDENT_URL}`}>
              <Button variant="muted_outline">
                <List size={16} />
                All Students
              </Button>
            </Link>
            <Link
              to={`/${import.meta.env.VITE_ALL_STUDENT_URL}/${
                import.meta.env.VITE_ADD_STUDENT_URL
              }`}
            >
              <Button variant="muted_outline">
                <UserPlus size={16} />
                Add Student
              </Button>
            </Link>
          </div>
          <ModeToggle />
          <UserAvatar />
        </div>
      </header>

      <main className="flex flex-col items-center justify-start flex-1 p-8 pt-20 gap-10">
        <Form {...form}>
          <form
            className="w-full max-w-md space-y-6"
            onSubmit={form.handleSubmit(onSubmitHandler)}
          >
            <FormField
              control={form.control}
              name="searchValue"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-3 w-full">
                    <FormLabel className=" flex items-center gap-3 text-xl">
                      Search with{" "}
                    </FormLabel>
                    <Select
                      value={studentSearchParam}
                      onValueChange={handleSearchParamChange}
                    >
                      <SelectTrigger className="w-full max-w-48 !text-primary-foreground">
                        <SelectValue placeholder="Admission Number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Admission Number">
                            Admission Number
                          </SelectItem>
                          <SelectItem value="Date of Admission">
                            Date of Admission
                          </SelectItem>
                          <SelectItem value="First Name">First Name</SelectItem>
                          <SelectItem value="Last Name">Last Name</SelectItem>
                          <SelectItem value="Contact Number">
                            Contact Number
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${studentSearchParam}`}
                      className="w-full text-center"
                      type={
                        studentSearchParam === "Date of Admission"
                          ? "date"
                          : "text"
                      }
                      {...field}
                    />
                  </FormControl>
                  {!studentData && (
                    <FormDescription>
                      Non-active students can only be searched!
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 w-full">
              <Button type="submit" className="flex-1">
                Search
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to={`/${import.meta.env.VITE_ALL_STUDENT_URL}`}>
                  All Students
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </form>
        </Form>

        {studentData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {studentData.map((student, index) => {
              const colors = avatarPalette[index % avatarPalette.length];
              const initials = `${student.first_name?.[0] ?? ""}${
                student.last_name?.[0] ?? ""
              }`.toUpperCase();
              return (
                <Card
                  key={student.id}
                  className="relative w-full p-6 transition shadow-md rounded-2xl hover:shadow-lg"
                >
                  <CardAction className="absolute top-4 right-4 z-10">
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </CardAction>

                  <CardHeader className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage
                        src={student.photo_url}
                        alt={`${student.first_name} ${student.last_name}`}
                      />
                      <AvatarFallback
                        className={`${colors.bg} ${colors.text} text-2xl font-semibold`}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">
                      {`${student.first_name} ${student.father_name || ""} ${student.last_name}`}
                    </CardTitle>
                    <CardDescription>
                      Contact: {student.parent_contact_number}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Admission No: {student.admission_no}
                    </p>
                    <p>Gender: {student.gender === "M" ? "Male" : "Female"}</p>
                    <p>
                      DOB:{" "}
                      {student.date_of_birth &&
                        new Date(student.date_of_birth)
                          .toISOString()
                          .split("T")[0]}
                    </p>
                    <p>
                      DOA:{" "}
                      {student.date_of_admission &&
                        new Date(student.date_of_admission)
                          .toISOString()
                          .split("T")[0]}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default FindStudentPage;
