import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const { data: teacher } = await supabase
      .from("teachers")
      .select("*")
      .eq("email", user?.email)
      .single();

    if (!teacher) {
      await supabase.auth.signOut();
      setErrorMsg("Access denied. You are not authorized.");
      setLoading(false);
      return;
    }

    if (!teacher.auth_id) {
      await supabase
        .from("teachers")
        .update({ auth_id: user.id })
        .eq("id", teacher.id);
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-16 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-800">
          Teacher Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="mt-12">
            <label className="block text-sm font-medium text-gray-700">
              School Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md outline-2 p-2 outline-gray-300 focus:outline-blue-500 sm:text-sm"
              placeholder="you@goodshepherdtvm.com"
            />
          </div>

          <div className="mb-12">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md outline-2 p-2 outline-gray-300 focus:outline-blue-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>

          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center text-blue-600 hover:underline cursor-pointer mt-2">
            Forgot password?
          </p>
        </form>
      </div>
    </div>
  );
}
