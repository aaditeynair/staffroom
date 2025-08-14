"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import { CircularProgress } from "@mui/material";
import dayjs from "@/lib/dayjs";

type Sub = {
  period_number: number;
  class: string;
  date: string;
};
export default function SubstitutionsView({ mode,refreshFlag }: { mode: 'daily' | 'all',refreshFlag?:boolean }) {
  const [subs, setSubs] = useState<Sub[]>([]);
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
        .from("substitutions")
        .select("period_number,class,date")
        .eq("substitute_teacher", teacher.id)
      [mode == 'daily' ? "eq" : "gte"]("date", formattedDate)
        .eq("confirmed_by_teacher", "accepted")
        .order("date")
        .order("period_number");

      if (error) console.log(error);
      if (data) setSubs(data);
      setLoading(false);
    };

    fetchTimetable();
  }, [refreshFlag]);

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-full p-5">
        <CircularProgress size={60}></CircularProgress>
      </div>
    );

  return (
        <div className="flex flex-col gap-4">
        <table className="border-separate border-spacing-y-3 min-w-full w-full table-fixed mt-4 overflow-hidden rounded-md align text-left">
          <thead>
            <tr className="bg-gray-100">
              {mode!='daily' &&
              <th className="w-3/7 p-2">Date</th>}
              <th className="w-2/7 p-2">Period</th>
              <th className="w-3/7 p-2 ">Class</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((sub,index) => (
              <tr key={index}>
                {mode!='daily' &&
                <td className="p-2">{dayjs(sub.date).format('DD-MM-YYYY')}</td>}
                <td className="p-2">{sub.period_number}</td>
                <td className="p-2">{sub.class}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}
