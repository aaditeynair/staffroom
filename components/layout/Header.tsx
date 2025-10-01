import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import logo from "@/public/logo.png";

interface HeaderProps {
  handleDrawerToggle: () => void;
}

export default function Header({ handleDrawerToggle }: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        display: { lg: "none" },
        backgroundColor: "white",
        color: "black",
        padding: "4px 28px",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, position: "absolute", left: 0 }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Image src={logo} alt="Logo" width={150} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
