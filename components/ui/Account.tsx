import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";

type AccountModalProps = {
  open: boolean;
  onClose: () => void;
};

interface User {
  email: string;
  name: string;
}

export default function AccountModal({ open, onClose }: AccountModalProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/login");
    else console.error("Logout failed:", error.message);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) return;
      const { data: teacher } = await supabase
        .from("teachers")
        .select("name,email")
        .eq("email", session.user.email)
        .single();

      if (!teacher) return;
      setUser(teacher);
      setLoading(false);
    };

    if (open) fetchUser();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogActions sx={{ justifyContent: "flex-end", p: 1, mb: 0 }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogActions>

      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : user ? (
          <div className="rounded-2xl flex flex-col items-center">
            <AccountCircle sx={{ fontSize: 120, color: "#001919" }} />
            <h2 className="text-2xl font-bold text-teal-800 mb-3">
              {user.name}
            </h2>
            <p>{user.email}</p>
            <Button
              sx={{ color: "red", margin: 2 }}
              onClick={() => handleLogout()}
            >
              {" "}
              Logout{" "}
            </Button>
          </div>
        ) : (
          <p>No user found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
