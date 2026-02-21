import { useState, type MouseEvent, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  AccountCircle,
  Login,
  BookmarkBorder,
  Person,
  DarkMode,
  AdminPanelSettings
} from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../theme/ThemeContext";

type MenuAction = "login" | "reservas" | "perfil";

interface UserMenuProps {
  onMenuItemClick?: (action: MenuAction) => void;
}

export const UserMenu = ({ onMenuItemClick }: UserMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const {toggleTheme} = useThemeContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: MenuAction, path: string) => {
    if (onMenuItemClick) {
      onMenuItemClick(action);
    }
    navigate(path);
    handleClose();
  };

const {token, logout, user} = useContext(AuthContext);
const isAdmin = user?.role === "ADMIN";

const handleLogout = () => {
  logout()
  navigate("/login")
  handleClose()
}

const menuItems = token
  ? [
      { action: "reservas" as MenuAction, label: "Minhas Reservas", icon: <BookmarkBorder />, path: "/reservas", onClick: () => handleMenuItemClick("reservas", "/reservas") },
      { action: "perfil" as MenuAction, label: "Meu Perfil", icon: <Person />, path: "/perfil", onClick: () => handleMenuItemClick("perfil", "/perfil") },
      ...(isAdmin ? [{
        action: "admin" as MenuAction,
        label: "Painel Admin",
        icon: <AdminPanelSettings />,
        onClick: () => handleMenuItemClick("admin" as MenuAction, "/dashboard"),
      }] : []),
      { action: "tema" as MenuAction, label: "Alternar Tema", icon: <DarkMode />, onClick: () => { toggleTheme(); handleClose(); } },
      { action: "sair" as MenuAction, label: "Sair", icon: <LogoutIcon />, onClick: handleLogout, color: "error.main" },
    ]
  : [
      { action: "login" as MenuAction, label: "Login", icon: <Login />, path: "/login", onClick: () => handleMenuItemClick("login", "/login") },
      { action: "tema" as MenuAction, label: "Alternar Tema", icon: <DarkMode />, onClick: () => { toggleTheme(); handleClose(); } },
    ];

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="large"
        color="primary"
        aria-label="menu do usuário"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <AccountCircle sx={{ fontSize: 40 }} />
      </IconButton>

      <Menu
  id="user-menu"
  anchorEl={anchorEl}
  open={open}
  onClose={handleClose}
  transformOrigin={{ horizontal: "right", vertical: "top" }}
  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
  PaperProps={{
    sx: {
      mt: 1.5,
      minWidth: 240,
      borderTopRightRadius: 3,
      paddingY: 1,
    },
  }}
>
  {menuItems.map((item, index) => (
    <div key={item.action}>
      <MenuItem
        onClick={item.onClick}
        sx={{
          py: 1.2,
          px: 2,
          borderRadius: 2,
          transition: "all 0.2s ease",
          color: item.color ?? "inherit",
          "&:hover": {
            backgroundColor:"action.hover",
            "& .MuiListItemIcon-root": {
              color: item.color ?? "secondary.main",
            },
          },
        }}
      >
        <ListItemIcon sx={{ color: item.color ?? "primary.main" }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText>{item.label}</ListItemText>
      </MenuItem>
      {index < menuItems.length - 1 && <Divider />}
    </div>
  ))}
</Menu>
    </>
  );
};