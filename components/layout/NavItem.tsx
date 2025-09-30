import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

export default function NavItem({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <ListItem disablePadding sx={{ padding: "0 16px", margin: "8px 0" }}>
      <ListItemButton
        component={Link}
        href={href}
        selected={isActive}
        sx={{
          borderRadius: "8px",
          "&.Mui-selected": {
            backgroundColor: "#008080",
            color: "white",
            "&:hover": {
              backgroundColor: "#008080",
            },
          },
        }}
      >
        <ListItemIcon
          sx={{ minWidth: "auto", paddingRight: "16px", color: "inherit" }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
