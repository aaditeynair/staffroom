import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CloseIcon from "@mui/icons-material/Close";
import { VisibilityRounded, VisibilityOffRounded } from "@mui/icons-material";

type ChangePasswordProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePassword({ open, onClose }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const user = (await supabase.auth.getUser()).data.user;
    const email = user?.email;

    if (!email) {
      setError("No email found.");
      setLoading(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      setError("Current password is incorrect.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError("Failed to update password.");
      console.log(updateError)
    } else {
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("")
    }

    setLoading(false);
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("")
    setSuccess("")
    setError("")
    setShow({
    current: false,
    new: false,
    confirm: false,
    })
    onClose()    
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent >
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-2xl text-center text-teal-700 py-4"> Change Password </h1>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </div>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4 w-[300px]">

          <div className="relative">
            <TextField
              label="Current Password"
              type={show.current ? "text" : "password"}
              fullWidth
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((prev) => ({ ...prev, current: !prev.current }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {show.current ? <VisibilityRounded /> : <VisibilityOffRounded />}
            </button>
          </div>
          <div className="relative">
            <TextField
              label="New Password"
              type={show.new ? "text" : "password"}
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((prev) => ({ ...prev, new: !prev.new }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {show.new ? <VisibilityRounded /> : <VisibilityOffRounded />}
            </button>
          </div>
          <div className="relative">
            <TextField
              label="Confirm Password"
              type={show.confirm ? "text" : "password"}
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((prev) => ({ ...prev, confirm: !prev.confirm }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {show.confirm ? <VisibilityRounded /> : <VisibilityOffRounded />}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <Button
            type="submit"
            variant="contained"
            className="w-full text-white"
          >
            {!loading ? "Change" : "Changing Password.."}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
