import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";

function GetStudentPage() {
  const [inputValue, setInputValue] = useState("");
  const [studentData, setStudentData] = useState("");

  function updateInputtext(e) {
    setInputValue(e.target.value);
  }

  async function searchStudent() {
    const apiUrl = `http://localhost:8810/get_student_byAdmissionNo/${inputValue}`;
    try {
      // console.log(apiUrl);
      const response = await axios.get(apiUrl);
      if (response.data.length === 0) {
        alert(`No student found with this admission number: ${inputValue}`);
      } else {
        // const result = await response.json();
        setStudentData(response.data[0]);
        // console.log(response.data[0]);
      }
    } catch (error) {
      {
        error.code === "ERR_BAD_REQUEST" || error.code === "ERR_BAD_RESPONSE"
          ? alert("Enter valid Admission Number!")
          : alert("Something went wrong");
      }
      // console.log(error);
    }
  }
  const dataPlaceHolderText = "Hit Search!";
  let placeHolderText = "Enter Admission Number";
  return (
    <div className="h-screen flex flex-col gap-1 justify-center items-center">
      <h2>Search for Student</h2>
      <Input
        className="max-w-3xs"
        type="text"
        placeholder={placeHolderText}
        value={inputValue}
        onChange={updateInputtext}
      />
      {studentData ? (
        <div className="p-[1rem]" key={studentData.id}>
          {
            <img
              className="justify-center"
              src={
                studentData.photo_url
                  ? studentData.photo_url
                  : studentData.gender === "F"
                  ? "/f_icon.png"
                  : "/m_icon.png"
              }
              alt={
                studentData.first_name +
                " " +
                studentData.middle_name +
                " " +
                studentData.last_name +
                " " +
                "Photo"
              }
              height={100}
              width={100}
            />
          }
          <h3>
            {studentData.first_name +
              " " +
              studentData.middle_name +
              " " +
              studentData.last_name}
          </h3>
          <p className="read-the-docs">
            Admission No: {studentData.admission_no}
          </p>
          <p className="read-the-docs">
            Gender: {studentData.gender === "M" ? "Male" : "Female"}
          </p>
          <p className="read-the-docs">
            Date of Birth:{" "}
            {new Date(studentData.d_o_b).toISOString().split("T")[0]}
          </p>
          <p className="read-the-docs">
            Date of Admission:{" "}
            {
              new Date(studentData.date_of_admission)
                .toISOString()
                .split("T")[0]
            }
          </p>
        </div>
      ) : (
        dataPlaceHolderText
      )}
      <Button type="submit" onClick={searchStudent}>
        Search
      </Button>
      <Button variant="link" asChild>
        <Link to="/">Go Back</Link>
      </Button>
    </div>
  );
}

export default GetStudentPage;
