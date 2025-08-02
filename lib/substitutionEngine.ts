type Candidate = {
  id: string;
  name: string;
  division: "Junior" | "Senior";
};

export function getSubstitutionCandidates({
  availableTeachers,
  availableTeachersClassesMap,
  timetableMap,
  targetClass,
  targetDivision,
}: {
  availableTeachers: Candidate[];
  availableTeachersClassesMap: Record<string, string[]>;
  timetableMap: Record<string, number[]>; 
  targetClass: string;
  targetDivision: "Junior" | "Senior";
}) {
  return availableTeachers
    .map((teacher) => {
      const classes = availableTeachersClassesMap[teacher.id] || [];
      const todayTimetable = timetableMap[teacher.id] || [];

      const teachesTargetClass = classes.includes(targetClass);
      const isSameSection = teacher.division === targetDivision;

      const freePeriods = todayTimetable.filter((p) => !p).length;

      // Find max continuous class streak
      let maxStreak = 0;
      let currentStreak = 0;
      for (let i = 0; i < todayTimetable.length; i++) {
        if (todayTimetable[i]) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
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
    .map((t) => t.teacher);
}
