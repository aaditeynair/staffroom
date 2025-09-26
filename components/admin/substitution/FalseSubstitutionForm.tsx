"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/browser";
import {
  Button,
  Autocomplete,
  TextField,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface Teacher {
  id: string;
  name: string;
  role: string;
}

interface TimetablePeriod {
  id: string;
  teacher_id: string;
  period_number: number;
  classes: string[];
}

interface FalseSubstitutionProps {
  onSubstitutionCreated?: () => void;
}

export default function FalseSubstitutionForm({
  onSubstitutionCreated,
}: FalseSubstitutionProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [presentTeachers, setPresentTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherPeriods, setTeacherPeriods] = useState<TimetablePeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimetablePeriod | null>(
    null,
  );
  const [availableSubstitutes, setAvailableSubstitutes] = useState<Teacher[]>(
    [],
  );
  const [substituteTeacher, setSubstituteTeacher] = useState<Teacher | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fetch present teachers for the selected date
  const fetchPresentTeachers = async () => {
    setLoading(true);

    // Get all teachers
    const { data: allTeachers, error: teachersError } = await supabase
      .from("teachers")
      .select("id, name, role")
      .in("role", ["teacher", "admin-teacher"]);

    if (teachersError) {
      console.error("Error fetching teachers:", teachersError);
      setLoading(false);
      return;
    }

    // Get absent teachers for this date
    const { data: absentTeachers, error: absenceError } = await supabase
      .from("absences")
      .select("teacher_id")
      .eq("date", selectedDate.format("YYYY-MM-DD"))
      .eq("status", "confirmed");

    if (absenceError) {
      console.error("Error fetching absences:", absenceError);
      setLoading(false);
      return;
    }

    // Filter out absent teachers
    const absentTeacherIds = new Set(
      absentTeachers?.map((a) => a.teacher_id) || [],
    );
    const presentTeachersFiltered = (allTeachers || []).filter(
      (teacher) => !absentTeacherIds.has(teacher.id),
    );

    setPresentTeachers(presentTeachersFiltered);
    setLoading(false);
  };

  // Fetch periods for the selected teacher
  const fetchTeacherPeriods = async () => {
    if (!selectedTeacher) {
      setTeacherPeriods([]);
      return;
    }

    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][selectedDate.day()];

    const { data: periods, error } = await supabase
      .from("base_timetable")
      .select("id, teacher_id, period_number, classes")
      .eq("teacher_id", selectedTeacher.id)
      .eq("day_of_week", dayOfWeek)
      .order("period_number", { ascending: true });

    if (error) {
      console.error("Error fetching teacher periods:", error);
      setTeacherPeriods([]);
      return;
    }

    setTeacherPeriods(periods || []);
  };

  // Fetch available substitute teachers for the selected period
  const fetchAvailableSubstitutes = async () => {
    if (!selectedPeriod) {
      setAvailableSubstitutes([]);
      return;
    }

    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][selectedDate.day()];

    // Get all eligible teachers
    const { data: allTeachers, error: teachersError } = await supabase
      .from("teachers")
      .select("id, name, role")
      .in("role", ["teacher", "admin-teacher"]);

    if (teachersError) {
      console.error("Error fetching teachers:", teachersError);
      return;
    }

    // Get teachers who are busy during this period
    const { data: busyTeachers, error: busyError } = await supabase
      .from("base_timetable")
      .select("teacher_id")
      .eq("day_of_week", dayOfWeek)
      .eq("period_number", selectedPeriod.period_number);

    if (busyError) {
      console.error("Error fetching busy teachers:", busyError);
      return;
    }

    // Get absent teachers for this date
    const { data: absentTeachers, error: absenceError } = await supabase
      .from("absences")
      .select("teacher_id")
      .eq("date", selectedDate.format("YYYY-MM-DD"))
      .eq("status", "confirmed");

    if (absenceError) {
      console.error("Error fetching absences:", absenceError);
      return;
    }

    // Create sets of unavailable teacher IDs
    const busyTeacherIds = new Set(
      busyTeachers?.map((t) => t.teacher_id) || [],
    );
    const absentTeacherIds = new Set(
      absentTeachers?.map((a) => a.teacher_id) || [],
    );

    // Filter available substitutes
    const availableTeachers = (allTeachers || []).filter(
      (teacher) =>
        !busyTeacherIds.has(teacher.id) &&
        !absentTeacherIds.has(teacher.id) &&
        teacher.id !== selectedTeacher?.id, // Exclude the original teacher
    );

    setAvailableSubstitutes(availableTeachers);
  };

  // Create the false substitution
  const createFalseSubstitution = async () => {
    if (!selectedPeriod || !substituteTeacher || !selectedTeacher) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    setCreating(true);

    try {
      // Insert into substitutions table
      const { error: substitutionError } = await supabase
        .from("substitutions")
        .insert({
          date: selectedDate.format("YYYY-MM-DD"),
          period_number: selectedPeriod.period_number,
          classes: selectedPeriod.classes,
          original_teacher: selectedTeacher.id,
          substitute_teacher: substituteTeacher.id,
        });

      if (substitutionError) {
        throw substitutionError;
      }

      // // Create entry in daily_timetable
      // const { error: dailyTimetableError } = await supabase
      //   .from("daily_timetable")
      //   .insert({
      //     date: selectedDate.format("YYYY-MM-DD"),
      //     teacher_id: substituteTeacher.id,
      //     period_number: selectedPeriod.period_number,
      //     class: selectedPeriod.class,
      //     is_substitute: true,
      //     absent_for_id: selectedTeacher.id,
      //   });
      //
      // if (dailyTimetableError) {
      //   throw dailyTimetableError;
      // }
      //
      setSnackbar({
        open: true,
        message: "Manual substitution created successfully",
        severity: "success",
      });

      // Reset form
      setSelectedTeacher(null);
      setSelectedPeriod(null);
      setSubstituteTeacher(null);
      setTeacherPeriods([]);
      setAvailableSubstitutes([]);

      // Callback to parent component
      onSubstitutionCreated?.();
    } catch (error: unknown) {
      console.error("Error creating substitution:", error);
      setSnackbar({
        open: true,
        message: "Error creating substitution. Please try again.",
        severity: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  // Reset dependent fields when date changes
  useEffect(() => {
    setSelectedTeacher(null);
    setSelectedPeriod(null);
    setSubstituteTeacher(null);
    setTeacherPeriods([]);
    setAvailableSubstitutes([]);
    fetchPresentTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Fetch teacher periods when teacher is selected
  useEffect(() => {
    setSelectedPeriod(null);
    setSubstituteTeacher(null);
    setAvailableSubstitutes([]);
    fetchTeacherPeriods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeacher]);

  // Fetch available substitutes when period is selected
  useEffect(() => {
    setSubstituteTeacher(null);
    fetchAvailableSubstitutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  return (
    <div className="m-6 md:m-8">
      <h1 className="text-xl text-teal-700 font-bold mb-6">
        Create Manual Substitution
      </h1>

      <div className="flex flex-col gap-4 my-4">
        {/* Date Selection */}
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDate}
              onChange={(newDate) => {
                if (newDate) setSelectedDate(newDate);
              }}
              format="DD-MM-YYYY"
              className="w-full"
            />
          </LocalizationProvider>
        </div>

        {/* Present Teacher Selection */}
        <div>
          <Autocomplete
            options={presentTeachers}
            getOptionLabel={(option) => option.name}
            value={selectedTeacher}
            onChange={(_, newValue) => setSelectedTeacher(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Present Teacher"
                className="z-0"
              />
            )}
            disabled={loading || presentTeachers.length === 0}
          />
        </div>

        {/* Teacher's Periods Selection */}
        <div>
          <Autocomplete
            options={teacherPeriods}
            getOptionLabel={(option) =>
              `Period ${option.period_number}: ${option.classes.join(',')}`
            }
            value={selectedPeriod}
            onChange={(_, newValue) => setSelectedPeriod(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Period" className="z-0" />
            )}
            disabled={!selectedTeacher || teacherPeriods.length === 0}
          />
        </div>

        {/* Substitute Teacher Selection */}
        <div>
          <Autocomplete
            options={availableSubstitutes}
            getOptionLabel={(option) => option.name}
            value={substituteTeacher}
            onChange={(_, newValue) => setSubstituteTeacher(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Substitute Teacher"
                className="z-0"
              />
            )}
            disabled={!selectedPeriod || availableSubstitutes.length === 0}
          />
        </div>

        {/* Create Button */}
        <div>
          <Button
            variant="contained"
            onClick={createFalseSubstitution}
            disabled={
              creating ||
              !selectedPeriod ||
              !substituteTeacher ||
              !selectedTeacher
            }
            className="bg-teal-700 hover:bg-teal-800"
          >
            {creating ? (
              <>
                <CircularProgress size={20} className="mr-2" />
                Creating...
              </>
            ) : (
              "Create Manual Substitution"
            )}
          </Button>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedTeacher && selectedPeriod && (
        <Card className="mb-4">
          <CardContent>
            <Typography variant="h6" className="mb-4 text-teal-700">
              Substitution Summary
            </Typography>
            <div className="flex flex-col gap-2 mt-2">
              <p>Date: {selectedDate.format("dddd, DD MMMM YYYY")}</p>
              <p>Original Teacher: {selectedTeacher.name}</p>
              <p>
                Period & Class: Period {selectedPeriod.period_number}:{" "}
                {selectedPeriod.classes.join(',')}
              </p>
              <p>
                Substitute Teacher:{" "}
                {substituteTeacher ? substituteTeacher.name : "Not selected"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      {loading && (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      )}

      {!loading && presentTeachers.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1" className="text-gray-500 text-center">
              No teachers are present on{" "}
              {selectedDate.format("dddd, DD MMMM YYYY")}
            </Typography>
          </CardContent>
        </Card>
      )}

      {!loading && selectedTeacher && teacherPeriods.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1" className="text-gray-500 text-center">
              {selectedTeacher.name} has no periods on{" "}
              {selectedDate.format("dddd, DD MMMM YYYY")}
            </Typography>
          </CardContent>
        </Card>
      )}

      {!loading && selectedPeriod && availableSubstitutes.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1" className="text-gray-500 text-center">
              No teachers are available to substitute for Period{" "}
              {selectedPeriod.period_number}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
