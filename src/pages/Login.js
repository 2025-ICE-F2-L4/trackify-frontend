import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
} from "@mui/material";
import { useRedirect } from "../navigation/RedirectHandlers";
import { useUser } from "../context/UserContext";
import api from "../api";
import "./Login.css";

export default function Login() {
  const { loginUser } = useUser();
  const handleRedirectToRegister = useRedirect("/register");
  const handleRedirectToProfile = useRedirect("/profile");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Both username and password are required.");
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("authToken", response.data.token);
      handleRedirectToProfile();
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="login-box">
        <Typography
          variant="h4"
          component="h1"
          align="center"
          className="login-title"
        >
          Login
        </Typography>

        {error && (
          <Alert severity="error" className="login-error">
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          className="login-form"
        >
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="login-button"
            disabled={!formData.username || !formData.password}
          >
            Login
          </Button>
          <Box textAlign="center" className="login-link-container">
            <Link
              component="button"
              variant="body2"
              onClick={handleRedirectToRegister}
            >
              Don't have an account? Register
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
