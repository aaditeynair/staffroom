import { supabase } from "@/lib/supabase/browser";
import getClassDivision from "@/lib/getClassDivision";
import getSubstitutionCandidates from "@/lib/substitutionEngine";
import dayjs from "dayjs";

interface Teacher {
  id: string;
  name: string;
  division: string;
  score: number;
}

interface TimetablePeriod {
  id: string;
  period_number: number;
  class: string;
}

export default async function fetchAvailableTeachers({
  absentTeacherId,
  date,
  timetable,
}: {
  absentTeacherId: string;
  date: string;
  timetable: TimetablePeriod[];
}): Promise<Record<number, Teacher[]>> {
  const day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][dayjs(date).day()];

  // Get all teachers except the absent one
  const { data: allTeachers } = await supabase
    .from("teachers")
    .select("id, name, division")
    .in("role", ["teacher", "admin-teacher"])
    .neq("id", absentTeacherId);
  const teachers = allTeachers || [];

  // Build class → teachers map
  const classesInTimetable = [...new Set(timetable.map((p) => p.class))];
  const teachersByClassMap: Record<string, Set<string>> = {};
  for (const cls of classesInTimetable) {
    const { data: classTeachers, error } = await supabase
      .from("base_timetable")
      .select("teacher_id")
      .eq("class", cls);

    if (error) console.error(error);
    teachersByClassMap[cls] = new Set(
      classTeachers?.map((r) => r.teacher_id) || [],
    );
  }

  // All periods of the day
  const allPeriods = Array.from(
    new Set(
      (
        await supabase
          .from("base_timetable")
          .select("period_number")
          .eq("day_of_week", day)
      ).data?.map((r) => r.period_number) || [],
    ),
  ).sort((a, b) => a - b);

  // Timetable map: teacher → busy array
  const timetableMap: Record<string, boolean[]> = {};
  for (const t of teachers) {
    const { data: baseData } = await supabase
      .from("base_timetable")
      .select("period_number")
      .eq("teacher_id", t.id)
      .eq("day_of_week", day);

    const { data: dailyData } = await supabase
      .from("daily_timetable")
      .select("period_number")
      .eq("teacher_id", t.id)
      .eq("date", date);
    const { data: absencesData } = await supabase
      .from("absences")
      .select("id")
      .eq("teacher_id", t.id)
      .eq("date", date)
      .eq("status", "confirmed");

    const busyPeriodsSet = new Set<number>([
      ...(baseData?.map((p) => p.period_number) || []),
      ...(dailyData?.map((p) => p.period_number) || []),
    ]);
    const isAbsent = (absencesData?.length ?? 0) > 0;

    timetableMap[t.id] = allPeriods.map((p) =>
      isAbsent ? true : busyPeriodsSet.has(p),
    );
  }

  // Generate candidates per period
  const availableTeachersByPeriod: Record<number, Teacher[]> = {};
  for (const period of timetable) {
    const targetClass = period.class;
    const teachersWhoTeachTargetClass =
      teachersByClassMap[targetClass] || new Set();

    const notBusyTeachers = teachers.filter((t) => {
      const busyToday = timetableMap[t.id] || [];
      const periodIndex = allPeriods.indexOf(period.period_number);
      if (periodIndex === -1) return false;
      return !busyToday[periodIndex];
    });
    const targetDivision = getClassDivision(period.class);
    availableTeachersByPeriod[period.period_number] = getSubstitutionCandidates(
      {
        availableTeachers: notBusyTeachers,
        teachersWhoTeachTargetClass,
        timetableMap,
        targetDivision,
      },
    );
  }

  return availableTeachersByPeriod;
}
