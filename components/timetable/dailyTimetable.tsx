import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Period = {
  period_number: number;
  subject: string;
  class: string;
  division: string;
  is_substitute: boolean;
};
export default function DailyTimetable() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) return;

      const today = new Date();
      const formattedDate = today
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/");

      const { data: teacher } = await supabase
        .from("teachers")
        .select("id")
        .eq("email", session.user.email)
        .single();

      if (!teacher) return;

      const { data, error } = await supabase
        .from("daily_timetable")
        .select("period_number, subject, class, division, is_substitute")
        .eq("teacher_id", teacher.id)
        .eq("date", formattedDate)
        .order("period_number");

      if (data) setPeriods(data);
      setLoading(false);
    };

    fetchTimetable();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-12 text-gray-500">Loading timetable...</p>
    );

  return (
    <div className="p-6 bg-white rounded-md shadow-lg">
      <h2 className="text-2xl font-bold text-teal-800 mb-6">
        Today’s Schedule
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 10 }, (_, i) => {
          const period = periods.find((p) => p.period_number === i + 1);
          const isSub = period?.is_substitute;
          return (
            <div
              key={i}
              className={`flex justify-between items-center px-4 py-3 rounded-md border ${
                isSub
                  ? "bg-yellow-50 border-yellow-300"
                  : period
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="font-semibold text-gray-700">Period {i + 1}</div>
              {period ? (
                <div className="text-sm font-semibold text-teal-800">
                  {period.class} {period.division}
                </div>
              ) : (
                <div className="text-sm text-gray-400">Free</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
