import { useRouter } from "next/router"
import LeaveRequest from "@mui/icons-material/AssignmentAdd"
import Calendar from "@mui/icons-material/CalendarMonth"
import ArrowForward from "@mui/icons-material/ArrowForward" 

export default function TeacherNavDesktop() {
    const router = useRouter()
    return(
        <div className="hidden lg:flex flex-col gap-4">
            <div className="flex bg-white p-4 rounded-xl shadow-lg h-fit justify-between">
              <div>
                <p className="text-lg font-semibold text-teal-800">Weekly Timetable</p>
                <button onClick={() => {router.push('/weekly-timetable')}} className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                  <ArrowForward/>
                </button>
              </div>
              <div className="text-teal-600">
                <Calendar sx={{ fontSize: 85}} className="text-teal-600"/>
              </div>
            </div>  
            <div className="flex bg-white p-4 rounded-xl shadow-lg h-fit justify-between">
              <div>
                <p className="text-lg font-semibold text-teal-800">Weekly Timetable</p>
                <button onClick={() => {router.push('/weekly-timetable')}} className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                  <ArrowForward/>
                </button>
              </div>
              <div className="text-teal-600">
                <Calendar sx={{ fontSize: 85}} className="text-teal-600"/>
              </div>
            </div>  
            <div className="flex bg-white p-4 rounded-xl shadow-lg h-fit justify-between">
              <div>
                <p className="text-lg font-semibold text-teal-800">Leave Request</p>
                <button onClick={() => {router.push('/leave-request')}} className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                  <ArrowForward/>
                </button>
              </div>
              <div className="text-teal-600">
                <LeaveRequest sx={{ fontSize: 85}} className="text-teal-600"/>
              </div>
            </div>
        </div>
            
    )
}