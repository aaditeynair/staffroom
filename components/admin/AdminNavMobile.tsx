import AdminNavItem from "./AdminNavItem";
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
        <AdminNavItem name="Home" link="/admin" icon={<HomeRounded />} />
        <AdminNavItem
          name="Substitution"
          link="/admin/substitution/"
          icon={<SchoolRounded />}
        />
        <AdminNavItem
          name="Teachers"
          link="/admin/manage-teachers"
          icon={<PeopleRounded />}
        />
        <AdminNavItem
          name="Timetable"
          link="/admin/timetable"
          icon={<TableChartRounded />}
        />
      </div>
    </div>
  );
}
