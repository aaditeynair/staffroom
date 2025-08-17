"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";

async function sendInvite(email: string) {
  const { data, error } = await supabase.functions.invoke("inviteUser", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
}

export default function NewUserForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "teacher" as "teacher" | "admin" | "admin-teacher",
    division: "Junior" as "Junior" | "Senior",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (inviteSuccessMsg) {
      const timer = setTimeout(() => {
        setInviteSuccessMsg(null);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [inviteSuccessMsg]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setInviteSuccessMsg(null);

    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg("Name and email are required.");
      return;
    }

    // If teacher/admin-teacher, ensure division selected
    if (
      (form.role === "teacher" || form.role === "admin-teacher") &&
      !form.division
    ) {
      setErrorMsg("Division is required for teachers and admin-teachers.");
      return;
    }

    setLoading(true);

    const divisionValue = form.role === "admin" ? "senior" : form.division;
    const { error: insertError } = await supabase.from("teachers").insert([
      {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        division: divisionValue,
      },
    ]);

    if (insertError) {
      setLoading(false);
      setErrorMsg(insertError.message);
      return;
    }

    await sendInvite(form.email.trim());
    setLoading(false);

    setForm({ name: "", email: "", role: "teacher", division: "Junior" });
    setInviteSuccessMsg(`Invitation sent to ${form.email.trim()}`);

    // Refresh the lists instantly
    router.refresh();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-row justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-teal-700">New User</h2>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          <span className="px-4">{loading ? "Adding..." : "Add User"}</span>
        </Button>
      </div>

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {inviteSuccessMsg && <Alert severity="success">{inviteSuccessMsg}</Alert>}

      <TextField
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        fullWidth
      />

      <TextField
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Role</InputLabel>
        <Select
          value={form.role}
          label="Role"
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value as "teacher" | "admin" | "admin-teacher",
            })
          }
        >
          <MenuItem value="teacher">Teacher</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="admin-teacher">Admin-Teacher</MenuItem>
        </Select>
      </FormControl>

      {(form.role === "teacher" || form.role === "admin-teacher") && (
        <FormControl fullWidth>
          <InputLabel>Division</InputLabel>
          <Select
            value={form.division}
            label="Division"
            onChange={(e) =>
              setForm({
                ...form,
                division: e.target.value as "Junior" | "Senior",
              })
            }
          >
            <MenuItem value="Junior">Junior</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
          </Select>
        </FormControl>
      )}
    </form>
  );
}
