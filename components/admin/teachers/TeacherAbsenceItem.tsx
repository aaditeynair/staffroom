import dayjs from "@/lib/dayjs";
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type Absence = {
  id: string;
  teacher_id: string;
  date: string;
  created_at: string;
  reason: string;
  status: string;
  leave_type: string;
  dealt_with: boolean;
};

type TeacherAbsenceItemProps = {
  absence: Absence;
};
export default function TeacherAbsenceItem({
  absence,
}: TeacherAbsenceItemProps) {
  return (
    <Link
      key={absence.id}
      href={"/admin/absence/" + absence.id}
      className="rounded-md shadow-md hover:shadow-lg transition-shadow p-4 flex justify-between items-center"
    >
      <div className="flex h-full">
        <div
          className={
            "w-2 h-auto mr-4 " +
            (absence.dealt_with === true ? "bg-green-400" : "bg-red-400")
          }
        ></div>
        <div>
          <p>{dayjs(absence.date).format("dddd - DD/MM/YYYY")}</p>
          <p className="text-sm text-gray-500">{absence.leave_type}</p>
        </div>
      </div>
      <p className="text-teal-700">
        <ChevronRightIcon />
      </p>
    </Link>
  );
}
