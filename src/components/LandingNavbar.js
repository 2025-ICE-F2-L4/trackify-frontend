import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useRedirect } from "../navigation/RedirectHandlers";
import { useUser } from "../context/UserContext";
import "./LandingNavbar.css";

export default function LandingNavbar() {
  const handleRedirectToRegister = useRedirect("/register");
  const handleRedirectToLogin = useRedirect("/login");
  const handleRedirectToLanding = useRedirect("/");
  const { user } = useUser();

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" className="app-bar">
      <Container maxWidth="xl" sx={{ padding: "0 20px" }}>
        <Toolbar disableGutters>
          {/* Desktop Logo/Title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="nav-title"
            onClick={handleRedirectToLanding}
          >
            Trackify
          </Typography>

          {/* Push buttons to the right */}
          <Box className="nav-buttons-container">
            <Button onClick={handleRedirectToLogin} className="nav-button">
              Login
            </Button>
            <Button
              onClick={handleRedirectToRegister}
              className="register-button"
            >
              Register
            </Button>
          </Box>

          <Box className="nav-buttons-container-mobile">
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              className="icon-button"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              <MenuItem
                onClick={() => {
                  handleRedirectToRegister();
                  handleCloseNavMenu();
                }}
                className="menu-item"
              >
                <Typography textAlign="center">Register</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleRedirectToLogin();
                  handleCloseNavMenu();
                }}
                className="menu-item"
              >
                <Typography textAlign="center">Login</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
