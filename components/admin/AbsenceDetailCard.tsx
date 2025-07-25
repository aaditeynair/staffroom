import dayjs from "dayjs";

interface AbsenceDetailsProps {
  absenceDetails: {
    date: string;
    leave_type: string;
    reason: string;
  };
}

export default function AbsenceDetailCard({
  absenceDetails,
}: AbsenceDetailsProps) {
  return (
    <div className="p-4 bg-white rounded-md shadow-md mb-2 md:mb-4">
      <p className="mb-4">
        <b className="text-teal-700">Date: </b>
        {dayjs(absenceDetails.date).format("DD MMMM YYYY")}
      </p>
      <p className="mb-4">
        <b className="text-teal-700">Type: </b>
        {absenceDetails.leave_type}
      </p>
      <p>
        <b className="text-teal-700">Reason: </b>
        {absenceDetails.reason}
      </p>
    </div>
  );
}
