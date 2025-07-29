import HomeIcon from "@mui/icons-material/Home";
import Calendar from "@mui/icons-material/CalendarMonth";
import ApplyForAbsence from "@mui/icons-material/AssignmentAdd";
import SubstitutionDuties from "@mui/icons-material/School";
import Link from "next/link";

export default function TeacherNavMobile() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-teal-700 border-gray-300 flex shadow-lg z-50">
      <Link
        href="/teacher"
        className=" active:bg-teal-800 flex-1 flex flex-col items-center text-xs w-full px-2 py-2"
      >
        <HomeIcon className="w-6 h-6 text-white" />
        <span className="text-white">Home</span>
      </Link>
      <Link
        href="/teacher/weekly-timetable"
        className=" active:bg-teal-800 flex-1 flex flex-col items-center text-xs w-full px-2 py-2"
      >
        <Calendar className="w-6 h-6 text-white" />
        <span className="text-white">Timetable</span>
      </Link>
      <Link
        href="/teacher/assigned-substitutions"
        className=" active:bg-teal-800 flex-1 flex flex-col items-center text-xs w-full px-2 py-2"
      >
        <SubstitutionDuties className="w-6 h-6 text-white" />
        <span className="text-white">Substitutions</span>
      </Link>
      <Link
        href="/teacher/leave-request"
        className=" active:bg-teal-800 flex-1 flex flex-col items-center text-xs w-full px-2 py-2"
      >
        <ApplyForAbsence className="w-6 h-6 text-white" />
        <span className="text-white">Leave Request</span>
      </Link>
    </div>
  );
}
