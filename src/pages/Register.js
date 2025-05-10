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
import api from "../api";
import "./Register.css";

export default function Register() {
  const handleRedirectToLogin = useRedirect("/login");
  const handleRedirectToLanding = useRedirect("/");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      setFormError("All fields are required!");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await api.post("/auth/register", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
      });

      console.log("Response from server:", response.data);
      // Redirect to the profile page after successful registration
      handleRedirectToLanding();
    } catch (error) {
      if (error.response) {
        console.error("Backend responded with:", error.response.data);
        setFormError(error.response.data.message || "Submission failed.");
      } else {
        console.error("Error during submission:", error.message);
        setFormError("Could not connect to server.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="register-box">
        <Typography
          variant="h4"
          component="h1"
          align="center"
          className="register-title"
        >
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          className="register-form"
        >
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {formError && (
            <Alert severity="error" className="register-error">
              {formError}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="register-button"
            disabled={
              !formData.email || !formData.password || !formData.username
            }
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </Button>

          <Box textAlign="center" className="register-link-container">
            <Link
              component="button"
              variant="body2"
              onClick={handleRedirectToLogin}
            >
              Already have an account? Login
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
