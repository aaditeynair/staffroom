import { UserCard } from "@/components/admin/teachers/UserCard";
import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function TeacherList() {
  const supabase = await createSupabaseServer();

  const { data: teachers, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("role", "teacher")
    .order("name");

  if (error) {
    console.error("Error fetching teachers:", error.message);
    return <div className="text-red-500">Failed to load teachers.</div>;
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-teal-700 mb-4 px-2">Teachers</h2>
      <div className="flex flex-col gap-4">
        {teachers?.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
        {teachers?.length === 0 && (
          <p className="text-gray-500">No teachers found</p>
        )}
      </div>
    </section>
  );
}
