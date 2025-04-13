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

export default function Navbar() {
    const handleRedirectToRegister = useRedirect("/register");
    const handleRedirectToLogin = useRedirect("/login");
    const handleRedirectToHome = useRedirect("/profile");
    const { user } = useUser();

    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
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
            <Container maxWidth="xl" sx={{ padding: "0 20px" }}> {/* Prevents sticking out */}
                <Toolbar disableGutters>
                    {/* Desktop Logo/Title */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            cursor: "pointer",
                            "&:hover": { color: "var(--hover-title)" },
                        }}
                        onClick={handleRedirectToHome}
                    >
                        Szczęśliwe Łapki
                    </Typography>

                    {/* Push buttons to the right */}
                    <Box sx={{ ml: "auto", display: { xs: "none", md: "flex" }, gap: 2 }}>
                        <Button
                            onClick={handleRedirectToLogin}
                            sx={{
                                my: 2,
                                color: "white",
                                backgroundColor: "transparent", // New distinct color
                                padding: "8px 16px",
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.2)", // Darker shade for hover
                                },
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={handleRedirectToRegister}
                            sx={{
                                my: 2,
                                color: "white",
                                backgroundColor: "var(--accent-color)",
                                "&:hover": {
                                    backgroundColor: "#E3A02D",
                                },
                            }}
                        >
                            Register
                        </Button>
                    </Box>

                    {/* Mobile Menu Icon */}
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
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "#FFF8E1", // Light warm off-white
                                    },
                                }}
                            >
                                <Typography textAlign="center">Add User</Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleRedirectToLogin();
                                    handleCloseNavMenu();
                                }}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "#FFF8E1",
                                    },
                                }}
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
