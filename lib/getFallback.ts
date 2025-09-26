import fetchAvailableTeachers from "@/lib/fetchAvailableTeachers";
import { supabase } from "./supabase/browser";

export default async function getFallback(substitutionId: string) {
  try {
    // 1) current substitution
    const { data: substitution, error: subErr } = await supabase
      .from("substitutions")
      .select("*")
      .eq("id", substitutionId)
      .single();
    if (subErr) throw subErr;
    if (!substitution) throw new Error("Substitution not found");

    // 2) absence record
    const { data: absence, error: absErr } = await supabase
      .from("absences")
      .select("teacher_id, date")
      .eq("id", substitution.for_absence)
      .single();
    if (absErr) throw absErr;
    if (!absence) throw new Error("Absence not found");

    // 3) day string for base_timetable lookup
    const dayOfWeek = new Date(absence.date).toLocaleString("en-US", {
      weekday: "long",
    });

    // 4) get timetable row(s) just for this period (for that absent teacher)
    const { data: timetable, error: ttErr } = await supabase
      .from("base_timetable")
      .select("id, period_number, classes")
      .eq("teacher_id", absence.teacher_id)
      .eq("day_of_week", dayOfWeek)
      .eq("period_number", substitution.period_number);
    if (ttErr) throw ttErr;

    // 5) get scored list for this period (pure scorer)
    const availableTeachersByPeriod = await fetchAvailableTeachers({
      absentTeacherId: absence.teacher_id,
      date: absence.date,
      timetable: timetable || [],
    });
    let scoredList = availableTeachersByPeriod[substitution.period_number] || [];

    // 6) fetch declined substitutions (for this absence + period) and exclude them
    const { data: declinedSubs, error: decErr } = await supabase
      .from("substitutions")
      .select("substitute_teacher")
      .eq("for_absence", substitution.for_absence)
      .eq("period_number", substitution.period_number)
      .eq("accepted", false);
    if (decErr) throw decErr;

    const declinedSet = new Set((declinedSubs || []).map((d) => d.substitute_teacher));
    scoredList = scoredList.filter((t) => !declinedSet.has(t.id));

    // 7) pick next substitute & fallback
    // If the previous fallback exists, promote it. Otherwise pick top candidate.
    const previousFallback = substitution.fallback || null;

    // If previous fallback is available and hasn't been filtered out, prefer it
    let newSubstitute = previousFallback && scoredList.some(t => t.id === previousFallback)
      ? previousFallback
      : (previousFallback ? previousFallback : (scoredList[0]?.id ?? null));

    // Ensure newSubstitute isn't null when possible: if previousFallback was null but scoredList non-empty, pick that first.
    if (!newSubstitute && scoredList.length > 0) {
      newSubstitute = scoredList[0].id;
    }

    // Build remaining list after removing chosen substitute
    const remaining = scoredList.filter((t) => t.id !== newSubstitute);
    const newFallback = remaining[0]?.id ?? null;

    // 8) insert new substitution row
    // Set accepted: if we expect the substitute to accept (i.e. we have a chosen substitute that requires confirmation),
    // set accepted to false (unconfirmed). If there is no fallback and we are force-assigning (edge-case), set true.

    const { error: insertErr } = await supabase.from("substitutions").insert({
      date: substitution.date,
      period_number: substitution.period_number,
      classes: substitution.classes,
      for_absence: substitution.for_absence,
      original_teacher: substitution.original_teacher,
      substitute_teacher: newSubstitute,
      fallback: newFallback,

    });
    if (insertErr) throw insertErr;
  } catch (error) {
    console.error("Error getting fallback:", error, JSON.stringify(error, null, 2));
    throw error;
  }
}
