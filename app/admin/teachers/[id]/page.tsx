"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";
import UserDeleteModal from "@/components/admin/teachers/UserDeleteModal";
import { CircularProgress, Alert, Button } from "@mui/material";
import UserEditModal from "@/components/admin/teachers/UserEditModal";
import WeekTimetable from "@/components/admin/timetable/WeekTimetable";

export default function TeacherDetailPage() {
  const params = useParams();
  const teacherId = params?.id;

  const [teacher, setTeacher] = useState<any>(null);
  const [timetable, setTimetable] = useState<any>(null);

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
        const { data: timetable, error: timetableError } = await supabase
          .from("base_timetable")
          .select("*")
          .eq("teacher_id", data.id);
        if (!timetableError) {
          setTimetable(timetable);
        }
        setTeacher(data);
      }
      setLoading(false);
    }

    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-20">
        <CircularProgress />
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
    <div className="flex flex-col gap-8">
      <section className="bg-white rounded-md shadow-md p-8">
        <div className="flex justify-between items-center">
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
        onCloseAction={() => setEditOpen(false)}
      />
      <UserDeleteModal
        open={deleteOpen}
        onCloseAction={() => setDeleteOpen(false)}
        user={teacher}
      />

      <section className="p-8 bg-white rounded-md shadow-md">
        <WeekTimetable timetable={timetable} />
      </section>
      <div className="flex gap-8 w-full">
        <section className="p-8 bg-white rounded-md shadow-md grow">
          Absences
        </section>
        <section className="p-8 bg-white rounded-md shadow-md grow">
          Substitutions
        </section>
      </div>
    </div>
  );
}
