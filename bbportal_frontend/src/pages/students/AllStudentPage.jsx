import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pencil,
  Search,
  UserPlus,
  ArrowLeft,
  ArrowRight,
  ArrowLeftToLine,
  ArrowRightToLine,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserAvatar from "../../components/user-avatar";
import { EditStudentSheet } from "../../components/edit-student-sheet";

import axiosInstance from "../../utils/axiosInstance";

// Same accent cycle used on the dashboard's Recent Admissions table, so a
// student without a photo still gets a distinct, on-brand initials avatar
const avatarPalette = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
];

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

  const [editingAdmissionNo, setEditingAdmissionNo] = useState(null);

  function refreshCurrentPage() {
    setPaginationData((prevData) => ({ ...prevData }));
  }

  useEffect(() => {
    const fetchAllStudentData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_ALL_STUDENT_API;
        setLoading(true);
        // console.log(paginationData);
        const response = await axiosInstance.get(apiUrl, {
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

  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="h-16 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-4">
          <SidebarTrigger />
          All Active Students
        </h1>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {loading && (
          <p className="col-span-full flex justify-center items-center py-65">
            <Spinner className="size-6" />
          </p>
        )}
        {error && (
          <p className="col-span-full text-center text-destructive py-10">
            Error: {error}
          </p>
        )}
        {!loading &&
          !error &&
          studentData.map((data, index) => {
            const colors = avatarPalette[index % avatarPalette.length];
            const initials = `${data.first_name?.[0] ?? ""}${
              data.last_name?.[0] ?? ""
            }`.toUpperCase();
            return (
              <Card key={data.id} className="p-3 !gap-1 transition">
                <CardHeader className="pb-1">
                  <Avatar className="h-[90px] w-[90px] rounded-lg">
                    <AvatarImage
                      src={data.photo_url}
                      alt={`${data.first_name} ${data.last_name} Photo`}
                      className="rounded-lg object-cover"
                    />
                    <AvatarFallback
                      className={`${colors.bg} ${colors.text} rounded-lg text-lg font-semibold`}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <CardAction>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="top-2 right-2 "
                      onClick={() => setEditingAdmissionNo(data.admission_no)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </CardAction>
                  <CardTitle className="text-base">
                    {`${data.first_name} ${data.father_name} ${data.last_name}`}
                  </CardTitle>
                  <p className="text-base">{data.admission_no}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="read-the-docs text-sm">
                    {data.gender === "M" ? "Male" : "Female"}
                  </p>
                  <p className="read-the-docs text-sm">
                    DOB:{" "}
                    {new Date(data.date_of_birth).toISOString().split("T")[0]}
                  </p>
                  <p className="read-the-docs text-sm">
                    DOA:
                    {
                      new Date(data.date_of_admission)
                        .toISOString()
                        .split("T")[0]
                    }
                  </p>
                  <p className="read-the-docs text-sm">
                    Mob: {data.parent_contact_number}
                  </p>
                </CardContent>
              </Card>
            );
          })}
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

      <EditStudentSheet
        admissionNo={editingAdmissionNo}
        onOpenChange={(open) => !open && setEditingAdmissionNo(null)}
        onSuccess={refreshCurrentPage}
      />
    </div>
  );
}

export default AllStudentPage;
