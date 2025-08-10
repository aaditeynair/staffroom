"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";

type Role = "admin" | "teacher" | "admin-teacher";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  division: string;
}

interface UserEditFormProps {
  user: User;
  onSaveAction: (updated: User) => void;
  onCancelAction: () => void;
}

export default function UserEditForm({
  user,
  onSaveAction,
  onCancelAction,
}: UserEditFormProps) {
  const [form, setForm] = useState<User>(user);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (field: keyof User, value: string) => {
    setForm({ ...form, [field]: value } as User);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);

    const { error } = await supabase
      .from("teachers")
      .update({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        division: form.division,
      })
      .eq("id", form.id);

    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (onSaveAction) onSaveAction(form);
    router.refresh();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}
    >
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <TextField
        label="Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        required
      />

      <TextField
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        fullWidth
        required
      />

      <FormControl fullWidth required>
        <InputLabel>Role</InputLabel>
        <Select
          value={form.role}
          label="Role"
          onChange={(e) => handleChange("role", e.target.value)}
        >
          <MenuItem value="teacher">Teacher</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="admin-teacher">Admin-Teacher</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Division</InputLabel>
        <Select
          value={form.division}
          label="Division"
          onChange={(e) => handleChange("division", e.target.value)}
        >
          <MenuItem value="Junior">Junior</MenuItem>
          <MenuItem value="Senior">Senior</MenuItem>
        </Select>
      </FormControl>

      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={1}
        sx={{ mt: 1 }}
      >
        <Button onClick={onCancelAction} variant="outlined" disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </Stack>
    </Box>
  );
}
