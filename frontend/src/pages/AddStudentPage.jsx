import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import axios from "axios";

function AddStudentPage() {
  const [studentDetails, setStudentDetails] = useState({
    admission_no: null,
    date_of_admission: null,
    first_name: "",
    middle_name: "",
    mother_name: "",
    last_name: "",
    d_o_b: "",
    gender: "",
    contact_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    disability: null,
  });
  const [openAdmissionDate, setOpenAdmissionDate] = useState(false);
  const [openDateOfBirth, setOpenDateOfBirth] = useState(false);
  const [admissionDate, setAdmissionDate] = useState(undefined);
  const [dateOfBirth, setDateOfBirth] = useState(undefined);

  function handleInput(e) {
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [e.target.id]: e.target.value,
    }));
  }
  function handleDropdownValueSelect(value, dropdownType) {
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [dropdownType]: value,
    }));
  }

  async function handleAddStudent(e) {
    e.preventDefault();
    // console.log(
    //   new Date(),
    //   " INFO ",
    //   "AddStudentPage | handleAddStudent | Request =>> ",
    //   studentDetails
    // );
    try {
      const apiUrl = "http://localhost:8810/add_student";
      const response = await axios.post(apiUrl, studentDetails);
      alert("SUCCESS! " + response.data);
    } catch (error) {
      console.log(
        new Date(),
        " ERROR ",
        "AddStudentPage | handleAddStudent | Exception =>> ",
        error
      );
      alert("ERROR! " + error.response.data.error);
    }
  }

  return (
    <div className="h-screen flex flex-col gap-1 justify-center items-center">
      <h2>Add Student Admission</h2>
      <div className="flex flex-row gap-3">
        <Label htmlFor="admission_no" className="w-[11.2rem] px-1">
          Admission No.:
        </Label>
        <Input
          onChange={handleInput}
          type="text"
          id="admission_no"
          placeholder="Admission No."
        />
      </div>{" "}
      <div className="flex flex-row gap-3">
        <Label htmlFor="date_of_admission" className="px-1">
          Date of Admission:
        </Label>
        <Popover open={openAdmissionDate} onOpenChange={setOpenAdmissionDate}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date_of_admission"
              className="w-[7rem] justify-between font-normal"
            >
              {admissionDate
                ? admissionDate.toISOString().split("T")[0]
                : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={admissionDate}
              captionLayout="dropdown"
              onSelect={(admissionDate) => {
                setAdmissionDate(admissionDate);
                // console.log(admissionDate.toISOString().split("T")[0]);
                handleDropdownValueSelect(
                  admissionDate.toISOString().split("T")[0],
                  "date_of_admission"
                );
                setOpenAdmissionDate(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="first_name" className="w-[11.2rem] px-1">
          First Name:
        </Label>
        <Input
          onChange={handleInput}
          type="text"
          id="first_name"
          placeholder="First Name"
        />
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="middle_name" className="w-[11.2rem] px-1">
          Middle Name:
        </Label>
        <Input
          onChange={handleInput}
          type="text"
          id="middle_name"
          placeholder="Middle Name"
        />
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="mother_name" className="w-[11.2rem] px-1">
          Name of Mother:
        </Label>
        <Input
          onChange={handleInput}
          type="text"
          id="mother_name"
          placeholder="Mother Name"
        />
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="last_name" className="w-[11.2rem] px-1">
          Last Name:
        </Label>
        <Input
          onChange={handleInput}
          type="text"
          id="last_name"
          placeholder="Last Name"
        />
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="gender" className="no-warp px-1">
          Gender:
        </Label>
        <Select
          onValueChange={(value) => {
            handleDropdownValueSelect(value, "gender");
          }}
        >
          <SelectTrigger className="w-[8.5rem]">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup id="gender">
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
              <SelectItem value="O">Others</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="d_o_b" className="px-1">
          Date of Birth:
        </Label>
        <Popover open={openDateOfBirth} onOpenChange={setOpenDateOfBirth}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="d_o_b"
              className="w-[7rem] justify-between font-normal"
            >
              {dateOfBirth
                ? dateOfBirth.toISOString().split("T")[0]
                : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={dateOfBirth}
              captionLayout="dropdown"
              onSelect={(dateOfBirth) => {
                setDateOfBirth(dateOfBirth);
                // console.log(dateOfBirth.toISOString().split("T")[0]);
                handleDropdownValueSelect(
                  dateOfBirth.toISOString().split("T")[0],
                  "d_o_b"
                );
                setOpenDateOfBirth(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="contact_number" className="no-warp px-1">
          Contact Number:
        </Label>
        <Input
          onChange={handleInput}
          id="contact_number"
          className="w-[10rem]"
          placeholder="Contact Number"
        />
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="disability" className="no-warp px-1">
          Disability:
        </Label>
        <Select
          onValueChange={(value) =>
            handleDropdownValueSelect(value, "disability")
          }
        >
          <SelectTrigger className="w-[8.5rem]">
            <SelectValue placeholder="Disability" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup id="disability">
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="Visual">Visual</SelectItem>
              <SelectItem value="Hearing">Hearing</SelectItem>
              <SelectItem value="Learning">Learning</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="address" className="no-warp px-1">
          Address:
        </Label>
        <Input
          onChange={handleInput}
          id="address"
          className="w-[20rem]"
          placeholder="Address"
        />
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="city" className="no-warp px-1">
          City:
        </Label>
        <Input
          onChange={handleInput}
          id="city"
          className="w-[10rem]"
          placeholder="City"
        />
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="state" className="no-warp px-1">
          State:
        </Label>
        <Input
          onChange={handleInput}
          id="state"
          className="w-[10rem]"
          placeholder="State"
        />
      </div>
      <div className="flex flex-row gap-3">
        <Label htmlFor="pincode" className="no-warp px-1">
          Pincode:
        </Label>
        <Input
          onChange={handleInput}
          id="pincode"
          className="w-[10rem]"
          placeholder="Pincode"
        />
      </div>
      <Button type="submit" onClick={handleAddStudent}>
        Add Student
      </Button>
      <Button variant="link" asChild>
        <Link to="/">Go Back</Link>
      </Button>
    </div>
  );
}

export default AddStudentPage;
