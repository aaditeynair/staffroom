"use client";

import AdminNavItem from "../ui/NavItem";
import {
  HomeRounded,
  CalendarMonthRounded,
  AssignmentRounded,
  SchoolRounded,
} from "@mui/icons-material";

export default function AdminNavMobile() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 lg:hidden">
      <div className="flex justify-between items-center bg-teal-700 text-white p-4 rounded-t-md">
        <AdminNavItem name="Home" link="/teacher" icon={<HomeRounded />} />
        <AdminNavItem
          name="Timetable"
          link="/teacher/weekly-timetable"
          icon={<CalendarMonthRounded />}
        />
        <AdminNavItem
          name="Substitutions"
          link="/teacher/assigned-substitutions"
          icon={<AssignmentRounded />}
        />
        <AdminNavItem
          name="Leave Request"
          link="/teacher/leave-request"
          icon={<SchoolRounded />}
        />
      </div>
    </div>
  );
}
