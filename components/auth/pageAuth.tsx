import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function pageAuth<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  pageRole?: "teacher" | "admin" | "admin-teacher",
) {
  return function ProtectedPage(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        const { data: profile, error } = await supabase
          .from("teachers")
          .select("role")
          .eq("email", session.user.email)
          .single();

        if (error || !profile) {
          router.push("/login");
          return;
        }
        if (
          pageRole &&
          profile?.role !== pageRole &&
          profile?.role !== "admin-teacher"
        ) {
          router.push("/not-authorized");
          return;
        }
        setLoading(false);
      };

      checkAuth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return null;
    return <Component {...props} />;
  };
}

export default pageAuth;
