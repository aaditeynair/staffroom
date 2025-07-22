import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/login");
    else console.error("Logout failed:", error.message);
  };

  return (
    <button onClick={handleLogout} className="text-sm text-red-600">
      Logout
    </button>
  );
}
