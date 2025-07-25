import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

type Absence = {
  date: string;
  leave_type: "full day" | "morning" | "afternoon";
  status: "pending" | "rejected" | "confirmed";
};
export default function LeaveReqManager({
  refreshKey,
}: {
  refreshKey: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [absences, setAbsences] = useState<Absence[]>([]);

  useEffect(() => {
    const fetchAbsences = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) return;
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id")
        .eq("email", session.user.email)
        .single();

      if (!teacher) return;

      const { data, error } = await supabase
        .from("absences")
        .select("date,leave_type,status")
        .eq("teacher_id", teacher.id)
        .order("date");

      if (error) {
        console.log(error);
        return;
      }

      if (data) setAbsences(data);
      setLoading(false);
    };

    fetchAbsences();
  }, [refreshKey]);

  if (loading)
    return (
      <p className="text-center mt-12 text-gray-500">Loading timetable...</p>
    );

  return (
    <div className="max-w-screen bg-gray-100 p-5 rounded-md shadow">
      <h2 className="text-2xl font-bold text-teal-800 mb-6">
        Submitted Leave Requests
      </h2>
      <table className="border-separate border-spacing-y-3 min-w-full mt-4 overflow-hidden rounded-md align text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Date</th>
            <th className="p-2">Leave Type</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {absences.map((absence, index) => (
            <tr key={index}>
              <td className="p-2">{new Date(absence.date).toDateString()}</td>
              <td className="p-2">{absence.leave_type}</td>
              <td>
                <span
                  className={`px-2 py-1 my-1 rounded-md text-center space-y-6  ${
                    absence.status == "confirmed"
                      ? "bg-green-200 text-green-600"
                      : absence.status == "rejected"
                        ? "bg-red-200 text-red-600"
                        : "bg-gray-200 text-black"
                  }`}
                >
                  {absence.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

