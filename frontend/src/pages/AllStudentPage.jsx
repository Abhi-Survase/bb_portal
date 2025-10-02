import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil } from "lucide-react";

function AllStudentPage() {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllStudentData = async () => {
      try {
        const apiUrl = "http://localhost:8810/all_active_students";
        setLoading(true);
        const response = await axios.get(apiUrl);
        setStudentData(response.data);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStudentData();
  }, []);
  // async function fetchStudentData() {
  //   // const apiUrl = "https://jsonplaceholder.typicode.com/users";
  //   try {
  //     const apiUrl = "http://localhost:8810/all_active_students";
  //     setLoading(true);
  //     const response = await axios.get(apiUrl);
  //     setStudentData(response.data);
  //     // console.log(response.data);
  //   } catch (err) {
  //     console.error(err.message);
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  return (
    <div>
      <div className="relative flex items-center my-6">
        <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl">
          Active Students
        </h2>
        <div className="ml-auto mr-6">
          <Button variant="outline" asChild>
            <Link to="/">Go Back</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
        {studentData.map((data) => (
          // <div className="p-[1rem]" key={data.id}>
          //   {
          //     <img
          //       className="justify-center"
          //       src={
          //         data.photo_url
          //           ? data.photo_url
          //           : data.gender === "F"
          //           ? "/f_icon.png"
          //           : "/m_icon.png"
          //       }
          //       alt={
          //         data.first_name +
          //         " " +
          //         data.middle_name +
          //         " " +
          //         data.last_name +
          //         " " +
          //         "Photo"
          //       }
          //       height={100}
          //       width={100}
          //     />
          //   }
          //   <h3>
          //     {data.first_name + " " + data.middle_name + " " + data.last_name}
          //   </h3>
          //   <p>{data.admission_no}</p>
          //   <p className="read-the-docs">
          //     Gender: {data.gender === "M" ? "Male" : "Female"}
          //   </p>
          //   <p className="read-the-docs">
          //     Date of Birth: {new Date(data.d_o_b).toISOString().split("T")[0]}
          //   </p>
          //   <p className="read-the-docs">
          //     Date of Admission:{" "}
          //     {new Date(data.date_of_admission).toISOString().split("T")[0]}
          //   </p>
          // </div>
          <Card key={data.id} className="w-90 h-80 p-6 transition">
            <CardHeader>
              <img
                className="justify-center"
                src={
                  data.photo_url
                    ? data.photo_url
                    : data.gender === "F"
                    ? "/f_icon.png"
                    : "/m_icon.png"
                }
                alt={`${data.first_name} ${data.last_name} Photo`}
                height={100}
                width={100}
              />
              <CardTitle>
                {`${data.first_name} ${data.middle_name} ${data.last_name}`}
              </CardTitle>
              <CardDescription>Mob: {data.contact_number}</CardDescription>
              <CardAction>
                <Button variant="ghost" size="sm" className="top-2 right-2">
                  <Pencil className="w-4 h-4" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>{data.admission_no}</p>
              <p className="read-the-docs">
                {data.gender === "M" ? "Male" : "Female"}
              </p>
              <p className="read-the-docs">
                DOB: {new Date(data.d_o_b).toISOString().split("T")[0]}
              </p>
              <p className="read-the-docs">
                DOA:{" "}
                {new Date(data.date_of_admission).toISOString().split("T")[0]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* <Button onClick={() => fetchStudentData()}>Display Student List</Button> */}
    </div>
  );
}

export default AllStudentPage;
