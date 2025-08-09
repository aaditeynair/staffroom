"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { DeleteRounded, EditRounded, InfoRounded } from "@mui/icons-material";
import UserEditForm from "./UserEditForm";

interface User {
  id: string;
  name: string;
  email: string;
  division: string;
  role: "admin" | "teacher" | "admin-teacher";
}

export function UserCard({ user }: { user: User }) {
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
        href={`/teachers/${user.id}`}
        className="no-underline rounded-md shadow-md hover:shadow-xl flex justify-between p-4 transition-shadow"
      >
        <div>
          <h3 className="text-teal-800">{user.name}</h3>
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

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogContent>
          <UserEditForm
            user={user}
            onSaveAction={() => setEditOpen(false)}
            onCancelAction={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete <strong>{user.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => setDeleteOpen(false)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
