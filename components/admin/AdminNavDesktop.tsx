import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-white.png";
import ChangePassword from "@/components/ui/ChangePassword";
import { useState } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

export default function AdminNavDesktop() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-between w-full rounded-md mb-4 md:mb-8 text-white">
      <div className="bg-teal-700 px-8 py-4 rounded-md shadow-md">
        <Image src={logo} alt="Logo" width={180} />
      </div>
      <div className="flex gap-6 items-center">
        <div className="flex gap-8 items-center bg-teal-700 rounded-md shadow-md px-8 py-4">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/substitution/">Substitutions</Link>
          <Link href="/admin/manage-teachers">Teachers</Link>
          <Link href="/admin/timetable">Timetable</Link>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-white cursor-pointer inline-flex items-center justify-center rounded-md shadow-md bg-teal-700 p-3"
        >
          <PersonRoundedIcon sx={{ fontSize: { xs: 35, lg: 30 } }} />
        </button>
      </div>
    </div>
  );
}
