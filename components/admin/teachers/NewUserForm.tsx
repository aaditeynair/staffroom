"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
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

export default function NewUserForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "teacher" as "teacher" | "admin" | "admin-teacher",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg("Name and email are required.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("teachers").insert([
      {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      },
    ]);

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Clear form
    setForm({ name: "", email: "", role: "teacher" });

    // Refresh the lists
    router.refresh();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-row align-center justify-between">
        <h2 className="text-xl font-bold text-teal-700 mb-2">New Teacher</h2>
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
    </form>
  );
}
