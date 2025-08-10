import { UserCard } from "@/components/admin/teachers/UserCard";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AdminTeacherList() {
  const supabase = await createSupabaseServer();

  const { data: adminTeachers, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("role", "admin-teacher")
    .order("name");

  if (error) {
    console.error("Error fetching admins:", error.message);
    return <div className="text-red-500">Failed to load admins.</div>;
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-teal-700 mb-4 px-2">
        Admin Teacher
      </h2>
      <div className="flex flex-col gap-4">
        {adminTeachers?.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
        {adminTeachers?.length === 0 && (
          <p className="text-gray-500">No admins found</p>
        )}
      </div>
    </section>
  );
}
