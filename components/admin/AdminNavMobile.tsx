"use client";
import NavItem from "../ui/NavItem";
import {
  HomeRounded,
  PeopleRounded,
  TableChartRounded,
  SchoolRounded,
} from "@mui/icons-material";

export default function AdminNavMobile() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 lg:hidden">
      <div className="flex justify-between items-center bg-teal-700 text-white p-4 rounded-t-md">
        <NavItem name="Home" link="/admin" icon={<HomeRounded />} />
        <NavItem
          name="Substitution"
          link="/admin/substitution/"
          icon={<SchoolRounded />}
        />
        <NavItem
          name="Teachers"
          link="/admin/teachers/"
          icon={<PeopleRounded />}
        />
        <NavItem
          name="Timetable"
          link="/admin/timetable/"
          icon={<TableChartRounded />}
        />
      </div>
    </div>
  );
}
