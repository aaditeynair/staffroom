function getClassDivision(className: string): "Junior" | "Senior" {
  const match = className.match(/^(\d+)/);
  if (!match) {
    // Default fallback or throw error if className malformed
    return "Senior";
  }
  const grade = parseInt(match[1], 10);
  return grade <= 5 ? "Junior" : "Senior";
}

export default getClassDivision;
