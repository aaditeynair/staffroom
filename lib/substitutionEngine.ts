type Candidate = {
  id: string;
  name: string;
  division: "Junior" | "Senior";
};

type getSubstitutionCandidatesProps = {
  availableTeachers: Candidate[];
  teachersWhoTeachTargetClass: Set<string>;
  timetableMap: Record<string, boolean[]>;
  targetDivision: "Junior" | "Senior";
  periodIndex: number;
};

function getSubstitutionCandidates({
  availableTeachers,
  teachersWhoTeachTargetClass,
  timetableMap,
  targetDivision,
  periodIndex,
}: getSubstitutionCandidatesProps) {
  const candidates = availableTeachers
    .map((teacher) => {
      const busyPeriods = timetableMap[teacher.id] || [];
      const teachesTargetClass = teachersWhoTeachTargetClass.has(teacher.id);
      const isSameSection = teacher.division === targetDivision;
      const freePeriods = busyPeriods.filter((p) => !p).length;
      console.log("Checking teacher:", teacher.id, "for period", periodIndex+1);
      console.log("Existing periods:", busyPeriods);
      let left = 0;
      for (let i = periodIndex - 1; i >= 0 && busyPeriods[i]; i--) left++;
      let right = 0;
      for (let i = periodIndex + 1; i < busyPeriods.length && busyPeriods[i]; i++) right++;
      const wouldStreak = left + 1 + right; // +1 for this new assignment
      let streakPenalty = 0;
      if (wouldStreak >= 3) {
        streakPenalty = wouldStreak - 2;
      }
      const hasEnoughFreePeriods = freePeriods >= 2;

      let score = 0;
      if (teachesTargetClass) score += 3;
      if (isSameSection) score += 2;
      if (hasEnoughFreePeriods) score += 1;
      score -= streakPenalty
      console.log('score', score)
      return {
        teacher,
        score,
        flags: {
          teachesTargetClass,
          isSameSection,
          hasEnoughFreePeriods,
          streakPenalty,
        },
      };
    })
    .filter((t) => t.flags.hasEnoughFreePeriods)
    .sort((a, b) => b.score - a.score)
    .map((t) => ({
      ...t.teacher,
      score: t.score,
    }));
  return candidates;
}

export default getSubstitutionCandidates;
