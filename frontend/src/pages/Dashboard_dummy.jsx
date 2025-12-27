import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import bookLogo from "/smp_icon.svg";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Search,
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
} from "lucide-react";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
let kg_count = 0,
  jnr_count = 0,
  snr_count = 0;
const stats = [
  {
    title: "Total Students",
    value: "1,240",
    change: "+12% from last month",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "New Applications",
    value: "45",
    change: "+3 since yesterday",
    icon: UserPlus,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    title: "Total Teachers",
    value: "12",
    change: `Kg:${kg_count} Jnr:${jnr_count} Snr:${snr_count}`,
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
];

const Badge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
        styles[status] || "bg-slate-100"
      }`}
    >
      {status}
    </span>
  );
};

const recentAdmissions = [
  {
    id: "APP-001",
    name: "Alice Johnson",
    grade: "10th",
    date: "2023-11-20",
    status: "Pending",
  },
  {
    id: "APP-002",
    name: "Michael Chen",
    grade: "8th",
    date: "2023-11-19",
    status: "Approved",
  },
  {
    id: "APP-003",
    name: "Sarah Smith",
    grade: "5th",
    date: "2023-11-19",
    status: "Rejected",
  },
  {
    id: "APP-004",
    name: "James Wilson",
    grade: "11th",
    date: "2023-11-18",
    status: "Approved",
  },
];

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            <img src={bookLogo} className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Blossom Portal
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "students", icon: List, label: "Student Directory" },
            { id: "admissions", icon: UserPlus, label: "Admissions" },
            { id: "update", icon: Edit, label: "Update Info" },
            { id: "schedule", icon: Calendar, label: "Teachers" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-500"
          >
            <Settings size={18} />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-slate-800">
            Dashboard Overview
          </h1>

          <div className="flex items-center gap-4">
            {/* Global Search Bar (Replaces 'Find Student' Page) */}
            <div className="relative hidden sm:block group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600"
                size={16}
              />
              <input
                type="text"
                placeholder="Search students, IDs..."
                className="pl-10 pr-4 py-2 w-64 bg-slate-100 border-transparent focus:bg-white border focus:border-rose-500 rounded-full text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-medium text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stat.change.includes("+")
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 mt-1">{stat.title}</div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Table (Recent Applications) */}
            <div className="lg:col-span-2">
              <Card className="h-full overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">
                      Recent Applications
                    </h3>
                    <p className="text-sm text-slate-500">
                      Manage new student enrollments
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Student Name</th>
                        <th className="px-6 py-3">Grade</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentAdmissions.map((student) => (
                        <tr
                          key={student.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-slate-700">
                            {student.id}
                          </td>
                          <td className="px-6 py-4 text-slate-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {student.grade}
                          </td>
                          <td className="px-6 py-4">
                            <Badge status={student.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal size={18} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Quick Actions (Your original buttons transformed) */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg text-slate-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {/* Quick Action 1: New Admission */}
                  <button className="w-full group flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-md group-hover:bg-white">
                        <UserPlus size={18} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-slate-900">
                          New Admission
                        </div>
                        <div className="text-xs text-slate-500">
                          Register a new student
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-slate-400 group-hover:text-rose-500"
                    />
                  </button>

                  {/* Quick Action 2: Find Student */}
                  <button className="w-full group flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-md group-hover:bg-white">
                        <Search size={18} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-slate-900">
                          Find Student
                        </div>
                        <div className="text-xs text-slate-500">
                          Search database
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-slate-400 group-hover:text-rose-500"
                    />
                  </button>

                  {/* Quick Action 3: Update Info */}
                  <button className="w-full group flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-md group-hover:bg-white">
                        <Edit size={18} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-slate-900">
                          Update Info
                        </div>
                        <div className="text-xs text-slate-500">
                          Edit student records
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-slate-400 group-hover:text-rose-500"
                    />
                  </button>
                </div>
              </Card>

              {/* Announcement / Status Card */}
              <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <GraduationCap size={100} />
                </div>
                <h4 className="font-semibold text-lg mb-2">Term Status</h4>
                <p className="text-slate-300 text-sm mb-4">
                  Spring admissions are currently open. Ensure all forms are
                  verified.
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  View Admission Rules
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
