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

    const navButtonStyle = {
        my: 2,
        color: "white",
        backgroundColor: "transparent",
        padding: "8px 16px",
        borderRadius: "8px",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
        },
    };

    const menuItemStyle = {
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "var(--primary-bg)",
                width: "100%",
                boxShadow: "none",
            }}
        >
            <Container maxWidth="xl" sx={{ padding: "0 20px" }}>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            cursor: "pointer",
                            "&:hover": { color: "var(--hover-title)" },
                            display: { xs: 'none', sm: 'flex' },
                        }}
                        onClick={handleRedirectToTasks}
                    >
                        Trackify
                    </Typography>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            flexGrow: 1,
                            cursor: "pointer",
                            "&:hover": { color: "var(--hover-title)" },
                            display: { xs: 'flex', sm: 'none' },
                        }}
                        onClick={handleRedirectToTasks}
                    >
                        Trackify
                    </Typography>

                    <Box sx={{ ml: "auto", display: { xs: "none", md: "flex" }, gap: 2 }}>
                        <Button
                            onClick={handleRedirectToTasks}
                            sx={navButtonStyle}
                        >
                            Tasks
                        </Button>

                        <Button
                            onClick={handleRedirectToProfile}
                            sx={navButtonStyle}
                        >
                            Profile
                        </Button>

                        <Button
                            onClick={handleRedirectToLogout}
                            sx={{
                                my: 2,
                                color: "white",
                                backgroundColor: "var(--accent-color)",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "#E3A02D",
                                },
                            }}
                        >
                            Logout
                        </Button>
                    </Box>

                    <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
                        <IconButton
                            size="large"
                            aria-label="navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            sx={{
                                "&:hover": {
                                    backgroundColor: "rgba(255, 235, 205, 0.2)",
                                },
                            }}
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
                            sx={{
                                "& .MuiPaper-root": {
                                    backgroundColor: "var(--primary-bg)",
                                    color: "white",
                                },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleRedirectToTasks();
                                    handleCloseNavMenu();
                                }}
                                sx={menuItemStyle}
                            >
                                <Typography textAlign="center">Home</Typography>
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    handleRedirectToProfile();
                                    handleCloseNavMenu();
                                }}
                                sx={menuItemStyle}
                            >
                                <Typography textAlign="center">Profile</Typography>
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    handleRedirectToLogout();
                                    handleCloseNavMenu();
                                }}
                                sx={menuItemStyle}
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
