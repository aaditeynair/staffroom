import AbsentTeachersList from "@/components/admin/AbsentTeachersList";
import LeaveApproval from "@/components/admin/LeaveApproval";
import { Grid } from "@mui/material";

export default function AdminDashboard() {
  return (
    <div className="p-8 bg-gray-100 h-full w-full">
      <Grid container spacing={4}>
        <Grid
          size={{ xs: 12, lg: 4 }}
          className="bg-white rounded-md shadow-md"
        >
          <LeaveApproval />
        </Grid>
        <Grid
          size={{ xs: 12, lg: 8 }}
          className="bg-white rounded-md shadow-md"
        >
          <AbsentTeachersList />
        </Grid>
      </Grid>
    </div>
  );
}
