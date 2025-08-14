"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";
import { Button, TextField, Alert } from "@mui/material";
import { EmailOtpType } from "@supabase/supabase-js";

function SetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType;

  // Check if user is logged in
  useEffect(() => {
    const getSession = async () => {
      if (tokenHash && type) {
        const {
          data: { user },
          error,
        } = await supabase.auth.verifyOtp({
          type,
          token_hash: tokenHash,
        });
        if (error) {
          console.error(error);
          await supabase
            .from("teachers")
            .update({ auth_id: user?.id })
            .eq("email", user?.email);
        }
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) router.push("/login");
      }
    };
    getSession();
  }, [router, tokenHash, type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.updateUser({ password });

    await supabase
      .from("teachers")
      .update({ password_set: true })
      .eq("email", user?.email);

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    router.replace("/");
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-1/4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Set Your Password</h1>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <div className="my-6 flex flex-col gap-4">
          <TextField
            label="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            fullWidth
          />
        </div>
        <Button variant="contained" type="submit" fullWidth disabled={loading}>
          {loading ? "Saving..." : "Set Password"}
        </Button>
      </form>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense>
      <SetPassword />
    </Suspense>
  );
}
