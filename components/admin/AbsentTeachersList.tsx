import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";

export default function AbsentTeachersList() {
  const [date, setDate] = useState(dayjs());
  const [absentTeachers, setAbsentTeachers] = useState([]);

  const getAbsentTeachers = async (date = dayjs()) => {
    const { data, error } = await supabase
      .from("absences")
      .select(
        `
        id,
        leave_type,
        teacher:teacher_id (
          id,
          name
        )
      `,
      )
      .eq("status", "confirmed")
      .eq("date", date);

    if (error) {
      console.log(error);
      return;
    }

    setAbsentTeachers(data);
  };

  useEffect(() => {
    getAbsentTeachers();
  }, []);

  return (
    <div className="w-auto m-8">
      <h1 className="text-xl font-bold text-teal-700">Absent Teachers</h1>
      <div className="lg:flex gap-8 mt-6">
        <div className="lg:w-2/5 rounded-md shadow-md">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={date}
              onChange={(newDate) => {
                setDate(dayjs(newDate));
                getAbsentTeachers(newDate);
              }}
            />
          </LocalizationProvider>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 h-fit">
          {absentTeachers.length === 0 ? (
            <p>No absent teachers</p>
          ) : (
            <>
              {absentTeachers.map((absence) => {
                return (
                  <Link
                    key={absence.id}
                    className="col-span-1 cursor-pointer rounded-md shadow-md hover:shadow-lg transition-shadow p-4 flex justify-between items-center"
                    href={"/"}
                  >
                    <div>
                      <p>{absence.teacher.name}</p>
                      <p className="text-sm text-gray-500">
                        {absence.leave_type}
                      </p>
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
      </div>
    </div>
  );
}
