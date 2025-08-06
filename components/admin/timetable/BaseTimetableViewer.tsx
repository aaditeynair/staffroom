"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Autocomplete,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Box,
} from "@mui/material";

interface Teacher {
  id: string;
  name: string;
}

interface TimetableEntry {
  id: string;
  teacher_id: string;
  class: string;
  period_number: number;
  day_of_week: string;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function BaseTimetableViewer() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [viewMode, setViewMode] = useState<"teacher" | "class">("teacher");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      const { data: timetableData } = await supabase
        .from("base_timetable")
        .select("id, teacher_id, class, period_number, day_of_week");
      setTimetable(timetableData || []);

      const { data: teachersData } = await supabase
        .from("teachers")
        .select("id, name")
        .in("role", ["teacher", "admin-teacher"]);
      setTeachers(teachersData || []);
    }
    fetchData();
  }, []);

  // Get all unique period numbers sorted
  const periodNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

  // Get all classes sorted
  function parseClass(c: string) {
    const match = c.match(/^(\d+)\s*([A-Za-z])$/);
    if (!match) return { grade: 0, section: "Z" }; // fallback (put unknown classes last)
    return { grade: parseInt(match[1], 10), section: match[2].toUpperCase() };
  }

  const sortedClasses = [...new Set(timetable.map((e) => e.class))].sort(
    (a, b) => {
      const pa = parseClass(a);
      const pb = parseClass(b);
      // Compare by grade number first
      if (pa.grade !== pb.grade) return pa.grade - pb.grade;

      // Then compare by section letter alphabetically (A < B < C ... < F < Z)
      if (pa.section < pb.section) return -1;
      if (pa.section > pb.section) return 1;
      return 0;
    },
  );

  // TEACHER MAP
  const teacherMap = Object.fromEntries(teachers.map((t) => [t.id, t.name]));

  // Filter logic
  const filteredTimetable =
    viewMode === "teacher" && selectedTeacher
      ? timetable.filter((t) => t.teacher_id === selectedTeacher)
      : viewMode === "class" && selectedClass
        ? timetable.filter((t) => t.class === selectedClass)
        : [];

  // For each day and period, get the entry for the selected teacher/class
  function getCell(day: string, period: number) {
    const entry = filteredTimetable.find(
      (t) => t.day_of_week === day && t.period_number === period,
    );
    if (!entry) {
      return <span style={{ color: "#bbb", fontStyle: "italic" }}>free</span>;
    }

    if (viewMode === "teacher") {
      return (
        <Box>
          <Typography variant="body2">{entry.class}</Typography>
        </Box>
      );
    } else {
      return (
        <Box>
          <Typography variant="body2">
            {teacherMap[entry.teacher_id] || entry.teacher_id}
          </Typography>
        </Box>
      );
    }
  }

  return (
    <Paper className="p-8 overflow-x-auto">
      <Box sx={{ mb: 2 }} display="flex" gap={2} flexWrap="wrap">
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, mode) => mode && setViewMode(mode)}
          aria-label="View mode"
          size="small"
        >
          <ToggleButton value="teacher">
            <span className="px-2">By Teacher</span>
          </ToggleButton>
          <ToggleButton value="class">
            <span className="px-2">By Class</span>
          </ToggleButton>
        </ToggleButtonGroup>
        {viewMode === "teacher" && (
          <Autocomplete
            size="small"
            className="w-1/4"
            options={teachers}
            getOptionLabel={(option) => option.name}
            value={teachers.find((t) => t.id === selectedTeacher) || null}
            onChange={(_, newValue) =>
              setSelectedTeacher(newValue ? newValue.id : "")
            }
            renderInput={(params) => <TextField {...params} label="Teacher" />}
          />
        )}
        {viewMode === "class" && (
          <Autocomplete
            size="small"
            className="w-1/12"
            options={sortedClasses}
            getOptionLabel={(option) => option}
            value={selectedClass || null}
            onChange={(_, newValue) => setSelectedClass(newValue || "")}
            renderInput={(params) => <TextField {...params} label="Class" />}
          />
        )}
      </Box>

      {/* Only render table if something is selected */}
      {(viewMode === "teacher" ? selectedTeacher : selectedClass) ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <span className="font-bold">Day</span>
                </TableCell>
                {periodNumbers.map((period) => (
                  <TableCell key={period} align="center">
                    {period}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {daysOfWeek.map((day) => (
                <TableRow key={day}>
                  <TableCell>
                    <span className="font-bold">{day}</span>
                  </TableCell>
                  {periodNumbers.map((period) => (
                    <TableCell key={period} align="center">
                      {getCell(day, period) || (
                        <span style={{ color: "#bbb" }}>–</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Please select a {viewMode === "teacher" ? "teacher" : "class"} to view
          the timetable.
        </Typography>
      )}
    </Paper>
  );
}
