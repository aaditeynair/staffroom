export interface TimetableEntry {
  id: string;
  teacher_id: string;
  day_of_week: string; // e.g., "Monday"
  period_number: number;
  classes: string[];
}

export interface TimetableViewerProps {
  timetable: TimetableEntry[];
  periods?: (string | number)[];
  title?: string;
}

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

function groupTimetableByDayAndPeriod(
  timetable: TimetableEntry[],
): Record<string, Record<number, TimetableEntry>> {
  const result: Record<string, Record<number, TimetableEntry>> = {};

  timetable.forEach((entry) => {
    const shortDay = DAY_SHORT[entry.day_of_week] ?? entry.day_of_week;

    if (!result[shortDay]) {
      result[shortDay] = {};
    }

    // Use period number as key
    result[shortDay][entry.period_number] = entry;
  });

  return result;
}

export default function WeekTimetable({
  timetable,
  title = "Timetable",
}: TimetableViewerProps) {
  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const mappedTimetbale = groupTimetableByDayAndPeriod(timetable);
  return (
    <div>
      <h2 className="font-bold text-lg text-teal-800">{title}</h2>
      <div className="mt-8 grid grid-cols-5 gap-4">
        {allDays.map((day) => {
          const periods = mappedTimetbale[day];
          return (
            <div key={day} className="grid grid-rows-10 gap-4">
              <div className="rounded-md p-2 text-center bg-teal-800 font-bold text-white row-span-1">
                {day}
              </div>
              {Array.from({ length: 10 }, (_, i) => {
                const periodNumber = i + 1;
                let period = null;
                if (periods) {
                  period = periods[periodNumber] ?? null;
                }
                if (!period) {
                  return (
                    <div
                      className="text-gray-700 italic rounded-md p-2 text-center row-span-1 bg-gray-100"
                      key={day + periodNumber}
                    >
                      Free
                    </div>
                  );
                }
                return (
                  <div
                    className="bg-teal-700 text-white rounded-md p-2 text-center row-span-1"
                    key={day + periodNumber}
                  >
                    {period.classes.join(',')}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
