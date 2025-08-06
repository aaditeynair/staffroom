"use client";

import { useState } from "react";
import AbsentTeachersList from "@/components/admin/AbsentTeachersList";
import LeaveApproval from "@/components/admin/LeaveApproval";
import dayjs from "dayjs";

export default function AbsenceOverview() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleApprovalEffect = (approvedDate: string) => {
    if (dayjs(approvedDate).isSame(selectedDate, "date")) {
      setRefreshFlag((prev) => !prev);
    }
  };

  return (
    <>
      <div className="bg-white rounded-md shadow-md col-span-3 lg:col-span-1">
        <LeaveApproval onRelevantApproval={handleApprovalEffect} />
      </div>
      <div className="bg-white rounded-md shadow-md col-span-3 lg:col-span-2">
        <AbsentTeachersList
          date={selectedDate}
          setDate={setSelectedDate}
          refreshKey={refreshFlag}
        />
      </div>
    </>
  );
}
