'use client'
import TeacherNavMobile from "@/components/teachers/TeacherNavMobile";
import WeeklyTimetable from "@/components/teachers/WeeklyTimetable";
import TeacherNavDesktop from "@/components/teachers/TeacherNavDesktop";

export default function TeacherTimetables() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8  pb-20 lg:pb-0">
      <TeacherNavDesktop />
      <WeeklyTimetable />
      <TeacherNavMobile />
    </div>
  );
}