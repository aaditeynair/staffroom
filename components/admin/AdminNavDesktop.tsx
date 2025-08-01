import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-white.png";
import ChangePassword from "@/components/ui/ChangePassword";
import { useState } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

export default function AdminNavDesktop() {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-8 py-4 bg-teal-700 flex justify-between w-full rounded-md mb-4 md:mb-8 text-white">
      <div>
        <Image src={logo} alt="Logo" width={180} />
      </div>
      <div className="flex items-center gap-10">
        <div className="hidden lg:flex gap-8 items-center">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/substitution/">Substitutions</Link>
          <Link href="/admin/manage-teachers">Teachers</Link>
          <Link href="/admin/timetable">Timetable</Link>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-white cursor-pointer inline-flex items-center justify-center"
        >
          <PersonRoundedIcon sx={{ fontSize: { xs: 25, lg: 25 } }} />
        </button>
      </div>
    </div>
  );
}
