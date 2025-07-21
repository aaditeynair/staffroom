import pageAuth from "@/components/auth/pageAuth"
import TeacherNavDesktop from "@/components/teachers/teacherNavDesktop"
import TeacherNavMobile from "@/components/teachers/teacherNavMobile"
import TestTimetable from "@/components/timetable/dailyTimetable"
import Header from "@/components/ui/header"



function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-200 pb-16">
      <Header heading="Teacher Dashboard"/>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_48rem)_30rem] gap-16 px-6 py-6">
        <TestTimetable/>
        <TeacherNavDesktop/>
      </div>
       <TeacherNavMobile/>
    </div>

  )
}

export default pageAuth(TeacherDashboard, "teacher")
