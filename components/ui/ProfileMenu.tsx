
import { Menu, MenuItem } from "@mui/material";
import { Logout } from "@mui/icons-material";

interface ProfileMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onChangePasswordClick: () => void;
  onLogoutClick: () => void;
}

export default function ProfileMenu({ anchorEl, onClose, onChangePasswordClick, onLogoutClick }: ProfileMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      transformOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <MenuItem
        onClick={() => {
          onClose();
          onChangePasswordClick();
        }}
      >
        Change Password
      </MenuItem>
      <MenuItem disabled>
        Enable/Disable Notifications (TODO)
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClose();
          onLogoutClick();
        }}
        sx={{ color: "red" }}
      >
        <Logout sx={{ marginRight: "16px" }} />
        Logout
      </MenuItem>
    </Menu>
  );
}
