import FalseSubstitutionForm from "@/components/admin/FalseSubstitutionForm";
import UpcomingSubstitutions from "@/components/admin/UpcomingSubstitutions";

export default function SubstitutionPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold text-teal-700 mb-8">
        Substitution Overview
      </h1>
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white rounded-md shadow-md col-span-2">
          <UpcomingSubstitutions />
        </div>
        <div className="bg-white rounded-md shadow-md">
          <FalseSubstitutionForm />
        </div>
      </div>
    </div>
  );
}
