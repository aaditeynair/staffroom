"use client";

import SubstitutionsView from "@/components/teachers/substitutions/SubstitutionsView";
import PendingSubstitutions from "@/components/teachers/substitutions/PendingSubstitutions";
import { useState } from "react";

export default function AssignedSubstitutions() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_2fr)_3fr] gap-8 lg:gap-16 pb-20 lg:pb-0">
        <PendingSubstitutions
          refreshFlag={refreshFlag}
          setRefreshFlagAction={setRefreshFlag}
        />
        <div className="max-w-screen bg-white p-5 rounded-md shadow-md">
          <h1 className="text-2xl text-teal-700 font-bold mb-4">
            {" "}
            Accepted Substitutions{" "}
          </h1>
          <SubstitutionsView mode="all" refreshFlag={refreshFlag} />
        </div>
      </div>
    </>
  );
}
