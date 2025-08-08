"use client";
import SubstitutionsToday from "@/components/teachers/SubstitutionsToday";
import DailyTimetable from "@/components/teachers/DailyTimetable";

export default function TeacherDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_30rem] gap-16">
      <DailyTimetable />
      <SubstitutionsToday />
    </div>
  );
}
