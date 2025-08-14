"use client";

import { useState } from "react";
import LeaveReqManager from "@/components/teachers/leaves/LeaveReqManager";
import LeaveReqForm from "@/components/teachers/leaves/LeaveReqForm";

export default function LeaveRequest() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_30rem)_1fr] gap-8 lg:gap-16 pb-20 lg:pb-0">
          <LeaveReqForm setRefreshFlagAction={setRefreshFlag} />
          <LeaveReqManager refreshFlag={refreshFlag} />
        </div>
      </div>
    </>
  );
}
