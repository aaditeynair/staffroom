"use client";

import Link from "next/link";
import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { DeleteRounded, EditRounded, InfoRounded } from "@mui/icons-material";
import UserEditModal from "@/components/admin/teachers/UserEditModal";
import UserDeleteModal from "./UserDeleteModal";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  division: string;
  role: "admin" | "teacher" | "admin-teacher";
}

export function UserCard({ user }: { user: User }) {
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };
  const closeMenu = () => setMenuAnchor(null);

  return (
    <div>
      <Link
        href={`/admin/teachers/${user.id}`}
        className="no-underline rounded-md shadow-md hover:shadow-xl flex justify-between p-4 transition-shadow"
      >
        <div>
          <div className="flex gap-4 items-center">
            <h3 className="text-teal-800">{user.name}</h3>
            {user.role === "teacher" ? (
              <span
                className={
                  "rounded-lg px-2 text-sm " +
                  (user.division === "Senior"
                    ? "bg-orange-300"
                    : "bg-yellow-200")
                }
              >
                {user.division.toLowerCase()}
              </span>
            ) : (
              <span
                className={
                  "rounded-lg px-2 py-0.5 text-sm " +
                  (user.role === "admin" ? "bg-blue-200" : "bg-green-200")
                }
              >
                {user.role.toLowerCase()}
              </span>
            )}
          </div>
          <p className="text-gray-700 text-sm">{user.email}</p>
        </div>
        <IconButton
          aria-label="Quick actions"
          onClick={openMenu}
          component="span"
        >
          <MoreHorizRoundedIcon />
        </IconButton>
      </Link>

      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        onClick={(e) => e.stopPropagation()} // prevent link click
      >
        <MenuItem
          onClick={() => {
            closeMenu();
            setEditOpen(true);
          }}
        >
          <p className="text-sm text-teal-700 uppercase flex gap-2">
            <EditRounded fontSize="small" color="inherit" />
            <span>Edit Info</span>
          </p>
        </MenuItem>
        <MenuItem
          component={Link}
          href={`/teachers/${user.id}`}
          onClick={closeMenu}
        >
          <p className="text-sm text-teal-700 uppercase flex gap-2">
            <InfoRounded fontSize="small" color="inherit" />
            <span>View Info</span>
          </p>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            setDeleteOpen(true);
          }}
        >
          <p className="text-sm text-red-700 uppercase flex gap-2">
            <DeleteRounded fontSize="small" color="inherit" />
            <span>Delete Teacher</span>
          </p>
        </MenuItem>
      </Menu>

      <UserEditModal
        user={user}
        open={editOpen}
        onCloseAction={() => setEditOpen(false)}
        onSaveAction={() => {
          router.refresh();
        }}
      />

      <UserDeleteModal
        user={user}
        open={deleteOpen}
        onCloseAction={() => setDeleteOpen(false)}
        onSaveAction={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
