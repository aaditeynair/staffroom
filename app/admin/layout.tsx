import AdminNavDesktop from "@/components/admin/AdminNavDesktop";
import AdminNavMobile from "@/components/admin/AdminNavMobile";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await requireRole(["admin", "admin-teacher"]);
  if (auth.redirect) redirect(auth.redirect);

  return (
    <div className="p-4 md:p-8 min-h-screen flex flex-col">
      <AdminNavDesktop />
      <div className="pb-20 lg:pb-0 mt-8 grow flex flex-col">{children}</div>
      <AdminNavMobile />
    </div>
  );
}
