import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, ChevronRight } from "lucide-react";
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

const formSchema = z.object({
  admission_no: z.string().regex(/^\d{6,}$/, {
    message: "Enter a 6 Digit Number",
  }),
});

function GetStudentPage() {
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
    const apiUrl = `http://localhost:8810/get_student_byAdmissionNo/${inputValue}`;
    try {
      // console.log(apiUrl);
      const response = await axios.get(apiUrl);
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
    <div className="h-screen flex flex-col gap-6 justify-center items-center">
      <h2 className="scroll-m-20 text-3xl font-bold tracking-tight text-balance">
        Search for Student
      </h2>
      <Form {...form}>
        <form
          className="w-2/3 space-y-3"
          onSubmit={form.handleSubmit(onSubmitHandler)}
        >
          <FormField
            control={form.control}
            name="admission_no"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 justify-center items-center ">
                <FormLabel className="text-xl">
                  Search with Admission Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Admission Number"
                    className="max-w-3xs mb-3"
                    type="text"
                    {...field}
                  />
                </FormControl>
                {studentData ? (
                  <Card
                    key={studentData.id}
                    className="w-90 h-80 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                  >
                    <CardHeader>
                      <img
                        className="justify-center"
                        src={
                          studentData.photo_url
                            ? studentData.photo_url
                            : studentData.gender === "F"
                            ? "/f_icon.png"
                            : "/m_icon.png"
                        }
                        alt={`${studentData.first_name} ${studentData.last_name} Photo`}
                        height={100}
                        width={100}
                      />
                      <CardTitle>
                        {`${studentData.first_name} ${studentData.middle_name} ${studentData.last_name}`}
                      </CardTitle>
                      <CardDescription>
                        Mob: {studentData.contact_number}
                      </CardDescription>
                      <CardAction>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="top-2 right-2"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <p>{studentData.admission_no}</p>
                      <p className="read-the-docs">
                        {studentData.gender === "M" ? "Male" : "Female"}
                      </p>
                      <p className="read-the-docs">
                        DOB:
                        {
                          new Date(studentData.d_o_b)
                            .toISOString()
                            .split("T")[0]
                        }
                      </p>
                      <p className="read-the-docs">
                        DOA:
                        {
                          new Date(studentData.date_of_admission)
                            .toISOString()
                            .split("T")[0]
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <FormDescription>
                    Non-active students can only be searched!
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit">Search</Button>
          </div>
        </form>
      </Form>
      <Button variant="outline" asChild>
        <Link to={`/${import.meta.env.VITE_ALL_STUDENT_URL}`}>
          All Students
          <ChevronRight />
        </Link>
      </Button>
    </div>
  );
}

export default GetStudentPage;
