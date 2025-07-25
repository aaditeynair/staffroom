import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DateCalendar,
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import { CircularProgress } from "@mui/material";

export default function AbsentTeachersList({ date, setDate, refreshKey }) {
  const [loading, setLoading] = useState(false);
  const [absentTeachers, setAbsentTeachers] = useState([]);

  const getAbsentTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("absences")
      .select(
        `
        id,
        leave_type,
        dealt_with,
        teacher:teacher_id (
          id,
          name
        )
      `,
      )
      .eq("status", "confirmed")
      .eq("date", date)
      .order("dealt_with", { ascending: true });

    if (error) {
      console.log(error);
      return;
    }

    setAbsentTeachers(data);
    setLoading(false);
  };

  useEffect(() => {
    getAbsentTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, refreshKey]);

  return (
    <div className="w-auto m-6 md:m-8">
      <h1 className="text-xl font-bold text-teal-700">Absent Teachers</h1>
      <div className="lg:flex gap-8 mt-6">
        <div className="lg:w-1/2 2xl:w-2/5 rounded-md shadow-md">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="hidden lg:block">
              <DateCalendar
                value={date}
                onChange={(newDate) => {
                  setDate(dayjs(newDate));
                }}
              />
            </div>
            <div className="mb-4 lg:hidden">
              <DatePicker
                value={date}
                onChange={(newDate) => {
                  setDate(dayjs(newDate));
                }}
                format="DD-MM-YYYY"
                className="w-full"
              />
            </div>
          </LocalizationProvider>
        </div>
        {loading ? (
          <div className="w-full flex items-center">
            <p className="w-full text-center">
              <CircularProgress />
            </p>
          </div>
        ) : (
          <div className="w-full grid md:grid-cols-2 gap-4 h-fit">
            {absentTeachers.length === 0 ? (
              <p>No absent teachers</p>
            ) : (
              <>
                {absentTeachers.map((absence) => {
                  return (
                    <Link
                      key={absence.id}
                      className="col-span-1 cursor-pointer rounded-md shadow-md hover:shadow-lg transition-shadow p-4 flex justify-between items-center"
                      href={"/admin/substitution/" + absence.id}
                    >
                      <div className="flex h-full">
                        <div
                          className={
                            "w-2 h-full mr-4 " +
                            (absence.dealt_with === true
                              ? "bg-green-400"
                              : "bg-red-400")
                          }
                        ></div>
                        <div>
                          <p>{absence.teacher.name}</p>
                          <p className="text-sm text-gray-500">
                            {absence.leave_type}
                          </p>
                        </div>
                      </div>
                      <p className="text-teal-700">
                        <ChevronRightIcon />
                      </p>
                    </Link>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
