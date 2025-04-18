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
import "./Navbar.css";

export default function Navbar() {
  const handleRedirectToTasks = useRedirect("/tasks");
  const handleRedirectToProfile = useRedirect("/profile");
  const handleRedirectToLogout = useRedirect("/");

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
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="nav-title"
            onClick={handleRedirectToTasks}
          >
            Trackify
          </Typography>

          <Typography
            variant="h6"
            noWrap
            component="div"
            className="nav-title-mobile"
            onClick={handleRedirectToTasks}
          >
            Trackify
          </Typography>

          <Box className="nav-buttons-container">
            <Button onClick={handleRedirectToTasks} className="nav-button">
              Tasks
            </Button>

            <Button onClick={handleRedirectToProfile} className="nav-button">
              Profile
            </Button>

            <Button onClick={handleRedirectToLogout} className="logout-button">
              Logout
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
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              className="nav-menu"
            >
              <MenuItem
                onClick={() => {
                  handleRedirectToTasks();
                  handleCloseNavMenu();
                }}
                className="menu-item"
              >
                <Typography textAlign="center">Home</Typography>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleRedirectToProfile();
                  handleCloseNavMenu();
                }}
                className="menu-item"
              >
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleRedirectToLogout();
                  handleCloseNavMenu();
                }}
                className="menu-item"
              >
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
