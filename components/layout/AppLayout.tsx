"use client";

import { ReactNode, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListSubheader,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import {
  HomeRounded,
  SchoolRounded,
  PeopleRounded,
  TableChartRounded,
  CalendarMonthRounded,
  AssignmentRounded,
} from "@mui/icons-material";
import NavItem from "./NavItem";
import Account from "../ui/Account";
import ChangePassword from "../ui/ChangePassword";
import Image from "next/image";
import logo from "@/public/logo.png";
import Header from "./Header";

const drawerWidth = 320;

const adminLinks = [
  {
    href: "/admin",
    icon: <HomeRounded />,
    text: "Dashboard",
  },
  {
    href: "/admin/substitution",
    icon: <SchoolRounded />,
    text: "Substitutions",
  },
  {
    href: "/admin/teachers",
    icon: <PeopleRounded />,
    text: "Teachers",
  },
  {
    href: "/admin/timetable",
    icon: <TableChartRounded />,
    text: "Timetable",
  },
];

const teacherLinks = [
  {
    href: "/teacher",
    icon: <HomeRounded />,
    text: "Dashboard",
  },
  {
    href: "/teacher/weekly-timetable",
    icon: <CalendarMonthRounded />,
    text: "Timetable",
  },
  {
    href: "/teacher/assigned-substitutions",
    icon: <AssignmentRounded />,
    text: "Substitutions",
  },
  {
    href: "/teacher/leave-request",
    icon: <SchoolRounded />,
    text: "Leave Requests",
  },
];

export default function AppLayout({
  children,
  role,
}: {
  children: ReactNode;
  role: "admin" | "teacher" | "admin-teacher";
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const links =
    role === "admin"
      ? adminLinks
      : role === "teacher"
        ? teacherLinks
        : [...adminLinks, ...teacherLinks];

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box>
        <Toolbar className="mt-8 mb-4 ml-4 lg:ml-2">
          <Image src={logo} alt="Logo" width={200} />
        </Toolbar>
        {role === "admin-teacher" ? (
          <>
            <List
              sx={{ marginBottom: "8px" }}
              subheader={
                <ListSubheader
                  sx={{
                    fontSize: "1.2rem",
                    padding: "0 32px",
                    fontWeight: "bold",
                    color: "#008080",
                  }}
                >
                  Admin
                </ListSubheader>
              }
            >
              {adminLinks.map((link) => (
                <NavItem
                  href={link.href}
                  icon={link.icon}
                  text={link.text}
                  key={link.href}
                />
              ))}
            </List>
            <List
              subheader={
                <ListSubheader
                  sx={{
                    fontSize: "1.2rem",
                    padding: "0 32px",
                    fontWeight: "bold",
                    color: "#008080",
                  }}
                >
                  Teacher
                </ListSubheader>
              }
            >
              {teacherLinks.map((link) => (
                <NavItem
                  href={link.href}
                  icon={link.icon}
                  text={link.text}
                  key={link.href}
                />
              ))}
            </List>
          </>
        ) : (
          <List>
            {links.map((link) => (
              <NavItem
                href={link.href}
                icon={link.icon}
                text={link.text}
                key={link.href}
              />
            ))}
          </List>
        )}
      </Box>
      <Box sx={{ mt: "auto", p: 2 }}>
        <Account onChangePasswordClick={() => setShowPasswordModal(true)} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#ffffff",
              color: "black",
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#ffffff",
              color: "black",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          paddingTop: { xs: "88px", sm: "32px" },
        }}
      >
        {children}
      </Box>
      <ChangePassword
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </Box>
  );
}
