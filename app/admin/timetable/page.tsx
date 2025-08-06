"use client";

import BaseTimetableViewer from "@/components/admin/timetable/BaseTimetableViewer";
import { useState } from "react";

export default function Timetable() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [active, setActive] = useState("base");
  return (
    <>
      <h1 className="text-4xl font-bold text-teal-700 mb-8">Timetable</h1>
      {active === "base" ? <BaseTimetableViewer /> : <p>hello</p>}
    </>
  );
}
