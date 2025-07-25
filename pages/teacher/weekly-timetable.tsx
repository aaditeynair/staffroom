import pageAuth from "@/components/auth/pageAuth";
import TeacherNavMobile from "@/components/teachers/teacherNavMobile";
import WeeklyTimetable from "@/components/timetable/weeklyTimetable";
import Header from "@/components/ui/header";

function TeacherTimetables() {
  return (
    <div>
      <Header heading="Weekly Timetable" />
      <div className="min-h-screen flex justify-center bg-gray-200 pb-16">
        <div className="max-w-screen bg-gray-50 p-5 w-full rounded-md shadow m-3">
          <WeeklyTimetable />
        </div>
        <TeacherNavMobile />
      </div>
    </div>
  );
}

export default pageAuth(TeacherTimetables, "teacher");

