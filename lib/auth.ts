import { createSupabaseServer } from "@/lib/supabaseServer";

export async function requireRole(
  allowedRoles: ("admin" | "teacher" | "admin-teacher")[],
) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { redirect: "/login" };

  const { data: profile, error: roleError } = await supabase
    .from("teachers")
    .select("role")
    .eq("auth_id", user.id)
    .single();

  if (roleError || !profile) return { redirect: "/login" };

  if (!allowedRoles.includes(profile.role)) {
    return { redirect: "/not-authorized" };
  }

  return { user, role: profile.role };
}
