"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import fetchAvailableTeachers from "@/lib/fetchAvailableTeachers";
import {
  CircularProgress,
  Alert,
  Autocomplete,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import dayjs from "dayjs";
import AbsenceDetailCard from "@/components/admin/absence/AbsenceDetailCard";
import { useParams } from "next/navigation";

interface Teacher {
  id: string;
  name: string;
  division: string;
  score: number;
}

interface AbsenceDetails {
  id: string;
  date: string;
  leave_type: string;
  reason: string;
  dealt_with: boolean;
  teacher: Teacher;
}

interface TimetablePeriod {
  id: string;
  period_number: number;
  class: string;
}

interface SubstitutionInfo {
  substituteID: string | undefined;
  class: string;
  id?: string;
  fallbackID?:string | undefined
}

export default function AbsenceIDPage() {
  const params = useParams();
  const id =
    params?.id && (typeof params.id === "string" ? params.id : params.id[0]);

  const [loading, setLoading] = useState(true);
  const [absenceDetails, setAbsenceDetails] = useState<AbsenceDetails | null>(
    null,
  );
  const [teacherTimetable, setTeacherTimetable] = useState<TimetablePeriod[]>(
    [],
  );
  const [availableTeachersByPeriod, setAvailableTeachersByPeriod] = useState<
    Record<number, Teacher[]>
  >({});
  const [substitutions, setSubstitutions] = useState<
    Record<string, SubstitutionInfo>
  >({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
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
    if (absenceDetails && absenceDetails.dealt_with !== true) {
      for (const period in substitutions) {
        const periodNumber = Number(period);
        const fallbackTeacher =
            substitutions[period].fallbackID ||
            (availableTeachersByPeriod[periodNumber] || []).find(
            (t) => t.id !== substitutions[period].substituteID,
            )?.id || null;

        const { data, error } = await supabase
          .from("substitutions")
          .insert({
            date: absenceDetails.date,
            period_number: period,
            class: substitutions[period].class,
            original_teacher: absenceDetails.teacher.id,
            substitute_teacher: substitutions[period].substituteID,
            for_absence: absenceDetails.id,
            fallback: fallbackTeacher,
          })
          .select("id, period_number, class, substitute_teacher");

        if (error) {
          console.error(error);
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

      const { error } = await supabase
        .from("absences")
        .update({ dealt_with: true })
        .eq("id", absenceDetails.id);

      if (error) {
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
        setAbsenceDetails((prev) =>
          prev ? { ...prev, dealt_with: true } : prev,
        );
      }
    } else {
      for (const period in substitutions) {
        const periodNumber = Number(period);
        const fallbackTeacher =
            substitutions[period].fallbackID ||
            (availableTeachersByPeriod[periodNumber] || []).find(
            (t) => t.id !== substitutions[period].substituteID,
            )?.id || null;
        const { error } = await supabase
          .from("substitutions")
          .update({
            substitute_teacher: substitutions[period].substituteID,
            fallback: fallbackTeacher,
            accepted: true,
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

      // Fetch Absence Details
      const { data: absence, error: absenceError } = await supabase
        .from("absences")
        .select("*")
        .eq("id", id)
        .single();

      if (absenceError || !absence) {
        console.error("Invalid absence ID", absenceError);
        setLoading(false);
        return;
      }

      const { data: teacher, error: teacherError } = await supabase
        .from("teachers")
        .select("id, name")
        .eq("id", absence.teacher_id)
        .single();

      if (teacherError || !teacher) {
        console.error("Teacher Problem", teacherError);
        setLoading(false);
        return;
      }

      setAbsenceDetails({ ...absence, teacher });

      const { date } = absence;
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

      if (!timetable) {
        setTeacherTimetable([]);
        setLoading(false);
        return;
      }
      setTeacherTimetable(timetable);

     const availableTeachersByPeriod = await fetchAvailableTeachers({
      absentTeacherId: teacher.id,
      date: absence.date,
      day,
      timetable,
    });
      // Set to state for rendering
      setAvailableTeachersByPeriod(availableTeachersByPeriod);

      // Update substitutions if already created
      if (absence.dealt_with === true) {
        const { data } = await supabase
          .from("substitutions")
          .select("id, period_number, class, substitute_teacher, fallback")
          .eq("for_absence", absence.id);
        if (data !== null) {
          data.map((period) => {
            setSubstitutions((prev) => ({
              ...prev,
              [period.period_number]: {
                substituteID: period.substitute_teacher,
                class: period.class,
                id: period.id,
                fallbackID: period.fallback
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
      <div className="p-8 flex text-teal-700 justify-center items-center grow">
        <CircularProgress size="3rem" color="inherit" />
      </div>
    );

  return (
    <>
      <h1 className="text-2xl font-bold mb-8 text-teal-700">
        Substitution Management for {absenceDetails.teacher.name} on{" "}
        {dayjs(absenceDetails.date).format("dddd, DD MMMM YYYY")}
      </h1>

      {teacherTimetable.length === 0 ? (
        <p>No periods need substitution for this teacher on this day.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:hidden">
            <AbsenceDetailCard absenceDetails={absenceDetails} />
          </div>
          <div className="flex flex-col gap-4 mb-4 md:mb-0">
            {teacherTimetable.map((period) => {

              return (
                <div
                  key={period.id}
                  className="bg-white px-4 py-6 rounded-md shadow-md"
                >
                  <h2 className="mb-4">
                    Period {period.period_number}: {period.class}
                  </h2>
                  <Autocomplete
                    fullWidth
                    disableClearable
                    options={
                      availableTeachersByPeriod[period.period_number] || []
                    }
                    getOptionLabel={(option) => option.name}
                    value={
                      (
                        availableTeachersByPeriod[period.period_number] || []
                      ).find(
                        (t) =>
                          t.id === substitutions[period.period_number]?.substituteID,
                      ) ?? undefined
                    }
                    onChange={(_, newValue) => {
                      setSubstitutions((prev) => ({
                        ...prev,
                        [period.period_number]: {
                          ...substitutions[period.period_number],
                          substituteID: newValue?.id ?? undefined,
                          class: period.class,
                          fallbackID: undefined,
                        },
                      }));
                    }}
                    renderOption={(props, option) => {
                      const { key, ...rest } = props;
                      const colour =
                        option.score > 4
                          ? "bg-green-700"
                          : option.score <= 2
                            ? "bg-red-700"
                            : "bg-amber-500";
                      return (
                        <li
                          key={key}
                          {...rest}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {option.name}
                          <div
                            className={`h-2 w-2 rounded-full ${colour}`}
                          ></div>
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Substitute Teacher"
                      />
                    )}
                  />
                  {substitutions[period.period_number]?.substituteID && (
                  <Autocomplete
                    className="mt-4"
                    fullWidth
                    options={(availableTeachersByPeriod[period.period_number] || []).filter(
                      t => t.id !== substitutions[period.period_number]?.substituteID
                    )}
                    getOptionLabel={(option) => option.name}
                    value={(availableTeachersByPeriod[period.period_number] || []).find(
                      t => t.id === substitutions[period.period_number]?.fallbackID
                    ) ?? undefined }
                    onChange={(_, newValue) => {
                      setSubstitutions((prev) => ({
                        ...prev,
                        [period.period_number]: {
                          ...substitutions[period.period_number],
                          fallbackID: newValue?.id ?? undefined,
                        },
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Fallback Teacher" />
                    )}
                  />
                  )}
                </div>
              );
            })}
          </div>
          <div className="h-fit">
            <div className="hidden md:block">
              <AbsenceDetailCard absenceDetails={absenceDetails} />
            </div>
            <Button
              className="w-full"
              variant="contained"
              onClick={() => {
                createSubstitutions();
              }}
            >
              <p className="py-2 font-bold">
                {absenceDetails.dealt_with ? "Update" : "Confirm"} Substitutions
              </p>
            </Button>
          </div>
        </div>
      )}
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
