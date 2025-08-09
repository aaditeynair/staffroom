import AbsenceOverview from "@/components/admin/dashboard/AbsenceOverview";

export default function AdminPage() {
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-8">
      <AbsenceOverview />
    </div>
  );
}
