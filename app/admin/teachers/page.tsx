import AdminList from "@/components/admin/teachers/AdminList";
import NewUserForm from "@/components/admin/teachers/NewUserForm";
import TeacherList from "@/components/admin/teachers/TeacherList";

export default function TeachersOverview() {
  return (
    <>
      <h1 className="text-4xl font-bold text-teal-700 mb-8">
        Teacher Management
      </h1>
      <div className="grid lg:grid-cols-3 gap-4 md:gap-8 grow">
        <div>
          <div className="bg-white rounded-md shadow-md p-4 md:p-8">
            <AdminList />
          </div>
        </div>
        <div className="bg-white rounded-md shadow-md p-4 md:p-8">
          <TeacherList />
        </div>
        <div>
          <div className="bg-white rounded-md shadow-md p-4 md:p-8">
            <NewUserForm />
          </div>
        </div>
      </div>
    </>
  );
}
