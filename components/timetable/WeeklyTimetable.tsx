'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { CircularProgress } from '@mui/material'

type Period = {
  period_number: number
  subject: string
  class: string
  is_substitution: boolean
}

const days = [
  { label: 'Mon', value: 'Monday' },
  { label: 'Tue', value: 'Tuesday' },
  { label: 'Wed', value: 'Wednesday' },
  { label: 'Thu', value: 'Thursday' },
  { label: 'Fri', value: 'Friday' },
]

export default function WeeklyTimetable() {
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>('Monday')
  const [periods, setPeriods] = useState<Period[]>([])

  useEffect(() => {
    const loadPeriodsForSelectedDay = async () => {
      setLoading(true)
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
      setLoading(false)
    }

    loadPeriodsForSelectedDay()
  }, [selectedDay])

  return (
    <div className="p-6 bg-white rounded-md shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row rounded-t-md items-center w-full max-w-full overflow-hidden">
          {days.map(({ label, value }, index) => (
            <button
              key={value}
              onClick={() => setSelectedDay(value)}
              className=
                {`text-sm w-full px-3 py-3 flex-1 text-center min-w-0 truncate transition-colors
                  ${selectedDay === value ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                  ${index === 0 ? 'rounded-l-md' : ''}
                  ${index === days.length - 1 ? 'rounded-r-md' : ''}
                `}
            >
              {label}
            </button>
          ))}
        </div>
        {!loading ? 
        <div className="w-full grid grid-cols-1 gap-4">
          {Array.from({ length: 10 }, (_, i) => {
            const period = periods.find(p => p.period_number === i + 1)
            const isSub = period?.is_substitution
            return (
              <div
                key={i}
                className={`flex justify-between items-center px-4 py-3 rounded-md border ${isSub
                  ? 'bg-yellow-50 border-yellow-300'
                  : period
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                  }`}
              >
                <div className="font-semibold text-gray-700">Period {i + 1}</div>
                {period ? (
                  <div className="text-sm text-gray-700 text-right">
                    <div className="text-xs font-semibold text-teal-800">{period.class}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Free</div>
                )}
              </div>
            )
          })}

        </div>
        :
          <div className="flex items-center justify-center w-full h-full p-6">
          <CircularProgress size={50} ></CircularProgress>
          </div>
        }
      </div>
    </div>
  )
}
