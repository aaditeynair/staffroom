import { useState } from "react";
import AbsentTeachersList from "@/components/admin/AbsentTeachersList";
import LeaveApproval from "@/components/admin/LeaveApproval";
import { Grid } from "@mui/material";
import dayjs from "dayjs";
import pageAuth from "@/components/auth/pageAuth";
import FalseSubstituionForm from "@/components/admin/FalseSubstitutionForm";
import AdminNavDesktop from "@/components/admin/AdminNavDesktop";

function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleApprovalEffect = (approvedDate: string) => {
    if (dayjs(approvedDate).isSame(selectedDate, "date")) {
      setRefreshFlag((prev) => !prev);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100">
      <AdminNavDesktop />
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid
          size={{ xs: 12, lg: 4 }}
          className="bg-white rounded-md shadow-md"
        >
          <LeaveApproval onRelevantApproval={handleApprovalEffect} />
        </Grid>
        <Grid
          size={{ xs: 12, lg: 8 }}
          className="bg-white rounded-md shadow-md"
        >
          <AbsentTeachersList
            date={selectedDate}
            setDate={setSelectedDate}
            refreshKey={refreshFlag}
          />
        </Grid>
        <Grid container size={3}>
          <Grid size={12} className="bg-white rounded-md shadow-md">
            <FalseSubstituionForm />
          </Grid>
          <Grid size={12} className="bg-white rounded-md shadow-md h-20">
            list
          </Grid>
        </Grid>
        <Grid className="bg-white rounded-md shadow-md" size={9}>
          TimeTable
        </Grid>
      </Grid>
    </div>
  );
}

export default pageAuth(AdminDashboard, "admin");
