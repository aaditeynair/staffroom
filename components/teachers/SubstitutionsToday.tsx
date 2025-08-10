"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import { CircularProgress } from "@mui/material";

type Sub = {
  period_number: number;
  class: string;
};
export default function SubstitutionsToday() {
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
        .select("period_number,class")
        .eq("substitute_teacher", teacher.id)
        .eq("date", formattedDate)
        .eq("confirmed_by_teacher", "accepted")
        .order("period_number");

      if (error) console.log(error);
      if (data) setSubs(data);
      setLoading(false);
    };

    fetchTimetable();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-full p-5">
        <CircularProgress size={100}></CircularProgress>
      </div>
    );

  return (
    <div>
      <div className="hidden lg:block bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">
          Substitutions Today
        </h2>
        <div className="flex flex-col gap-4">
          {subs.map((sub, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-4 py-3 rounded-md bg-yellow-50 border border-yellow-200"
            >
              <div className="font-semibold text-gray-700">
                Period {sub.period_number}
              </div>
              <div className="text-sm font-semibold text-teal-800">
                {sub.class}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
