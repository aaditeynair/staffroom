import { CheckRounded, ClearRounded } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Button, ListItem } from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";

interface LeaveApprovalInfo {
  id: string;
  teacher: string;
  date: string;
  leaveType: string;
  reason: string;
}

interface LeaveApprovalItemProps {
  refresh: (silent: boolean) => void | Promise<void>;
  onRelevantApproval: (approvedDate: string) => void;
  info: LeaveApprovalInfo;
}

export default function LeaveApprovalItem({
  refresh,
  info,
  onRelevantApproval,
}: LeaveApprovalItemProps) {
  const { id, teacher, date, leaveType, reason } = info;

  const handleAction = async (status: "confirmed" | "rejected") => {
    const { error } = await supabase
      .from("absences")
      .update({ status: status })
      .eq("id", id);

    if (error) {
      console.log(error);
    } else {
      if (status === "confirmed") {
        onRelevantApproval(date);
      }
    }
    refresh(true);
  };

  return (
    <ListItem className="rounded-md mt-1" disableGutters>
      <Accordion className="w-full">
        <AccordionSummary>
          <div className="flex justify-between w-full">
            <div className="font-bold">{teacher}</div>
            <div className="text-gray-500">
              {dayjs(date).format("DD/MM/YYYY")}
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <p>Type: {leaveType}</p>
          <p className="">Reason: {reason}</p>
          <div className="gap-4 mt-4 flex w-full">
            <Button
              variant="outlined"
              className="w-full"
              startIcon={<CheckRounded />}
              color="success"
              onClick={() => {
                handleAction("confirmed");
              }}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              className="w-full"
              startIcon={<ClearRounded />}
              color="error"
              onClick={() => {
                handleAction("rejected");
              }}
            >
              Reject
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}
