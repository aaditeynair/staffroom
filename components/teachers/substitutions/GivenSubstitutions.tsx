"use client";

import { supabase } from "@/lib/supabase/browser";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  ListItem,
  Card,
  CircularProgress,
} from "@mui/material";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import getFallback from "@/lib/getFallback";

type Substitution = {
  id: string;
  date: string;
  period_number: number;
  classes: string[];
  accepted:boolean;
};
interface Pending {
  refreshFlag: boolean;
  setRefreshFlagAction: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function GivenSubstitutions({
  refreshFlag,
  setRefreshFlagAction,
}: Pending) {
  const [loading, setLoading] = useState(true);
  const [substitution, setSubstitution] = useState<Substitution[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
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
        .select("id,date,period_number,classes,accepted")
        .eq("substitute_teacher", teacher.id)
        .eq("accepted", true)
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

  const handleOpenDecline = (sub: Substitution) => {
    setSelectedSub(sub);
    setDialogOpen(true);
  };

  const handleDecline = async (reason?: string) => {
    setLoading(true)
    if (!selectedSub) return;
    setDialogOpen(false);
    const { error } = await supabase
      .from("substitutions")
      .update({ accepted: false, reason: reason })
      .eq("id", selectedSub.id);

      try {
        await getFallback(selectedSub.id);
        console.log("Fallback promoted to substitute successfully");
      } catch (err) {
        console.error("Error handling fallback:", err);
      }

    if (error) {
      console.error("Failed to update confirmation:", error.message);
    }

    setRefreshFlagAction((prev) => !prev);
    setSelectedSub(null);
    setLoading(false)
  };
  return (
    <>
      <div className="max-w-screen bg-white p-4 rounded-md shadow-md">
        <h1 className="text-2xl text-teal-700 font-bold mb-4">
          {" "}
          Substitutions Assigned
        </h1>
        {!loading ? (
          <div className="relative">
            <div className="max-h-120 overflow-y-auto">
              {substitution.length === 0 ? (
                <p className="text-teal-800"> No Substitutions Assigned </p>
              ) : (
                substitution.map((substitution, index) => (
                  <ListItem
                    key={index}
                    className="rounded-md mt-1"
                    disableGutters

                  >
                    <Card
                      className="w-full p-4 border border-gray-200"
                      sx={{ backgroundColor: "#F8F8F8" }}
                    >
                    <div className="flex justify-between w-full">
                          <div className="font-bold">
                            Period: {substitution.period_number}{" "}
                            <p className="text-teal-700">
                              {substitution.classes.join(',')}
                            </p>
                          </div>
                          <div className="text-gray-800">
                            {substitution.date}
                          </div>
                        </div>
                        <div className="gap-4 mt-4 flex w-full justify-end">
                          <Button
                            variant="outlined"
                            className="p-0"
                            sx={{ backgroundColor: "white",p:0.5,fontSize:'0.6rem',}}
                            color="error"
                            onClick={() => {
                              handleOpenDecline(substitution);
                            }}
                          >
                            Request Reassignment
                          </Button>
                        </div>
                        </Card>
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
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDecline}
      />
    </>
  );
}

