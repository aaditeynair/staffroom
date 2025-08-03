"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import dayjs from "@/lib/dayjs";
import { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { supabase } from "@/lib/supabaseClient";

interface Teacher {
  id: string;
  name: string;
}

interface Substitution {
  id: string;
  date: string;
  period_number: number;
  class: string;
  original_teacher: Teacher;
  substitute_teacher: Teacher;
  confirmed_by_teacher: "unconfirmed" | "accepted" | "declined";
}

interface Filters {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  classFilter: string;
  statusFilter: string;
  originalTeacherFilter: string;
}

export default function UpcomingSubstitutions() {
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    startDate: dayjs().startOf("day"),
    endDate: dayjs().add(7, "day").endOf("day"),
    classFilter: "",
    statusFilter: "",
    originalTeacherFilter: "",
  });

  // Function to fetch data from Supabase
  async function fetchData() {
    setLoading(true);

    try {
      // Fetch substitutions over an extended date range (e.g. next 30 days)
      const { data: subsData, error: subsError } = await supabase
        .from("substitutions")
        .select("*")
        .gte("date", filters.startDate?.toISOString() ?? null)
        .lte("date", filters.endDate?.toISOString() ?? null)
        .order("date", { ascending: true })
        .order("period_number", { ascending: true });

      if (subsError) throw subsError;
      if (!subsData) setSubstitutions([]);
      else {
        const subs: Substitution[] = [];
        for (let i = 0; i < subsData.length; i++) {
          const s = subsData[i];
          console.log(s.original_teacher, s);
          const { data: originalTeacher, error: ogTeacherError } =
            await supabase
              .from("teachers")
              .select("id, name")
              .eq("id", s.original_teacher)
              .single();

          const { data: substituteTeacher, error: subTeacherError } =
            await supabase
              .from("teachers")
              .select("id, name")
              .eq("id", s.substitute_teacher)
              .single();

          if (ogTeacherError) {
            console.error(ogTeacherError);
            continue;
          }
          if (subTeacherError) {
            console.error(ogTeacherError);
            continue;
          }
          if (!originalTeacher || !substituteTeacher) continue;

          subs.push({
            id: s.id,
            date: s.date,
            period_number: s.period_number,
            class: s.class,
            original_teacher: originalTeacher,
            substitute_teacher: substituteTeacher,
            confirmed_by_teacher: s.confirmed_by_teacher,
          });
        }
        console.log(subs);
        setSubstitutions(subs);
      }

      // Fetch all classes from base_timetable (unique)
      const { data: classData, error: classError } = await supabase
        .from("base_timetable")
        .select("class")
        .order("class", { ascending: true });

      if (!classError && classData) {
        const uniqueClasses = [
          ...new Set(classData?.map((r) => r.class)),
        ].sort();
        setClasses(uniqueClasses);
      }

      // Fetch all teachers (for filter dropdown)
      const { data: teacherData, error: teacherError } = await supabase
        .from("teachers")
        .select("id, name");

      if (!teacherError && teacherData) {
        setTeachers(teacherData);
      }
    } catch (err) {
      console.error(err);
      setSubstitutions([]);
      setClasses([]);
      setTeachers([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate, filters.endDate]);

  // Filter substitutions based on UI filters
  const filteredSubs = useMemo(() => {
    return substitutions.filter((sub) => {
      const dateOk =
        (!filters.startDate ||
          dayjs(sub.date).isSameOrAfter(filters.startDate, "day")) &&
        (!filters.endDate ||
          dayjs(sub.date).isSameOrBefore(filters.endDate, "day"));
      const classOk = filters.classFilter
        ? sub.class === filters.classFilter
        : true;
      const statusOk = filters.statusFilter
        ? sub.confirmed_by_teacher === filters.statusFilter
        : true;
      const teacherOk = filters.originalTeacherFilter
        ? sub.original_teacher.id === filters.originalTeacherFilter
        : true;
      return dateOk && classOk && statusOk && teacherOk;
    });
  }, [substitutions, filters]);

  // Handle filter changes
  function handleFilterChange<K extends keyof Filters>(
    key: K,
    value: Filters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="p-8 flex flex-col">
      <h1 className="text-xl text-teal-700 font-bold mb-6">
        Upcoming Substitutions
      </h1>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(newVal) => handleFilterChange("startDate", newVal)}
                slotProps={{ textField: { fullWidth: true } }}
                maxDate={filters.endDate || undefined}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(newVal) => handleFilterChange("endDate", newVal)}
                slotProps={{ textField: { fullWidth: true } }}
                minDate={filters.startDate || undefined}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/6">
            <FormControl fullWidth size="small">
              <InputLabel id="class-filter-label">Class</InputLabel>
              <Select
                labelId="class-filter-label"
                label="Class"
                value={filters.classFilter}
                onChange={(e) =>
                  handleFilterChange("classFilter", e.target.value)
                }
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="w-1/5">
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Status"
                value={filters.statusFilter}
                onChange={(e) =>
                  handleFilterChange("statusFilter", e.target.value)
                }
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="unconfirmed">Unconfirmed</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="declined">Declined</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="w-1/5">
            <Autocomplete
              size="small"
              options={teachers}
              getOptionLabel={(option) => option.name}
              value={
                teachers.find((t) => t.id === filters.originalTeacherFilter) ||
                null
              }
              onChange={(_, newValue) =>
                handleFilterChange(
                  "originalTeacherFilter",
                  newValue ? newValue.id : "",
                )
              }
              renderInput={(params) => (
                <TextField {...params} label="Original Teacher" />
              )}
              clearOnEscape
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="pt-18 flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Original Teacher</TableCell>
              <TableCell>Substitute Teacher</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No substitutions found for the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubs.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    {dayjs(sub.date).format("ddd, DD MMM YYYY")}
                  </TableCell>
                  <TableCell>{sub.period_number}</TableCell>
                  <TableCell>{sub.class}</TableCell>
                  <TableCell>{sub.original_teacher.name}</TableCell>
                  <TableCell>
                    {substituteTeacherDisplay(sub.substitute_teacher)}
                  </TableCell>
                  <TableCell>
                    {capitalizeFirstLetter(sub.confirmed_by_teacher)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

// Optional helper functions
function substituteTeacherDisplay(teacher: Teacher | null | undefined) {
  return teacher?.name || "Unassigned";
}

function capitalizeFirstLetter(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
