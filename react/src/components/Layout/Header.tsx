import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Palette,
  Home,
  Login,
  PersonAdd,
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";

// Animated gradient for header
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ColorfulAppBar = styled(AppBar)(() => ({
  background:
    "linear-gradient(-45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)",
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 20s ease infinite`,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255,255,255,0.1)",
    zIndex: 1,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  minHeight: "70px !important",
  padding: theme.spacing(0, 2),
}));

const LogoBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  flexGrow: 1,
  cursor: "pointer",
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    transform: "scale(1.05)",
    transition: "transform 0.2s ease",
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: "white",
  fontWeight: "bold",
  margin: theme.spacing(0, 0.5),
  borderRadius: 20,
  padding: theme.spacing(1, 2),
  textTransform: "none",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: "rgba(255,255,255,0.3)",
  color: "white",
  marginRight: theme.spacing(1),
  border: "2px solid rgba(255,255,255,0.5)",
}));

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        alert("Logout failed: " + error.message);
      } else {
        alert("Logout failed");
      }
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <ColorfulAppBar position="fixed">
      <StyledToolbar>
        <LogoBox onClick={handleLogoClick}>
          <Palette sx={{ fontSize: 35, mr: 1, color: "white" }} />
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            🎨 Kids Colors
          </Typography>
        </LogoBox>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <NavButton startIcon={<Home />}>Home</NavButton>
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link to={`/user/${user.id}`} style={{ textDecoration: "none" }}>
                <NavButton startIcon={<Palette />}>Color</NavButton>
              </Link>

              {user.role === "admin" && (
                <Link to="/admin" style={{ textDecoration: "none" }}>
                  <NavButton startIcon={<AdminPanelSettings />}>
                    Admin
                  </NavButton>
                </Link>
              )}

              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <UserAvatar>{user.email?.charAt(0).toUpperCase()}</UserAvatar>
                <NavButton
                  onClick={handleLogout}
                  startIcon={<Logout />}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  Sign Out
                </NavButton>
              </Box>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <NavButton startIcon={<Login />}>Sign In</NavButton>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <NavButton
                  startIcon={<PersonAdd />}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  Register
                </NavButton>
              </Link>
            </>
          )}
        </Box>
      </StyledToolbar>
    </ColorfulAppBar>
  );
};

export default Header;
