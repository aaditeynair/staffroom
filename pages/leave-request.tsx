'use client'

import { useState } from 'react'
import pageAuth from "@/components/auth/pageAuth"
import TeacherNavMobile from "@/components/teachers/teacherNavMobile"
import Header from "@/components/ui/header"
import { supabase } from '@/lib/supabaseClient' // adjust this import path

function LeaveRequest() {
   const [leaveType, setLeaveType] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('Unable to get user.')
      setLoading(false)
      return
    }

    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id')
      .eq('email', user.email)
      .single()

    if (teacherError || !teacher) {
      setError('No teacher record found for this user.')
      setLoading(false)
      return
    }

    const today = new Date().toISOString().split('T')[0] // yyyy-mm-dd

    const { error: insertError } = await supabase.from('absences').insert({
      teacher_id: teacher.id,
      date: today,
      leave_type: leaveType,
      reason
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess(true)
      setLeaveType('')
      setReason('')
    }

    setLoading(false)
  }

  return (
    <div>
      <Header heading="Leave Request" />
      <div className="min-h-screen flex justify-center bg-gray-200 px-4">
        <form
          className="bg-white m-5 p-6 rounded-2xl shadow-md w-full max-h-fit max-w-md mx-auto space-y-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-semibold text-teal-700 text-center">
            Leave Request Form
          </h1>

          <div>
            <label htmlFor="half_day" className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type
            </label>
            <select
              id="half_day"
              name="half_day"
              required
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="" disabled>Select type</option>
              <option value="full day">Full Day</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <select
              id="reason"
              name="reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="" disabled>Select reason</option>
              <option value="Personal">Personal</option>
              <option value="Sick">Sick</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">Leave request submitted!</p>}

          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-2 rounded-md hover:bg-teal-800 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
      <TeacherNavMobile />
    </div>
  )
}

export default pageAuth(LeaveRequest, 'teacher')