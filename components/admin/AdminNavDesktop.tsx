import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-white.png";
import AccountModal from "@/components/ui/Account";
import { useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function AdminNavDesktop() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-between bg-teal-700 w-full rounded-md mb-4 md:mb-8 text-white px-8 py-4 shadow-md items-center">
      <div>
        <Image src={logo} alt="Logo" width={180} />
      </div>
      <div className="flex gap-6 items-center">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/substitution/">Substitutions</Link>
        <Link href="/admin/manage-teachers">Teachers</Link>
        <Link href="/admin/timetable">Timetable</Link>
        <button
          onClick={() => setOpen(true)}
          className="text-white cursor-pointer inline-flex items-center justify-center hover:bg-white/10 rounded-full"
        >
          <AccountCircle sx={{ fontSize: { xs: 35, lg: 35 } }} />
        </button>
        <AccountModal open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
