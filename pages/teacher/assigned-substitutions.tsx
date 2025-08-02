import pageAuth from "@/components/auth/pageAuth";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import TeacherNavMobile from "@/components/teachers/TeacherNavMobile";
import Header from "@/components/ui/Header";
import { CheckRounded, ClearRounded } from "@mui/icons-material";
import { Button, ListItem, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ConfirmDialog from "@/components/ui/ConfirmDialog";


type Substitution = {
  id: string;
  date: string;
  period_number: number;
  class: string;
  confirmed_by_teacher: "unconfirmed" | "accepted" | "declined";
};
function AssignedSubstitutions() {
  const [loading, setLoading] = useState(true);
  const [substitution, setSubstitution] = useState<Substitution[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"accept" | "decline">("accept");
  const [selectedSub, setSelectedSub] = useState<Substitution | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    const fetchAbsences = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) return;
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id")
        .eq("email", session.user.email)
        .single();

      if (!teacher) return;

      const { data, error } = await supabase
        .from("substitutions")
        .select("id,date,period_number,class,confirmed_by_teacher")
        .eq("substitute_teacher", teacher.id,)
        .eq("confirmed_by_teacher", 'unconfirmed')
        .order("date")
        .order("period_number");

      if (error) {
        console.error(error);
      }

      console.log(teacher);

      if (data) setSubstitution(
          (data || []).map((sub) => ({
          ...sub,
          date: formatDateToDDMMYYYY(sub.date),
  }))
);
      setLoading(false);
    };

    fetchAbsences();
  }, [refreshFlag]);
  function formatDateToDDMMYYYY(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
  }
  const handleOpenAccept = (sub: Substitution) => {
    setSelectedSub(sub);
    setDialogMode("accept");
    setDialogOpen(true);
  };

  const handleOpenDecline = (sub: Substitution) => {
    setSelectedSub(sub);
    setDialogMode("decline");
    setDialogOpen(true);
  };

  const handleDecision = async (accepted: boolean, reason?: string) => {
    if (!selectedSub) return;
    const status = accepted ? "accepted" : "declined";
    const { error } = await supabase
      .from("substitutions")
      .update({ confirmed_by_teacher: status, reason: reason })
      .eq("id", selectedSub.id);

    if (error) {
      console.error("Failed to update confirmation:", error.message);
    }
    setDialogOpen(false);
    setRefreshFlag((prev) => !prev);
    setSelectedSub(null);
  };
  return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <Header/>
        {!loading ? (
          <div className="max-w-screen bg-white p-5 rounded-md  pb-20 lg:pb-0">
            <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">
              Assigned Substitutions
            </h2>
            {substitution.map((substitution, index) => (
              
                <ListItem key={index} className="rounded-md mt-1" disableGutters>
                  <Accordion className="w-full">
                    <AccordionSummary>
                      <div className="flex justify-between w-full">
                        
                      <div className="font-bold">Period: {substitution.period_number} <p className="text-teal-700">{substitution.class}</p></div>
                      <div className="text-gray-800">{substitution.date}</div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      
                      <div className="gap-4 mt-4 flex w-full">
                        <Button
                          variant="outlined"
                          className="w-full"
                          startIcon={<CheckRounded />}
                          color="success"
                          onClick={() => {
                            handleOpenAccept(substitution)
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
                            handleOpenDecline(substitution)
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
            ))}
          </div>
        ) : (
          <p> Loading... </p>
        )}
        < ConfirmDialog
            open={dialogOpen}
        mode={dialogMode}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDecision}
          />
        <TeacherNavMobile />
      </div>
      
  )}

export default pageAuth(AssignedSubstitutions, "teacher");

