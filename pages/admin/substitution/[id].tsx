import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  CircularProgress,
  MenuItem,
  Alert,
  Select,
  InputLabel,
  FormControl,
  Button,
  Snackbar,
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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const createSubstitutions = async () => {
    if (Object.keys(substitutions).length !== teacherTimetable.length) {
      setSnackbar({
        open: true,
        message: "Please select substitute teachers for all periods",
        severity: "error",
      });
      return;
    }

    if (absenceDetails.dealt_with !== true) {
      for (const period in substitutions) {
        const { data, error } = await supabase
          .from("substitutions")
          .insert({
            date: absenceDetails.date,
            period_number: period,
            class: substitutions[period].class,
            substitute_teacher: substitutions[period].substituteID,
            for_absence: absenceDetails.id,
            original_teacher: absenceDetails.teacher.id,
          })
          .select("id, period_number, class, substitute_teacher");

        if (error) {
          setSnackbar({
            open: true,
            message: "An error has occurred. Please try again later",
            severity: "error",
          });
          return;
        }

        data.map((period) => {
          setSubstitutions((prev) => ({
            ...prev,
            [period.period_number]: {
              substituteID: period.substitute_teacher,
              class: period.class,
              id: period.id,
            },
          }));
        });
      }

      const { e } = await supabase
        .from("absences")
        .update({ dealt_with: true })
        .eq("id", absenceDetails.id);

      if (e) {
        setSnackbar({
          open: true,
          message: "An error has occurred. Please try again later",
          severity: "error",
        });
        return;
      } else {
        setSnackbar({
          open: true,
          message: "Substitutions created successfully",
          severity: "success",
        });
        setAbsenceDetails((prev) => ({ ...prev, dealt_with: true }));
      }
    } else {
      for (const period in substitutions) {
        const { error } = await supabase
          .from("substitutions")
          .update({
            substitute_teacher: substitutions[period].substituteID,
          })
          .eq("id", substitutions[period].id);

        if (error) {
          setSnackbar({
            open: true,
            message: "An error has occurred. Please try again later",
            severity: "error",
          });
          return;
        }
      }
      setSnackbar({
        open: true,
        message: "Substitutions updated successfully",
        severity: "success",
      });
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: absence, error: absenceError } = await supabase
        .from("absences")
        .select(
          `
          id,
          date,
          leave_type,
          reason,
          dealt_with,
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
        .select("id, period_number, class")
        .eq("teacher_id", teacher.id)
        .eq("day_of_week", day);

      setTeacherTimetable(timetable || []);

      // Get list of all teachers
      const { data: teachers } = await supabase
        .from("teachers")
        .select("id, name")
        .neq("id", teacher.id);
      setAllTeachers(teachers || []);

      if (absence.dealt_with === true) {
        const { data } = await supabase
          .from("substitutions")
          .select("id, period_number, class, substitute_teacher")
          .eq("for_absence", absence.id);
        if (data !== null) {
          data.map((period) => {
            setSubstitutions((prev) => ({
              ...prev,
              [period.period_number]: {
                substituteID: period.substitute_teacher,
                class: period.class,
                id: period.id,
              },
            }));
          });
        }
      }

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
    <>
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
                      Period {period.period_number}: {period.class}
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
                              ...substitutions[period.period_number],
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity as "success" | "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

