import pageAuth from "@/components/auth/pageAuth";
import TeacherNavMobile from "@/components/teachers/teacherNavMobile";
import Header from "@/components/ui/header";

function AssignedSubstitutions() {
  return (
    <div>
      <Header heading="Assigned Substitutions" />
      <div className="min-h-screen flex justify-center bg-gray-200 pb-16">
        <div className="max-w-screen bg-gray-50 p-5 w-full rounded-2xl shadow m-3">
          <h2 className="text-2xl font-bold text-teal-800 mb-6">
            Substitutions To Confirm
          </h2>
          <div className="flex flex-col">
            <div className=" flex justify-between items-center px-4 py-3 rounded-xl border border-gray-300">
              <div> Period 1 : lorem ipsum</div>
            </div>
            <div className=" flex justify-between items-center px-4 py-3 rounded-xl border border-gray-300">
              <div> Period 1 : lorem ipsum</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-teal-800 mb-6 mt-5">
            Substitutions Today
          </h2>
        </div>
      </div>
      <TeacherNavMobile />
    </div>
  );
}
export default pageAuth(AssignedSubstitutions, "teacher");

