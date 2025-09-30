import AbsenceOverview from "@/components/admin/dashboard/AbsenceOverview";
import DashboardMetrics from "@/components/admin/dashboard/DashboardMetrics";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <DashboardMetrics />
      <div className="grid grid-cols-3 gap-4 md:gap-8">
        <AbsenceOverview />
      </div>
    </div>
  );
}
