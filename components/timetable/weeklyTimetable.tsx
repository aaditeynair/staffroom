'use client'

import { useEffect, useState } from 'react'
import {supabase} from '@/lib/supabaseClient'

type Period = {
  period_number: number
  subject: string
  class: string
  is_substitution: boolean
  division : string
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function WeeklyTimetable() {
  const [selectedDay, setSelectedDay] = useState<string>('Monday')
  const [periods, setPeriods] = useState<Period[]>([])

  useEffect(() => {
  const loadPeriodsForSelectedDay = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user?.email) {
      console.error("Session error", sessionError)
      return
    }

    const email = session.user.email

    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id')
      .eq('email', email)
      .single()

    if (teacherError || !teacher?.id) {
      console.error("Teacher fetch error", teacherError)
      return
    }

    const { data: entries, error: timetableError } = await supabase
      .from('base_timetable')
      .select('*')
      .eq('teacher_id', teacher.id)
      .eq('day_of_week', selectedDay)
      

    if (timetableError) {
      console.error("Timetable fetch error", timetableError)
      return
    }

    const sorted = entries.sort((a, b) => a.period_number - b.period_number)

    setPeriods(sorted)
  }

  loadPeriodsForSelectedDay()
}, [selectedDay])

  return (
    <div className="flex flex-col gap-4 w-full">   
       <div className="flex flex-row rounded-t-xl items-center w-full min-w-0">
    {days.map((day,index) => (
      <button
        key={day}
        onClick={() => setSelectedDay(day)}
        className={` text-xs sm:text-xs md:text-base font-medium px-3 py-3 flex-1 text-center transition-colors ${
          selectedDay === day
            ? "bg-teal-600 text-white"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          
        } 
        ${index === 0 ? "rounded-l-lg" : ""}
        ${index === days.length - 1 ? "rounded-r-lg" : ""}`}
      >
        {day}
      </button>
    ))}
  </div>

      <div className="w-full grid grid-cols-1 gap-4">
        {Array.from({ length: 10 }, (_, i) => {
          const period = periods.find(p => p.period_number === i + 1)
          const isSub = period?.is_substitution
          return (
            <div
              key={i}
              className={`flex justify-between items-center px-4 py-3 rounded-xl border ${
                isSub
                  ? 'bg-yellow-50 border-yellow-300'
                  : period
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="font-semibold text-gray-700">Period {i + 1}</div>
              {period ? (
                <div className="text-sm text-gray-700 text-right">
                  <div className="text-xs font-semibold text-teal-800">{period.class} {period.division}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-400">Free</div>
              )}
            </div>
          )
        })}

      </div>
    </div>
  )
}
