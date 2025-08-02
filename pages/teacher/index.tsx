import pageAuth from "@/components/auth/pageAuth";
import TeacherNavDesktop from "@/components/teachers/TeacherNavDesktop";
import TeacherNavMobile from "@/components/teachers/TeacherNavMobile";
import DailyTimetable from "@/components/timetable/DailyTimetable";
import Header from "@/components/ui/Header";

function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Header/>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_30rem] gap-16">
        <DailyTimetable />
        <TeacherNavDesktop />
      </div>
      <TeacherNavMobile />
    </div>
  );
}

export default pageAuth(TeacherDashboard, "teacher");
