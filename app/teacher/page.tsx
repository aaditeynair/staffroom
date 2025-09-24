"use client";
import DailyTimetable from "@/components/teachers/timetable/DailyTimetable";

export default function TeacherDashboard() {
  return (
    <div className="grid grid-cols-1 lg:w-2/3 gap-16 items-start">
      <DailyTimetable />
    </div>
  );
}
