import pageAuth from "@/components/auth/pageAuth";
import TeacherNavMobile from "@/components/teachers/TeacherNavMobile";
import WeeklyTimetable from "@/components/timetable/WeeklyTimetable";
import TeacherNavDesktop from "@/components/teachers/TeacherNavDesktop";

function TeacherTimetables() {
  return (
      
      <div className="min-h-screen bg-gray-100 p-4 md:p-8  pb-20 lg:pb-0">
        <TeacherNavDesktop/>
          <WeeklyTimetable />
        <TeacherNavMobile />
      </div>
  );
}

export default pageAuth(TeacherTimetables, "teacher");

