import { CheckRounded, ClearRounded } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Button, ListItem } from "@mui/material";

export default function LeaveApprovalItem({ info }) {
  const { teacherID, date, leaveType, reason } = info;
  return (
    <ListItem className="pl-2 rounded-md mt-1" disableGutters>
      <Accordion className="w-full">
        <AccordionSummary>
          <div className="flex justify-between w-full">
            <div className="font-bold">{teacherID}</div>
            <div className="text-gray-500">{date}</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <p>Type: {leaveType}</p>
          <p className="mt-2">Reason: {reason}</p>
          <div className="gap-4 mt-4 flex w-full">
            <Button
              variant="outlined"
              className="w-full"
              startIcon={<CheckRounded />}
              color="success"
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              className="w-full"
              startIcon={<ClearRounded />}
              color="error"
            >
              Reject
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}
