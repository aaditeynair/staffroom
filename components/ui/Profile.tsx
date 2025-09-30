import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/browser";
import { Box, CircularProgress } from "@mui/material";
import { Person } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ProfileMenu from "./ProfileMenu";

type User = {
  name: string;
  email: string;
};

type ProfileProps = {
  onChangePasswordClick: () => void;
};

export default function Profile({ onChangePasswordClick }: ProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

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

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/login");
    else console.error("Logout failed:", error.message);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full p-5">
        <CircularProgress size={16}></CircularProgress>
      </div>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          cursor: "pointer",
        }}
        onClick={handleMenuClick}
      >
        <Person sx={{ marginRight: "16px" }} />
        <Box>
          <Box sx={{ fontWeight: "bold" }}>{user?.name}</Box>
          <Box sx={{ fontSize: "0.8rem", color: "gray" }}>{user?.email}</Box>
        </Box>
      </Box>
      <ProfileMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onChangePasswordClick={onChangePasswordClick}
        onLogoutClick={handleLogout}
      />
    </Box>
  );
}
