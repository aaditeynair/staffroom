"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";
import UserDeleteModal from "@/components/admin/teachers/UserDeleteModal";
import {
  CircularProgress,
  Alert,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import UserEditModal from "@/components/admin/teachers/UserEditModal";
import WeekTimetable from "@/components/admin/timetable/WeekTimetable";
import TeacherAbsenceItem from "@/components/admin/teachers/TeacherAbsenceItem";
import dayjs from "@/lib/dayjs";

interface Teacher {
  id: string;
  name: string;
  email: string;
  password_set: boolean;
  division: string;
  role: "admin" | "teacher" | "admin-teacher";
}

interface TimetableEntry {
  id: string;
  teacher_id: string;
  day_of_week: string;
  period_number: number;
  class: string;
}

interface Absence {
  id: string;
  teacher_id: string;
  date: string;
  created_at: string;
  reason: string;
  status: string;
  leave_type: string;
  dealt_with: boolean;
}

interface Substitution {
  id: string;
  date: string;
  period_number: string;
  class: string;
  original_teacher: { name: string };
}

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params?.id;

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [timetable, setTimetable] = useState<TimetableEntry[] | []>([]);
  const [upcomingAbsences, setUpcomingAbsences] = useState<Absence[] | []>([]);
  const [recentAbsences, setRecentAbsences] = useState<Absence[] | []>([]);
  const [substitutions, setSubstitutions] = useState<Substitution[] | []>([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    async function fetchTeacher() {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("id", teacherId)
        .single();

      if (error || !data) {
        setErrorMsg("Could not fetch teacher data.");
        setTeacher(null);
      } else {
        setTeacher(data);

        const { data: timetable, error: timetableError } = await supabase
          .from("base_timetable")
          .select("*")
          .eq("teacher_id", data.id);
        if (!timetableError) setTimetable(timetable);

        const today = dayjs();
        const { data: upcomingAbsences, error: upcomingError } = await supabase
          .from("absences")
          .select("*")
          .eq("teacher_id", teacherId)
          .gte("date", today)
          .order("date", { ascending: true });
        if (!upcomingError) setUpcomingAbsences(upcomingAbsences);

        const { data: recentAbsences, error: recentError } = await supabase
          .from("absences")
          .select("*")
          .eq("teacher_id", teacherId)
          .lt("date", today)
          .order("date", { ascending: false })
          .limit(5);
        if (!recentError) setRecentAbsences(recentAbsences);

        const { data: subs, error: subsError } = await supabase
          .from("substitutions")
          .select(
            "id, date, class, period_number, original_teacher",
          )
          .eq("substitute_teacher", teacherId)
          .order("date", { ascending: false })
          .limit(8);

        if (!subsError) {
          const updatedSubs = [];
          for (let i = 0; i < subs.length; i++) {
            const sub = subs[i];
            const { data: ogTeacher, error: teacherError } = await supabase
              .from("teachers")
              .select("name")
              .eq("id", sub.original_teacher)
              .single();
            if (!teacherError && ogTeacher)
              updatedSubs.push({ ...sub, original_teacher: ogTeacher });
          }
          setSubstitutions(updatedSubs);
        }
      }
      setLoading(false);
    }

    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId, router]);

  if (loading) {
    return (
      <div className="p-8 flex text-teal-700 justify-center items-center grow">
        <CircularProgress size="3rem" color="inherit" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center mt-20">
        <Alert severity="error">{errorMsg}</Alert>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex flex-col items-center mt-20">
        <Alert severity="info">Teacher not found.</Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <section className="bg-white rounded-md shadow-md p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-teal-800">{teacher.name}</h1>
            <p className="text-gray-800">{teacher.email}</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setEditOpen(true)}
              size="small"
              variant="outlined"
            >
              Edit User
            </Button>
            <Button
              onClick={() => setDeleteOpen(true)}
              color="error"
              size="small"
              variant="contained"
            >
              Delete User
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="font-bold text-gray-700 text-lg mb-2">About</h2>
          <div className="capitalize space-y-1">
            <p>Role: {teacher.role}</p>
            {teacher.role !== "admin" && <p>Division: {teacher.division}</p>}
            <p>Initialized: {String(teacher.password_set)}</p>
          </div>
        </div>
      </section>

      <UserEditModal
        user={teacher}
        open={editOpen}
        onSaveAction={() => {
          const update = async () => {
            const { data, error } = await supabase
              .from("teachers")
              .select("*")
              .eq("id", teacherId)
              .single();

            if (error || !data) {
              setErrorMsg("Could not fetch teacher data.");
              setTeacher(null);
            } else {
              setTeacher(data);
            }
          };
          update();
        }}
        onCloseAction={() => setEditOpen(false)}
      />
      <UserDeleteModal
        open={deleteOpen}
        onCloseAction={() => setDeleteOpen(false)}
        onSaveAction={() => router.push("/admin/teachers")}
        user={teacher}
      />

      <section className="p-4 md:p-8 bg-white rounded-md shadow-md">
        {timetable && (
          <WeekTimetable title="Weekly Timetable" timetable={timetable} />
        )}
      </section>
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full">
        <div className="p-4 md:p-8 bg-white rounded-md shadow-md grow space-y-8">
          <section>
            <h2 className="font-bold text-lg text-teal-800 mb-4">
              Upcoming Absences
            </h2>
            {upcomingAbsences.length === 0 ? (
              <p className="text-gray-800 italic">No upcoming absences</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {upcomingAbsences.map((absence) => {
                  return (
                    <TeacherAbsenceItem key={absence.id} absence={absence} />
                  );
                })}
              </div>
            )}
          </section>
          <section>
            <h2 className="font-bold text-lg text-teal-800 mb-2 md:mb-4">
              Recent Absences
            </h2>
            {recentAbsences.length === 0 ? (
              <p className="text-gray-800 italic">No recent absences</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {recentAbsences.map((absence) => {
                  return (
                    <TeacherAbsenceItem key={absence.id} absence={absence} />
                  );
                })}
              </div>
            )}
          </section>
        </div>
        <section className="p-4 md:p-8 bg-white rounded-md shadow-md grow">
          <h2 className="font-bold text-lg text-teal-800 mb-2 md:mb-4">
            Substitutions
          </h2>
          {substitutions.length === 0 ? (
            <p className="text-gray-800 italic">No recent substitutions</p>
          ) : (
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Original Teacher</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {substitutions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      {dayjs(sub.date).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>{sub.period_number}</TableCell>
                    <TableCell>{sub.class}</TableCell>
                    <TableCell>{sub.original_teacher.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </div>
    </div>
  );
}
