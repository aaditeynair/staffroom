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
};

function getSubstitutionCandidates({
  availableTeachers,
  teachersWhoTeachTargetClass,
  timetableMap,
  targetDivision,
}: getSubstitutionCandidatesProps) {
  const candidates = availableTeachers
    .map((teacher) => {
      const busyPeriods = timetableMap[teacher.id] || [];
      const teachesTargetClass = teachersWhoTeachTargetClass.has(teacher.id);
      const isSameSection = teacher.division === targetDivision;
      const freePeriods = busyPeriods.filter((p) => !p).length;

      let maxStreak = 0,
        currStreak = 0;
      for (const busy of busyPeriods) {
        if (busy) {
          currStreak++;
          maxStreak = Math.max(maxStreak, currStreak);
        } else {
          currStreak = 0;
        }
      }

      const hasEnoughFreePeriods = freePeriods >= 2;
      const hasNoHeavyStreak = maxStreak <= 4;

      let score = 0;
      if (teachesTargetClass) score += 3;
      if (isSameSection) score += 2;
      if (hasEnoughFreePeriods) score += 1;
      if (hasNoHeavyStreak) score += 1;

      return {
        teacher,
        score,
        flags: {
          teachesTargetClass,
          isSameSection,
          hasEnoughFreePeriods,
          hasNoHeavyStreak,
        },
      };
    })
    .filter((t) => t.flags.hasEnoughFreePeriods && t.flags.hasNoHeavyStreak)
    .sort((a, b) => b.score - a.score)
    .map((t) => ({
      ...t.teacher,
      score: t.score,
    }));
  return candidates;
}

export default getSubstitutionCandidates;
