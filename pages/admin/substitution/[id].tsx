import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import dayjs from "dayjs";

export default function SubstitutionPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [absenceDetails, setAbsenceDetails] = useState<any>(null);
  const [teacherTimetable, setTeacherTimetable] = useState<any[]>([]);
  const [allTeachers, setAllTeachers] = useState<any[]>([]);
  const [substitutions, setSubstitutions] = useState<Record<string, string>>(
    {},
  );

  const createSubstitutions = async () => {
    if (Object.keys(substitutions).length !== teacherTimetable.length) {
      console.log("no");
      return;
    }

    for (const period in substitutions) {
      const { error } = await supabase.from("substitutions").insert({
        date: absenceDetails.date,
        period_number: period,
        class: substitutions[period].class,
        substitute_teacher: substitutions[period].substituteID,
        for_absence: absenceDetails.id,
        original_teacher: absenceDetails.teacher.id,
      });

      if (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      // Get absence details
      const { data: absence, error: absenceError } = await supabase
        .from("absences")
        .select(
          `
          id,
          date,
          leave_type,
          reason,
          teacher:teacher_id ( id, name )
        `,
        )
        .eq("id", id)
        .single();

      if (absenceError || !absence) {
        console.error("Invalid absence ID", absenceError);
        setLoading(false);
        return;
      }

      setAbsenceDetails(absence);

      const { date, teacher } = absence;
      const day = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][dayjs(date).day()];

      // Get timetable for the absent teacher
      const { data: timetable } = await supabase
        .from("base_timetable")
        .select("id, period_number, class, division")
        .eq("teacher_id", teacher.id)
        .eq("day_of_week", day);

      setTeacherTimetable(timetable || []);

      // Get list of all teachers
      const { data: teachers } = await supabase
        .from("teachers")
        .select("id, name")
        .neq("id", teacher.id);
      setAllTeachers(teachers || []);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading || !absenceDetails)
    return (
      <div className="m-8 flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );

  return (
    <div className="m-8">
      <h1 className="text-2xl font-bold mb-8 text-teal-700">
        Substitution Management for {absenceDetails.teacher.name} on{" "}
        {dayjs(absenceDetails.date).format("dddd, DD MMMM YYYY")}
      </h1>

      {teacherTimetable.length === 0 ? (
        <p>No periods need substitution for this teacher on this day.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            {teacherTimetable.map((period) => {
              let value = "";
              if (substitutions[period.period_number] !== undefined) {
                value = substitutions[period.period_number].substituteID;
              }
              return (
                <div
                  key={period.id}
                  className="bg-white px-4 py-6 rounded-md shadow-md"
                >
                  <h2 className="mb-2">
                    Period {period.period_number}:{" "}
                    {period.class + " " + period.division}
                  </h2>
                  <FormControl fullWidth>
                    <InputLabel>Select Substitute Teacher</InputLabel>
                    <Select
                      value={value}
                      label="Select Substitute Teacher"
                      onChange={(e) => {
                        setSubstitutions((prev) => ({
                          ...prev,
                          [period.period_number]: {
                            substituteID: e.target.value,
                            class: period.class,
                          },
                        }));
                      }}
                    >
                      {allTeachers.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                          {t.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              );
            })}
          </div>
          <div className="h-fit">
            <div className="p-4 bg-white rounded-md shadow-md mb-4">
              <p className="mb-4">
                <b className="text-teal-700">Date: </b>
                {absenceDetails.date}
              </p>
              <p className="mb-4">
                <b className="text-teal-700">Type: </b>
                {absenceDetails.leave_type}
              </p>
              <p>
                <b className="text-teal-700">Reason: </b>
                {absenceDetails.reason}
              </p>
            </div>
            <Button
              className="w-full"
              variant="contained"
              onClick={() => {
                createSubstitutions();
              }}
            >
              <p className="py-2 font-bold">Confirm Substitutions</p>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
