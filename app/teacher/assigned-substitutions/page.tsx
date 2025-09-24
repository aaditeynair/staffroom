"use client";
import GivenSubstitutions from "@/components/teachers/substitutions/GivenSubstitutions";
import { useState } from "react";

export default function AssignedSubstitutions() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  return (
    <>
      <div className="grid grid-cols-1 lg:w-1/2 gap-8 lg:gap-16 pb-20 lg:pb-0">
        <GivenSubstitutions
          refreshFlag={refreshFlag}
          setRefreshFlagAction={setRefreshFlag}
        />
      </div>
    </>
  );
}
