import LeaveApproval from "@/components/admin/LeaveApproval";
import { Grid } from "@mui/material";

export default function AdminDashboard() {
  return (
    <div className="p-8 bg-gray-100 h-full w-full">
      <Grid container spacing={2}>
        <Grid size={4} className="bg-white rounded-md shadow-md">
          <LeaveApproval />
        </Grid>
        <Grid size={8} className="bg-white p-6 rounded-md shadow-md"></Grid>
      </Grid>
    </div>
  );
}
