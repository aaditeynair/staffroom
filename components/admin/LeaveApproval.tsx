import { List } from "@mui/material";
import LeaveApprovalItem from "./LeaveApprovalItem";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type Teacher = {
  id: string;
  name: string;
};

type AbsenceRequest = {
  id: string;
  date: string;
  reason: string;
  leave_type: string;
  teacher: Teacher;
};

export default function LeaveApproval({ onRelevantApproval }) {
  const [requests, setRequests] = useState<AbsenceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async (silent = false) => {
    if (!silent) setLoading(true);

    const { data, error } = await supabase
      .from("absences")
      .select(
        `
          id,
          date,
          reason,
          leave_type,
          teacher:teacher_id (
            id,
            name
          )
        `,
      )
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching absence requests:", error.message);
      setRequests([]);
    } else {
      setRequests(data as AbsenceRequest[]);
    }

    if (!silent) setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p className="m-8">Loading...</p>;
  if (requests.length === 0)
    return (
      <div className="m-8">
        <h1 className="text-xl font-bold text-teal-700">
          Approve Leave Request
        </h1>
        <p className="mt-6">No pending requests</p>
      </div>
    );

  return (
    <div className="m-8">
      <h1 className="text-xl font-bold text-teal-700">Approve Leave Request</h1>
      <div className="mt-3">
        <List>
          {requests.map((request) => {
            return (
              <LeaveApprovalItem
                key={request.id}
                refresh={fetchRequests}
                onRelevantApproval={onRelevantApproval}
                info={{
                  id: request.id,
                  teacher: request.teacher.name,
                  date: request.date,
                  leaveType: request.leave_type,
                  reason: request.reason,
                }}
              />
            );
          })}
        </List>
      </div>
    </div>
  );
}
