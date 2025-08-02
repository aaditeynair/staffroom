import pageAuth from "@/components/auth/pageAuth";
import TeacherNavMobile from "@/components/teachers/TeacherNavMobile";
import WeeklyTimetable from "@/components/timetable/WeeklyTimetable";
import Header from "@/components/ui/Header";

function TeacherTimetables() {
  return (
      
      <div className="min-h-screen bg-gray-100 p-4 md:p-8  pb-20 lg:pb-0">
        <Header/>
          <WeeklyTimetable />
        <TeacherNavMobile />
      </div>
  );
}

export default pageAuth(TeacherTimetables, "teacher");

