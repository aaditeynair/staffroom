import { List } from "@mui/material";
import LeaveApprovalItem from "./LeaveApprovalItem";

export default function LeaveApproval() {
  return (
    <div className="py-8 mx-8">
      <h1 className="text-xl font-bold text-teal-700">Approve Leave Request</h1>
      <div className="mt-3">
        <List>
          <LeaveApprovalItem
            info={{
              teacherID: "Aaditey Nair",
              date: "17/10/2025",
              leaveType: "full-day",
              reason: "Sick",
            }}
          />
          <LeaveApprovalItem
            info={{
              teacherID: "Tejas Shyam",
              date: "17/10/2025",
              leaveType: "after 12",
              reason: "Doctor's Appointment",
            }}
          />
          <LeaveApprovalItem
            info={{
              teacherID: "Marcus Aurelius",
              date: "17/10/2025",
              leaveType: "before 12",
              reason: "Family Emergency",
            }}
          />
        </List>
      </div>
    </div>
  );
}
