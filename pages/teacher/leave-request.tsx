'use client'

import { useState } from 'react'
import pageAuth from "@/components/auth/pageAuth"
import TeacherNavMobile from "@/components/teachers/teacherNavMobile"
import Header from "@/components/ui/header"
import { supabase } from '@/lib/supabaseClient'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import LeaveReqManager from '@/components/teachers/leaveReqManager'


function LeaveRequest() {
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(
    dayjs().add(1, "day"),
  );
  const [success, setSuccess] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false)

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Unable to get user.");
      setLoading(false);
      return;
    }

    const { data: teacher, error: teacherError } = await supabase
      .from("teachers")
      .select("id")
      .eq("email", user.email)
      .single();

    if (teacherError || !teacher) {
      setError("No teacher record found for this user.");
      setLoading(false);
      return;
    }
    const selectedFormattedDate = selectedDate.format("YYYY-MM-DD");
    const finalReason = reason === "Other" ? customReason.trim() : reason;
    const { data: existing } = await supabase
      .from("absences")
      .select("status")
      .eq("teacher_id", teacher.id)
      .eq("date", selectedFormattedDate)

    if ((existing && existing.length > 0)) {
      setLoading(false)
      setAlreadyExists(true)
      return
    }
    const { error: insertError } = await supabase.from("absences").insert({
      teacher_id: teacher.id,
      date: selectedFormattedDate,
      leave_type: leaveType,
      reason: finalReason,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess(true)
      setLeaveType('')
      setReason('')
      setRefreshFlag((prev) => !prev)
    }

    setLoading(false);
    setAlreadyExists(false);
  };

  return (
    <div className='min-h-screen bg-gray-200 pb-16'>
      <Header heading="Leave Request" />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_30rem)_48rem] gap-8 lg:gap-16 px-6 py-6">
        <form
          className="bg-white p-6 rounded-2xl shadow-md space-y-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-semibold text-teal-700 text-center">
            Leave Request Form
          </h1>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue!)}
                disablePast
                format="YYYY-MM-DD"
                className="w-full"
              />
            </div>
          </LocalizationProvider>
          <div>
            <label
              htmlFor="half_day"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
              <option value="" disabled>
                Select type
              </option>
              <option value="full day">Full Day</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
              <option value="" disabled>
                Select reason
              </option>
              <option value="Personal">Personal</option>
              <option value="Sick">Sick</option>
              <option value="Other">Other</option>
            </select>
            {reason === "Other" && (
              <div className="mt-2">
                <label
                  htmlFor="customReason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Specify Reason
                </label>
                <textarea
                  id="customReason"
                  maxLength={100}
                  placeholder="Enter reason"
                  value={customReason}
                  required={reason === "Other"}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full border resize-none border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm">Leave request submitted!</p>
          )}
          {alreadyExists && (
            <p className="text-red-500 text-sm">
              {" "}
              Leave request for this day was already submitted{" "}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-2 rounded-md hover:bg-teal-800 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
        <LeaveReqManager refreshKey={refreshFlag}/>
      </div>
      
      <TeacherNavMobile />
    </div>
  );
}

export default pageAuth(LeaveRequest, "teacher");
