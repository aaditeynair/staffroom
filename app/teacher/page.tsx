"use client";
import SubstitutionsView from "@/components/teachers/substitutions/SubstitutionsView";
import DailyTimetable from "@/components/teachers/timetable/DailyTimetable";

export default function TeacherDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_30rem] gap-16 items-start">
      <DailyTimetable />
      <div className="hidden lg:block bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">
          Substitutions Today
        </h2>
      <SubstitutionsView mode='daily' />
      </div>
    </div>
  );
}
