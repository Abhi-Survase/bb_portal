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
import {
  Pencil,
  Search,
  ArrowLeft,
  ArrowRight,
  ArrowLeftToLine,
  ArrowRightToLine,
} from "lucide-react";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

function AllStudentPage() {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginationData, setPaginationData] = useState({
    current_page: 1,
    limit: 8,
  });
  const [totalStudentCountANDPages, setTotalStudentCountANDPages] = useState({
    total_student_count: 0,
    total_pages: 1,
  });

  function handlePageChange(newPage) {
    console.log(newPage);
    setPaginationData((prevData) => ({ ...prevData, current_page: newPage }));
  }

  useEffect(() => {
    const fetchAllStudentData = async () => {
      try {
        const apiUrl = `http://localhost:8810/all_active_students`;
        setLoading(true);
        // console.log(paginationData);
        const response = await axios.get(apiUrl, {
          params: {
            page: paginationData.current_page,
            limit: paginationData.limit,
          },
        });
        setTotalStudentCountANDPages({
          total_student_count: response.data.pagination.totalCount,
          total_pages: response.data.pagination.totalPages,
        });
        setStudentData(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStudentData();
  }, [paginationData]);
  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  function handleEditButtonClick() {
    console.log("Edit Button Clicked!");
  }

  return (
    <div className="flex-1 flex flex-col bg-(--background)">
      <header className="h-16 --background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold --foreground flex items-center gap-4 font-bold">
          <SidebarTrigger />
          All Active Students
        </h1>
        <div className="ml-auto mr-6">
          <Button variant="outline" asChild>
            <Link
              to={`/${import.meta.env.VITE_ALL_STUDENT_URL}/${
                import.meta.env.VITE_FIND_STUDENT_URL
              }`}
            >
              <Search />
              Search Student
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {studentData.map((data) => (
          <Card key={data.id} className="p-3 !gap-1 transition">
            <CardHeader className="pb-1">
              <img
                className="mx-start"
                src={
                  data.photo_url
                    ? data.photo_url
                    : data.gender === "F"
                      ? "/f_icon.png"
                      : "/m_icon.png"
                }
                alt={`${data.first_name} ${data.last_name} Photo`}
                height={90}
                width={90}
              />
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  className="top-2 right-2 "
                  onClick={handleEditButtonClick}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </CardAction>
              <CardTitle className="text-base">
                {`${data.first_name} ${data.middle_name} ${data.last_name}`}
              </CardTitle>
              <p className="text-base">{data.admission_no}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="read-the-docs text-sm">
                {data.gender === "M" ? "Male" : "Female"}
              </p>
              <p className="read-the-docs text-sm">
                DOB: {new Date(data.d_o_b).toISOString().split("T")[0]}
              </p>
              <p className="read-the-docs text-sm">
                DOA:
                {new Date(data.date_of_admission).toISOString().split("T")[0]}
              </p>
              <p className="read-the-docs text-sm">
                Mob: {data.contact_number}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ButtonGroup className="px-6 pb-1">
        <ButtonGroup>
          <Button
            disabled={paginationData.current_page <= 1}
            onClick={() => handlePageChange(1)}
            variant="outline"
            size="icon"
            aria-label="First"
          >
            <ArrowLeftToLine />
          </Button>
          <Button
            disabled={paginationData.current_page <= 1}
            onClick={() => handlePageChange(paginationData.current_page - 1)}
            variant="outline"
            size="icon"
            aria-label="Previous"
          >
            <ArrowLeft />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          {Array.from(
            { length: totalStudentCountANDPages.total_pages },
            (_, index) => (
              <Button
                key={index}
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ),
          )}
        </ButtonGroup>
        <ButtonGroup>
          <Input
            className="!w-9 !max-w-max text-center placeholder:text-center"
            aria-label="Enter Page Number"
            type="text"
            placeholder={`${paginationData.current_page}`}
          />
        </ButtonGroup>
        <ButtonGroup>
          <Button
            disabled={
              paginationData.current_page >=
              totalStudentCountANDPages.total_pages
            }
            onClick={() => handlePageChange(paginationData.current_page + 1)}
            variant="outline"
            size="icon"
            aria-label="Next"
          >
            <ArrowRight />
          </Button>
          <Button
            disabled={
              paginationData.current_page >=
              totalStudentCountANDPages.total_pages
            }
            onClick={() =>
              handlePageChange(totalStudentCountANDPages.total_pages)
            }
            variant="outline"
            size="icon"
            aria-label="Last"
          >
            <ArrowRightToLine />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  );
}

export default AllStudentPage;
