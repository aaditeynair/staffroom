"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-white.png";

import { useState } from "react";
import ChangePassword from "../ui/ChangePassword";
import Account from "../ui/Account";

export default function AdminNavDesktop() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="px-8 py-4 bg-teal-700 flex justify-between w-full rounded-md text-white">
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
        <Account onChangePasswordClick={() => setShowModal(true)} />
        <ChangePassword open={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  );
}
