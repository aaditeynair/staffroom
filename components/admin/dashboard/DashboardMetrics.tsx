import dayjs from "@/lib/dayjs";
import { createSupabaseServer } from "@/lib/supabase/server";

interface MetricCardProps {
  title: string;
  value: number | string;
}

const MetricCard = ({ title, value }: MetricCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const DashboardMetrics = async () => {
  const supabase = await createSupabaseServer();
  const today = dayjs();

  const { count: uncoveredAbsences } = await supabase
    .from("absences")
    .select("*", { count: "exact", head: true })
    .eq("dealt_with", false)
    .gte("date", today);

  const { count: dailyAbsences } = await supabase
    .from("absences")
    .select("*", { count: "exact", head: true })
    .eq("status", "confirmed")
    .eq("date", today);

  const { count: pendingAbsences } = await supabase
    .from("absences")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
    .gte("date", today);

  const { count: totalSubstitutionsToday } = await supabase
    .from("substitutions")
    .select("*", { count: "exact", head: true })
    .gte("date", today)
    .lte("date", today);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <MetricCard title="Today's Absences" value={dailyAbsences ?? 0} />
      <MetricCard
        title="Substitutions Today"
        value={totalSubstitutionsToday ?? 0}
      />
      <MetricCard title="Uncovered Absences" value={uncoveredAbsences ?? 0} />
      <MetricCard title="Pending Requests" value={pendingAbsences ?? 0} />
    </div>
  );
};

export default DashboardMetrics;
