import AdminList from "@/components/admin/teachers/AdminList";
import AdminTeacherList from "@/components/admin/teachers/AdminTeacherList";
import NewUserForm from "@/components/admin/teachers/NewUserForm";
import TeacherList from "@/components/admin/teachers/TeacherList";

export default function TeachersOverview() {
  return (
    <>
      <h1 className="text-4xl font-bold text-teal-700 mb-8">
        Teacher Management
      </h1>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 md:gap-8 grow">
        <div className="bg-white rounded-md shadow-md p-6">
          <AdminList />
        </div>
        <div className="bg-white rounded-md shadow-md row-start-2 p-6">
          <AdminTeacherList />
        </div>
        <div className="bg-white rounded-md shadow-md row-span-2 p-6 md:p-8">
          <TeacherList />
        </div>
        <div className="bg-white rounded-md shadow-md p-6 md:p-8">
          <NewUserForm />
        </div>
      </div>
    </>
  );
}
