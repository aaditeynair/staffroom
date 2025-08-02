import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-white.png";

import { useState } from "react";
import ChangePassword from '../ui/ChangePassword';
import Account from '../ui/Account';

export default function TeacherNavDesktop() {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className="px-8 py-4 bg-teal-700 flex justify-between w-full rounded-md mb-4 md:mb-8 text-white">
      <div>
        <Image src={logo} alt="Logo" width={180} />
      </div>
      <div className="flex items-center gap-10">
        <div className="hidden lg:flex gap-8 items-center">
          <Link href="/teacher">Dashboard</Link>
          <Link href="/teacher/weekly-timetable">Timetable</Link>
          <Link href="/teacher/assigned-substitutions">Substitutions</Link>
          <Link href="/teacher/leave-request">Leave Requests</Link>
        </div>
        <Account onChangePasswordClick={() => setShowModal(true)}/>
        <ChangePassword open={showModal} onClose={() => setShowModal(false)}/>
      </div>
    </div>
  );
}
