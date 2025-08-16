"use client";

import { useState } from "react";
import {
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
} from "@mui/material";
import { supabase } from "@/lib/supabase/browser";

interface User {
  id: string;
  name: string;
  email: string;
  division: string;
  role: "admin" | "teacher" | "admin-teacher";
}

interface UserDeleteModalProps {
  open: boolean;
  onCloseAction: () => void;
  onSaveAction: () => void;
  user: User;
}

export default function UserDeleteModal({
  open,
  onCloseAction,
  onSaveAction,
  user,
}: UserDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase
      .from("teachers")
      .delete()
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      setErrorMsg(error.message || "Failed to delete user.");
      return;
    }

    onSaveAction();
    onCloseAction();
  };

  return (
    <Dialog open={open} onClose={onCloseAction} maxWidth="xs" fullWidth>
      <DialogContent>
        <div>
          <h1 className="font-bold text-xl mb-4 text-teal-800">
            Delete Teacher
          </h1>
          <p>
            Are you sure you want to delete <strong>{user.name}</strong>?
          </p>
          <p className="text-sm text-gray-700">This action cannot be undone</p>

          {errorMsg && (
            <Alert severity="error" className="mt-4">
              {errorMsg}
            </Alert>
          )}

          <div className="mt-6 flex gap-4">
            <Button
              variant="outlined"
              fullWidth
              onClick={onCloseAction}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              color="error"
              variant="contained"
              disabled={loading}
              onClick={handleDelete}
              startIcon={
                loading ? <CircularProgress size={18} color="inherit" /> : null
              }
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
