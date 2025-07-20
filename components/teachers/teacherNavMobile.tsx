import HomeIcon from '@mui/icons-material/Home'
import Calendar from '@mui/icons-material/CalendarMonth'
import ApplyForAbsence from '@mui/icons-material/AssignmentAdd'
import SubstitutionDuties from '@mui/icons-material/School'


import { useRouter } from "next/router"

export default function TeacherNavMobile() {
    const router = useRouter()
    return (
       <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-teal-700 border-t border-gray-300 flex justify-around py-2 px-2 shadow-lg z-50">
                <button onClick={() => router.push('/teachers')} className="active:bg-teal-800 flex-1 flex flex-col items-center text-xs">
                    <HomeIcon className="w-6 h-6 text-white" />
                    <span className="text-white">Home</span>
                </button>
                 <button onClick={() => router.push('/weekly-timetable')} className="active:bg-teal-800 flex-1 flex flex-col items-center text-xs">
                    <Calendar className="w-6 h-6 text-white"/>
                    <span className="text-white">Timetable</span>
                </button>
                <button onClick={() => router.push('/assigned-substitutions')} className="active:bg-teal-800 flex-1 flex flex-col items-center text-xs">
                    <SubstitutionDuties className="w-6 h-6 text-white"/>
                    <span className="text-white">Substitutions</span>
                </button>
                <button onClick={() => router.push('/leave-request')} className="active:bg-teal-800 flex-1 flex flex-col items-center text-xs">
                    <ApplyForAbsence className="w-6 h-6 text-white" />
                    <span className="text-white">Leave Request</span>
                </button>

             </div>
    )
}