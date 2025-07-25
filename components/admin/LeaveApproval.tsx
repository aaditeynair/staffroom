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
  teacher_id: string;
  teacher: Teacher;
};

type LeaveApprovalProps = {
  onRelevantApproval: (approvedDate: string) => void;
};

export default function LeaveApproval({
  onRelevantApproval,
}: LeaveApprovalProps) {
  const [requests, setRequests] = useState<AbsenceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async (silent = false) => {
    if (!silent) setLoading(true);

    // Step 1: Fetch absences without nested teacher object
    const { data: absences, error: absencesError } = await supabase
      .from("absences")
      .select("id, date, reason, leave_type, teacher_id")
      .eq("status", "pending");

    if (absencesError) {
      console.error("Error fetching absence requests:", absencesError.message);
      setRequests([]);
      if (!silent) setLoading(false);
      return;
    }

    if (!absences || absences.length === 0) {
      setRequests([]);
      if (!silent) setLoading(false);
      return;
    }

    // Step 2: Fetch all teachers referenced by absences
    const teacherIds = absences.map((absence) => absence.teacher_id);

    const { data: teachers, error: teachersError } = await supabase
      .from("teachers")
      .select("id, name")
      .in("id", teacherIds);

    if (teachersError) {
      console.error("Error fetching teachers:", teachersError.message);
      setRequests([]);
      if (!silent) setLoading(false);
      return;
    }

    // Step 3: Map teachers by their ID for quick lookup
    const teacherMap = new Map<string, Teacher>();
    teachers?.forEach((teacher) => {
      teacherMap.set(teacher.id, teacher);
    });

    // Step 4: Combine absences with their corresponding teacher object
    const combinedRequests: AbsenceRequest[] = absences.map((absence) => ({
      ...absence,
      teacher: teacherMap.get(absence.teacher_id) || {
        id: "",
        name: "Unknown",
      },
    }));

    setRequests(combinedRequests);
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p className="m-8">Loading...</p>;
  if (requests.length === 0)
    return (
      <div className="m-6 md:m-8">
        <h1 className="text-xl font-bold text-teal-700">
          Approve Leave Request
        </h1>
        <p className="mt-6">No pending requests</p>
      </div>
    );

  return (
    <div className="m-6 md:m-8">
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
