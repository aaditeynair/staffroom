"use client";

import { supabase } from "@/lib/supabase/browser";
import { useState, useEffect, useRef } from "react";
import { CheckRounded, ClearRounded } from "@mui/icons-material";
import {
  Button,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import getFallback from "@/lib/getFallback";

type Substitution = {
  id: string;
  date: string;
  period_number: number;
  class: string;
  confirmed_by_teacher: "unconfirmed" | "accepted" | "declined";
};
interface Pending {
  refreshFlag: boolean;
  setRefreshFlagAction: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PendingSubstitutions({
  refreshFlag,
  setRefreshFlagAction,
}: Pending) {
  const [loading, setLoading] = useState(true);
  const [substitution, setSubstitution] = useState<Substitution[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"accept" | "decline">("accept");
  const [selectedSub, setSelectedSub] = useState<Substitution | null>(null);
  const [showFade, setShowFade] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        .eq("substitute_teacher", teacher.id)
        .eq("confirmed_by_teacher", "unconfirmed")
        .order("date")
        .order("period_number");

      if (error) {
        console.error(error);
      }

      console.log(teacher);

      if (data)
        setSubstitution(
          (data || []).map((sub) => ({
            ...sub,
            date: formatDateToDDMMYYYY(sub.date),
          })),
        );
      setLoading(false);
      const el = containerRef.current;
      if (!el) return;
      setShowFade(el.scrollHeight > el.clientHeight);
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
    if (!accepted) {
      try {
        await getFallback(selectedSub.id);
        console.log("Fallback promoted to substitute successfully");
      } catch (err) {
        console.error("Error handling fallback:", err);
      }
    }

    if (error) {
      console.error("Failed to update confirmation:", error.message);
    }
    setDialogOpen(false);
    setRefreshFlagAction((prev) => !prev);
    setSelectedSub(null);
  };
  return (
    <>
      <div className="max-w-screen bg-white p-5 rounded-md shadow-md">
        <h1 className="text-2xl text-teal-700 font-bold mb-4">
          {" "}
          Pending Substitutions
        </h1>
        {!loading ? (
          <div className="relative">
            <div className="max-h-60 overflow-y-auto">
              {substitution.length === 0 ? (
                <p className="text-teal-800"> No Substitutions Assigned </p>
              ) : (
                substitution.map((substitution, index) => (
                  <ListItem
                    key={index}
                    className="rounded-md mt-1"
                    disableGutters
                  >
                    <Accordion
                      className="w-full"
                      sx={{ backgroundColor: "#F8F8F8" }}
                    >
                      <AccordionSummary>
                        <div className="flex justify-between w-full">
                          <div className="font-bold">
                            Period: {substitution.period_number}{" "}
                            <p className="text-teal-700">
                              {substitution.class}
                            </p>
                          </div>
                          <div className="text-gray-800">
                            {substitution.date}
                          </div>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="gap-4 mt-4 flex w-full">
                          <Button
                            variant="outlined"
                            className="w-full"
                            startIcon={<CheckRounded />}
                            sx={{ backgroundColor: "white" }}
                            color="success"
                            onClick={() => {
                              handleOpenAccept(substitution);
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            className="w-full"
                            startIcon={<ClearRounded />}
                            sx={{ backgroundColor: "white" }}
                            color="error"
                            onClick={() => {
                              handleOpenDecline(substitution);
                            }}
                          >
                            Decline
                          </Button>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </ListItem>
                ))
              )}
            </div>
            {showFade && (
              <div className="pointer-events-none absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full p-6">
            <CircularProgress size={50}></CircularProgress>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={dialogOpen}
        mode={dialogMode}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDecision}
      />
    </>
  );
}

