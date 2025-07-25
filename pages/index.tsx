import pageAuth from "@/components/auth/pageAuth";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { LinearProgress } from "@mui/material";

function Home() {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const { data: profile } = await supabase
        .from("teachers")
        .select("role")
        .eq("email", session?.user.email)
        .single();

      if (profile?.role == "teacher") {
        router.push("/teacher");
      } else {
        router.push("/admin");
      }
    };
    fetchUser();
  }, [router]);
  return (
    <div className="w-screen h-screen bg-teal-700 flex justify-center items-center">
      <div className="w-2/3 md:w-1/3 text-center text-white mb-12">
        <h1 className="text-4xl font-bold text-white mb-8">Staffroom</h1>
        <LinearProgress color="inherit" />
      </div>
    </div>
  );
}

export default pageAuth(Home);
