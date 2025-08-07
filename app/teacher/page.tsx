'use client'
import SubstitutionsToday from "@/components/teachers/SubstitutionsToday";
import TeacherNavMobile from "@/components/teachers/TeacherNavMobile";
import DailyTimetable from "@/components/teachers/DailyTimetable";
import TeacherNavDesktop from "@/components/teachers/TeacherNavDesktop";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <TeacherNavDesktop/>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_30rem] gap-16">
        <DailyTimetable />
        <SubstitutionsToday />
      </div>
      <TeacherNavMobile />
    </div>
  );
}

