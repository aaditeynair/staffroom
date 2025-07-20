import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function AbsentTeachersList() {
  const [date, setDate] = useState(dayjs());
  return (
    <div className="w-auto m-8">
      <h1 className="text-xl font-bold text-teal-700">Absent Teachers</h1>
      <div className="lg:flex gap-8 mt-6">
        <div className="lg:w-2/5 rounded-md shadow-md">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={date}
              onChange={(newDate) => setDate(dayjs(newDate))}
            />
          </LocalizationProvider>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 h-fit">
          <div className="col-span-1 cursor-pointer rounded-md shadow-md hover:shadow-lg transition-shadow p-4 flex justify-between">
            <p>Aaditey Nair</p>
            <p className="text-teal-700">
              <ChevronRightIcon />
            </p>
          </div>
          <div className="col-span-1 cursor-pointer rounded-md shadow-md hover:shadow-lg transition-shadow p-4 flex justify-between">
            <p>Aaditey Nair</p>
            <p className="text-teal-700">
              <ChevronRightIcon />
            </p>
          </div>
          <div className="col-span-1 cursor-pointer rounded-md shadow-md hover:shadow-lg transition-shadow p-4 flex justify-between">
            <p>Aaditey Nair</p>
            <p className="text-teal-700">
              <ChevronRightIcon />
            </p>
          </div>
          <div className="col-span-1 cursor-pointer rounded-md shadow-md hover:shadow-lg transition-shadow p-4 flex justify-between">
            <p>Aaditey Nair</p>
            <p className="text-teal-700">
              <ChevronRightIcon />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
