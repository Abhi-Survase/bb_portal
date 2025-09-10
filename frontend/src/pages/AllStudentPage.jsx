import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import axios from "axios";

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
      <h2 className="text-2xl mb-6 text-center">Active Students</h2>

      <div className="h-screen flex gap-1 justify-center items-center">
        {studentData.map((data) => (
          <div className="p-[1rem]" key={data.id}>
            {
              <img
                className="justify-center"
                src={
                  data.photo_url
                    ? data.photo_url
                    : data.gender === "F"
                    ? "/f_icon.png"
                    : "/m_icon.png"
                }
                alt={
                  data.first_name +
                  " " +
                  data.middle_name +
                  " " +
                  data.last_name +
                  " " +
                  "Photo"
                }
                height={100}
                width={100}
              />
            }
            <h3>
              {data.first_name + " " + data.middle_name + " " + data.last_name}
            </h3>
            <p>{data.admission_no}</p>
            <p className="read-the-docs">
              Gender: {data.gender === "M" ? "Male" : "Female"}
            </p>
            <p className="read-the-docs">
              Date of Birth: {new Date(data.d_o_b).toISOString().split("T")[0]}
            </p>
            <p className="read-the-docs">
              Date of Admission:{" "}
              {new Date(data.date_of_admission).toISOString().split("T")[0]}
            </p>
          </div>
        ))}
      </div>
      {/* <Button onClick={() => fetchStudentData()}>Display Student List</Button> */}
      <Button variant="link" className="flex justify-center mt-6" asChild>
        <Link to="/">Go Back</Link>
      </Button>
    </div>
  );
}

export default AllStudentPage;
