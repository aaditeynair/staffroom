import fetchAvailableTeachers from "@/lib/fetchAvailableTeachers";
import { supabase } from "./supabase/browser";

export default async function getFallback(substitutionId: string) {
    try {
        // 1. Get current substitution
        const { data: substitution, error: subErr } = await supabase
            .from("substitutions")
            .select("*")
            .eq("id", substitutionId)
            .single();
        if (subErr) throw subErr;
        if (!substitution) throw new Error("Substitution not found");

        // 2. Get the absence record
        const { data: absence, error: absErr } = await supabase
            .from("absences")
            .select("teacher_id,date")
            .eq("id", substitution.for_absence)
            .single();
        if (absErr) throw absErr;
        if (!absence) throw new Error("Absence not found");

        const dayOfWeek = new Date(absence.date).toLocaleString("en-US", {
            weekday: "long",
        });

        // 3. Get timetable only for this period
        const { data: timetable, error: ttErr } = await supabase
            .from("base_timetable")
            .select("id, period_number, class")
            .eq("teacher_id", absence.teacher_id)
            .eq("day_of_week", dayOfWeek)
            .eq("period_number", substitution.period_number);
        if (ttErr) throw ttErr;


        // 5. Get scored list for this period
        const availableTeachersByPeriod = await fetchAvailableTeachers({
            absentTeacherId: absence.teacher_id,
            date: absence.date,
            timetable: timetable || [],
        });

        let scoredList = availableTeachersByPeriod[substitution.period_number] || [];



        // 7. Pick next substitute and fallback
        const newSubstitute = substitution.fallback; // fallback from previous row becomes new sub
        const newFallback = scoredList.find(t => t.id !== newSubstitute)?.id || null;

        // 8. Insert new substitution row
        const { error: insertErr } = await supabase
            .from("substitutions")
            .insert({
                date: substitution.date,
                period_number: substitution.period_number,
                class: substitution.class,
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
