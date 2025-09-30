import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import OneSignalProvider from "@/components/onesignal/OneSignalProvider";
import AppLayout from "@/components/layout/AppLayout";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await requireRole(["admin", "admin-teacher"]);
  if (auth.redirect) redirect(auth.redirect);

  return (
    <>
      <OneSignalProvider />
      <AppLayout role={auth.role}>{children}</AppLayout>
    </>
  );
}
