'use client'
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { LinearProgress } from "@mui/material";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function Home() {
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
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="w-2/3 md:w-1/3 text-center text-teal-700 mb-12">
        <Image
          src={logo}
          width={400}
          alt="Staffroom"
          className="block mx-auto mb-12"
        />
        <LinearProgress color="inherit" />
      </div>
    </div>
  );
}

