import AdminNavDesktop from "@/components/admin/AdminNavDesktop";
import AdminNavMobile from "@/components/admin/AdminNavMobile";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-4 md:p-8">
      <AdminNavDesktop />
      <div className="pb-20 lg:pb-0 mt-8">{children}</div>
      <AdminNavMobile />
    </div>
  );
}
