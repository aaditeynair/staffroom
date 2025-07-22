import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function pageAuth<P extends object = {}>(
  Component: React.ComponentType<P>,
  pageRole?: "teacher" | "admin",
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
          .select("is_admin")
          .eq("email", session.user.email)
          .single();

        if (error || !profile) {
          router.push("/login");
          return;
        }

        const isAdmin = profile.is_admin === true;

        if (pageRole === "admin" && !isAdmin) {
          router.push("/not-authorized");
          return;
        }

        if (pageRole === "teacher" && isAdmin) {
          router.push("/not-authorized");
          return;
        }

        setLoading(false);
      };

      checkAuth();
    }, []);

    if (loading) return null;
    return <Component {...props} />;
  };
}

export default pageAuth;
