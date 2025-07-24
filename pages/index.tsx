import pageAuth from "@/components/auth/pageAuth";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

function Home() {
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const { data: profile } = await supabase
        .from('teachers')
        .select('role')
        .eq('email', session?.user.email)
        .single()

      if (profile?.role == 'teacher') {
        router.push("/teacher");
      } else {
        router.push("/admin");
      }
    }
    fetchUser()
  }, [router])
  return (
    <div>
      <p>Redirecting..</p>
    </div>
  );
}

export default pageAuth(Home);

