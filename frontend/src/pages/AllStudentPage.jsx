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
import { Pencil, Search } from "lucide-react";

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
  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  function handleEditButtonClick() {}
  return (
    <div className="bg-(--background)">
      <div className="relative flex items-center ">
        <h2 className="absolute left-1/2 -translate-x-1/2 scroll-m-20 text-3xl font-bold tracking-tight text-balance">
          Active Students
        </h2>
        <div className="ml-auto mr-6">
          <Button variant="outline" asChild>
            <Link
              to={`/${import.meta.env.VITE_ALL_STUDENT_URL}/${
                import.meta.env.VITE_FIND_STUDENT_URL
              }`}
            >
              <Search />
              Search
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 p-5">
        {studentData.map((data) => (
          <Card key={data.id} className="w-85 h-75 p-4 transition">
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="top-2 right-2"
                  onClick={handleEditButtonClick}
                >
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
