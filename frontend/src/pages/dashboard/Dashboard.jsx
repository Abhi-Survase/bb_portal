import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Calendar,
  List,
  Edit,
  Moon,
  IdCardLanyard,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import axios from "axios";
import { differenceInDays } from "date-fns";
import ScheduleWidget from "@/components/calender-schedule/ScheduleWidget.jsx";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "../../components/user-avatar";

function Dashboard() {
  const [latestStudents, fetchLatestStudents] = useState([
    { id: "pre", date_of_admission: `${new Date()}` },
  ]);
  const [dashboardSummary, fetchDashbardSummary] = useState({
    newAdmissionCount: [{ new_admissions_count: -1 }],
    totalStudentCount: [{ total_count: -1 }],
    teachersCount: [{ teachers_count: -1 }],
    usersCount: [{ users_count: -1 }],
  });
  useEffect(() => {
    const fetchLatestStudentsData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_DASHBOARD_LIST_API;
        // console.log(paginationData);
        const response = await axios.get(apiUrl);
        fetchLatestStudents(response.data.data.latestAdmissionsList);
        // console.log(response.data.data.latestAdmissionsList)
        // lastAdmissionInterval = `Last Admission was ${response.data.data.date_of_admission - new Date() / 1000 / 60 / 24} months ago`
        // console.log(response.data);
      } catch (error) {
        console.log(error);
        // setError(error.message);
      } finally {
        // setLoading(false);
        // console.log(new Date().getFulltimeYear());
        // console.log(
        //   lastAdmissionInterval
        // );
      }
    };

    const dashboardSummaryData = async () => {
      console.log(dashboardSummary);
      try {
        const apiUrl = import.meta.env.VITE_DASHBOARD_SUMMARY_API;
        const response = await axios.get(apiUrl);
        fetchDashbardSummary(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
        // setError(error.message);
      } finally {
        // console.log(dashboardSummary.totalStudentCount);
        // console.log(dashboardSummary.newAdmissionCount);
      }
    };

    fetchLatestStudentsData();
    dashboardSummaryData();
    console.log(dashboardSummary);
  }, []);

  return (
    <div className="@container/main flex-1 flex flex-col">
      <header className="h-16 bg-background border-b flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-4">
          <SidebarTrigger />
          Dashboard Overview
        </h1>

        <div className="flex items-center gap-4">
          {/* Global Search Bar (Replaces 'Find Student' Page) */}
          <div className="relative hidden sm:block group">
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
          </div>
          <ModeToggle />
          <UserAvatar />
        </div>
      </header>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>
                <Users className="h-8 w-8 text-(--chart-2) rounded-lg bg-[var(--chart-2)]/15 p-1.5" />
              </CardDescription>
              <CardTitle className="justify-center text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {dashboardSummary.totalStudentCount[0].total_count === -1 ? (
                  <Spinner className="!mt-3 size-5" />
                ) : (
                  dashboardSummary.totalStudentCount[0].total_count
                )}
              </CardTitle>
              <CardAction>
                <Badge
                  variant="secondary"
                  className="bg-[var(--secondary)]/40 text-emerald-600 hover:bg-emerald-50 border-none px-3 py-1 rounded-full font-semibold"
                >
                  View Student
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <p className="text-muted-foreground ">Total Students</p>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>
                <UserPlus className="h-8 w-8 text-(--chart-5) rounded-lg bg-(--secondary) p-1.5" />
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {dashboardSummary.newAdmissionCount[0].new_admissions_count ===
                -1 ? (
                  <Spinner className="!mt-3 size-5" />
                ) : (
                  dashboardSummary.newAdmissionCount[0].new_admissions_count
                )}
              </CardTitle>
              <CardAction>
                <Badge
                  variant="secondary"
                  className="bg-[var(--secondary)]/40 text-emerald-600 hover:bg-emerald-50 border-none px-3 py-1 rounded-full font-semibold"
                >
                  Add Students
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">
                New Admissions in 30 days
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>
                <IdCardLanyard className="h-8 w-8 text-(--chart-5) rounded-lg bg-(--secondary) p-1.5" />
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {dashboardSummary.teachersCount[0].teachers_count === -1 ? (
                  <Spinner className="!mt-3 size-5" />
                ) : (
                  dashboardSummary.teachersCount[0].teachers_count
                )}
              </CardTitle>
              <CardAction>
                <Badge
                  variant="secondary"
                  className="bg-[var(--secondary)]/40 text-emerald-600 hover:bg-emerald-50 border-none px-3 py-1 rounded-full font-semibold"
                >
                  View Teacher
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">Teachers</div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>
                <Users className="h-8 w-8 text-(--chart-5) rounded-lg bg-(--secondary) p-1.5" />
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {dashboardSummary.usersCount[0].users_count === -1 ? (
                  <Spinner className="!mt-3 size-5" />
                ) : (
                  dashboardSummary.usersCount[0].users_count
                )}
              </CardTitle>
              <CardAction>
                <Badge
                  variant="secondary"
                  className="bg-[var(--secondary)]/40 text-emerald-600 hover:bg-emerald-50 border-none px-3 py-1 rounded-full font-semibold"
                >
                  View Users
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">Application Users</div>
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
            <Card className="@container/card lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Admissions</CardTitle>
                <CardDescription>
                  <span className="hidden @[540px]/card:block">
                    {"Last Admission was "}
                    {latestStudents[0].id === "pre" ? (
                      <Spinner className="size-3 inline-block align-middle" />
                    ) : (
                      differenceInDays(
                        new Date(),
                        new Date(latestStudents[0].date_of_admission),
                      )
                    )}
                    {" day/s ago"}
                  </span>

                  {/* <span className="@[540px]/card:hidden">Last 3 months</span> */}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                {latestStudents[0].id === "pre" ? (
                  <Skeleton className="h-60 w-full" />
                ) : (
                  <Table className="w-full">
                    <TableCaption>A list of recent admissions.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          Admission No
                        </TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">
                          Admission Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.admission_no}
                          </TableCell>
                          <TableCell>{student.first_name}</TableCell>
                          <TableCell>{student.last_name}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          <TableCell>{student.parent_contact_number}</TableCell>
                          <TableCell className="text-right">
                            {
                              new Date(student.date_of_admission)
                                .toISOString()
                                .split("T")[0]
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            <div className="@container/card lg:col-span-1">
              <ScheduleWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
