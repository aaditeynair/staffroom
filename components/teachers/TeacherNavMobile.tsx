"use client";

import NavItem from "../ui/NavItem";
import {
  HomeRounded,
  CalendarMonthRounded,
  AssignmentRounded,
  SchoolRounded,
} from "@mui/icons-material";

export default function TeacherNavMobile() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 lg:hidden">
      <div className="flex justify-between items-center bg-teal-700 text-white p-4 rounded-t-md">
        <NavItem name="Home" link="/teacher" icon={<HomeRounded />} />
        <NavItem
          name="Timetable"
          link="/teacher/weekly-timetable"
          icon={<CalendarMonthRounded />}
        />
        <NavItem
          name="Substitutions"
          link="/teacher/assigned-substitutions"
          icon={<AssignmentRounded />}
        />
        <NavItem
          name="Leave Request"
          link="/teacher/leave-request"
          icon={<SchoolRounded />}
        />
      </div>
    </div>
  );
}
