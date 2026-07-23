import * as React from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { StudentForm } from "./student-form";
import axiosInstance from "../utils/axiosInstance";

const avatarPalette = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
];

// GET responses use standard ISO 8601 (e.g. "2020-09-07T18:30:00.000Z") -
// JS's native Date parsing handles that correctly, no custom format needed.
function parseApiDateTime(value) {
  if (!value) return undefined;
  return new Date(value);
}

// The update endpoint expects a different shape on the way back out:
// space-separated, no "T"/"Z", no milliseconds (e.g. "2025-06-18 18:30:00").
function formatApiDateTime(date) {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

/**
 * Controlled by `admissionNo`: pass a student's admission number to open the
 * sheet and fetch their full record; pass null/undefined to keep it closed.
 */
export function EditStudentSheet({ admissionNo, onOpenChange, onSuccess }) {
  const [studentRecord, setStudentRecord] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const latestRequestRef = React.useRef(null);

  const fetchStudent = React.useCallback(async () => {
    if (!admissionNo) return;
    const requestId = admissionNo;
    latestRequestRef.current = requestId;
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${import.meta.env.VITE_GET_STUDENT_BY_ADMISSION_API}/${admissionNo}`;
      const response = await axiosInstance.get(apiUrl);
      // Response is an array (even for a single admission number lookup) -
      // wrapped in { data: [...] } if your other endpoints' convention
      // holds, otherwise a bare array. Either way, we want the first match.
      const record = response.data?.data ?? response.data;
      // Guard: if the person opened a different student's edit sheet before
      // this request resolved, don't let the stale response overwrite it.
      if (latestRequestRef.current === requestId) {
        setStudentRecord(record[0]);
      }
    } catch (err) {
      if (latestRequestRef.current === requestId) {
        setError(
          err?.response?.data?.error ?? "Couldn't load student details.",
        );
      }
    } finally {
      if (latestRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [admissionNo]);

  React.useEffect(() => {
    if (!admissionNo) {
      setStudentRecord(null);
      setError(null);
      return;
    }
    fetchStudent();
  }, [admissionNo, fetchStudent]);

  const open = Boolean(admissionNo);
  const initials = studentRecord
    ? `${studentRecord.first_name?.[0] ?? ""}${
        studentRecord.last_name?.[0] ?? ""
      }`.toUpperCase()
    : "";
  const colors = avatarPalette[(studentRecord?.id ?? 0) % avatarPalette.length];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-2xl"
      >
        <SheetHeader className="flex-row items-center gap-3 space-y-0 border-b px-4 py-4">
          {studentRecord && (
            <Avatar className="h-11 w-11">
              <AvatarFallback
                className={`${colors.bg} ${colors.text} font-semibold`}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <SheetTitle>
              {studentRecord
                ? `Edit ${studentRecord.first_name} ${studentRecord.last_name ?? ""}`
                : "Edit Student"}
            </SheetTitle>
            <SheetDescription>
              {studentRecord
                ? `Admission No. ${studentRecord.admission_no}`
                : "Loading student details..."}
            </SheetDescription>
          </div>
        </SheetHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Spinner className="size-6" />
            <p className="text-sm text-muted-foreground">
              Loading student details...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 px-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchStudent}>
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && studentRecord && (
          <div className="p-4">
            <StudentForm
              mode="edit"
              formId="student-edit-form"
              defaultValues={{
                admission_no: studentRecord.admission_no,
                date_of_admission: parseApiDateTime(
                  studentRecord.date_of_admission,
                ),
                first_name: studentRecord.first_name,
                father_name: studentRecord.father_name ?? "",
                mother_name: studentRecord.mother_name ?? "",
                last_name: studentRecord.last_name ?? "",
                gender: studentRecord.gender,
                date_of_birth: parseApiDateTime(studentRecord.date_of_birth),
                parent_contact_number: studentRecord.parent_contact_number,
                parent_email: studentRecord.parent_email ?? "",
                address: studentRecord.permanent_address ?? "",
                city: studentRecord.city,
                state: studentRecord.state,
                pincode: studentRecord.pincode,
                disability: studentRecord.disability ?? "None",
              }}
              apiUrl={import.meta.env.VITE_UPDATE_STUDENT_API}
              httpMethod="put"
              buildPayload={(values) => ({
                id: studentRecord.id,
                sd_id: studentRecord.sd_id,
                sci_id: studentRecord.sci_id,
                sad_id: studentRecord.sad_id,
                is_active: studentRecord.is_active,
                photo_url: studentRecord.photo_url,
                admission_no: values.admission_no,
                first_name: values.first_name,
                father_name: values.father_name || null,
                mother_name: values.mother_name || null,
                last_name: values.last_name || null,
                date_of_admission: formatApiDateTime(values.date_of_admission),
                date_of_birth: formatApiDateTime(values.date_of_birth),
                gender: values.gender,
                disability: values.disability,
                parent_contact_number: values.parent_contact_number,
                parent_email: values.parent_email || null,
                permanent_address: values.address,
                city: values.city,
                state: values.state,
                pincode: values.pincode,
              })}
              onSuccess={(data) => {
                onOpenChange(false);
                onSuccess?.(data);
              }}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
