import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavItemProps {
  name: string;
  link: string;
  icon: ReactNode;
}

export default function AdminNavItem({ name, link, icon }: NavItemProps) {
  const path = usePathname();
  const isActive = path === link;
  return (
    <Link
      href={link}
      className={
        "flex gap-2 items-center rounded-md px-4 py-2 " +
        (isActive ? "bg-white text-teal-700" : "bg-teal-700 text-white")
      }
    >
      <div>{icon}</div>
      {isActive && <div className="font-bold">{name}</div>}
    </Link>
  );
}
