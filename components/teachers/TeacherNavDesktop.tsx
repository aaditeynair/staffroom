import LeaveRequest from "@mui/icons-material/AssignmentAdd";
import Calendar from "@mui/icons-material/CalendarMonth";
import Substitutions from "@mui/icons-material/School";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Link from "next/link";

export default function TeacherNavDesktop() {
  return (
    <div className="hidden lg:flex flex-col gap-4">
      <div className="flex bg-white p-4 rounded-md shadow-lg h-fit justify-between">
        <div>
          <p className="text-lg font-semibold text-teal-800">
            Assigned Substitutions
          </p>
          <Link
            href="/teacher/assigned-substitutions"
            className="inline-block mt-6 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 "
          >
            <ArrowForward />
          </Link>
        </div>
        <div>
          <Substitutions sx={{ fontSize: 85 }} className="text-teal-600" />
        </div>
      </div>
      <div className="flex bg-white p-4 rounded-md shadow-lg h-fit justify-between">
        <div>
          <p className="text-lg font-semibold text-teal-800">
            Weekly Timetable
          </p>
          <Link
            href="/teacher/weekly-timetable"
            className="inline-block mt-6 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 "
          >
            <ArrowForward />
          </Link>
        </div>
        <div className="text-teal-600">
          <Calendar sx={{ fontSize: 85 }} className="text-teal-600" />
        </div>
      </div>
      <div className="flex bg-white p-4 rounded-md shadow-lg h-fit justify-between">
        <div>
          <p className="text-lg font-semibold text-teal-800">Leave Request</p>
          <Link
            href="/teacher/leave-request"
            className="inline-block mt-6 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 "
          >
            <ArrowForward />
          </Link>
        </div>
        <div className="text-teal-600">
          <LeaveRequest sx={{ fontSize: 85 }} className="text-teal-600" />
        </div>
      </div>
    </div>
  );
}
