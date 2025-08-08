import TeacherNavDesktop from "@/components/teachers/TeacherNavDesktop";
import TeacherNavMobile from "@/components/teachers/TeacherNavMobile";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export default async function TeacherLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await requireRole(["teacher", "admin-teacher"]);
  if (auth.redirect) redirect(auth.redirect);

  return (
    <div className="min-h-full bg-gray-100 p-4 md:p-8 flex flex-col">
      <TeacherNavDesktop />
      <div className="pb-20 lg:pb-0 mt-8 grow flex flex-col">{children}</div>
      <TeacherNavMobile />
    </div>
  );
}
