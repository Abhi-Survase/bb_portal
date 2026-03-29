import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
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
  Pencil,
  List,
  Edit,
  Moon,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
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

const formSchema = z.object({
  admission_no: z.string().regex(/^\d{6,}$/, {
    message: "Enter a 6 Digit Number",
  }),
});

function FindStudentPage() {
  const [studentData, setStudentData] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      admission_no: "",
    },
  });

  async function onSubmitHandler(value) {
    // console.log(value);
    const inputValue = value.admission_no;
    const apiUrl = `${import.meta.env.VITE_FIND_STUDENT_API}/${inputValue}`;
    try {
      const response = await axios.get(apiUrl);
      // console.log(response);
      if (response.data.length === 0) {
        toast.error(`No Student Found for: ${inputValue}`);
      } else {
        setStudentData(response.data[0]);
        // console.log(response.data[0]);
      }
    } catch (error) {
      setStudentData("");
      {
        error.code === "ERR_BAD_REQUEST" || error.code === "ERR_BAD_RESPONSE"
          ? toast.error("No Student Found!")
          : toast.error("Something Went Wrong");
      }
      console.log(error);
    }
  }
  // const dataPlaceHolderText = "Hit Search!";
  // let placeHolderText = "Enter Admission Number";
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-8 border-b bg-background">
        <h1 className="flex items-center gap-4 text-xl font-semibold text-foreground">
          <SidebarTrigger />
          Search for Student
        </h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full bg-rose-100 text-rose-700">
            BP
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-col items-center justify-start flex-1 p-8 pt-20 gap-10">
        {/* --- FORM SECTION --- */}
        <Form {...form}>
          <form
            className="w-full max-w-md space-y-6"
            onSubmit={form.handleSubmit(onSubmitHandler)}
          >
            <FormField
              control={form.control}
              name="admission_no"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center gap-2">
                  <FormLabel className="text-xl">
                    Search with Admission Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Admission Number"
                      className="w-full text-center"
                      type="text"
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
            {/* Buttons grouped logically right under the input */}
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

        {/* --- RESULT CARD SECTION --- */}
        {studentData && (
          <Card className="relative w-full max-w-sm p-6 transition shadow-md rounded-2xl hover:shadow-lg">
            {/* Edit Button positioned absolutely to the card */}
            <CardAction className="absolute top-4 right-4 z-10">
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4" />
              </Button>
            </CardAction>

            <CardHeader className="flex flex-col items-center text-center">
              <img
                className="object-cover w-24 h-24 mb-4 rounded-full"
                src={
                  studentData.photo_url
                    ? studentData.photo_url
                    : studentData.gender === "F"
                      ? "/f_icon.png"
                      : "/m_icon.png"
                }
                alt={`${studentData.first_name} ${studentData.last_name}`}
              />
              <CardTitle className="text-xl">
                {`${studentData.first_name} ${studentData.middle_name || ""} ${studentData.last_name}`}
              </CardTitle>
              <CardDescription>
                Contact: {studentData.contact_number}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Admission No: {studentData.admission_no}
              </p>
              <p>Gender: {studentData.gender === "M" ? "Male" : "Female"}</p>
              <p>
                DOB:{" "}
                {studentData.d_o_b &&
                  new Date(studentData.d_o_b).toISOString().split("T")[0]}
              </p>
              <p>
                DOA:{" "}
                {studentData.date_of_admission &&
                  new Date(studentData.date_of_admission)
                    .toISOString()
                    .split("T")[0]}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default FindStudentPage;
