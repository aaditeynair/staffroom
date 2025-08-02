"use client";
import AdminNavDesktop from "@/components/admin/AdminNavDesktop";
import AdminNavMobile from "@/components/admin/AdminNavMobile";
import BaseTimetableViewer from "@/components/timetable/BaseTimetableViewer";
import { useState } from "react";

export default function Timetable() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [active, setActive] = useState("base");
  return (
    <div className="p-4 md:p-8">
      <AdminNavDesktop />

      <div className="pb-20 lg:pb-0 mt-8">
        <h1 className="text-4xl font-bold text-teal-700 text-center">
          Timetable
        </h1>
        {active === "base" ? <BaseTimetableViewer /> : <p>hello</p>}
      </div>

      <AdminNavMobile />
    </div>
  );
}
