import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import api from "../api";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  CircularProgress,
} from "@mui/material";
import "./Profile.css";

export default function Profile() {
  const { setUser } = useUser();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/me");
        setProfile({
          ...response.data,
          profileImage: "profpic.png", // static profile image
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/change-password", { password: newPassword });
      setSuccess("Password changed successfully.");
      setIsEditing(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error changing password:", err);
      const msg = err.response?.data?.message || "Failed to change password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
        <Container maxWidth="sm">
          <Box className="loading-container">
            <CircularProgress />
          </Box>
        </Container>
    );
  }

  return (
      <Container maxWidth="sm">
        <Box className="profile-box">
          <Avatar src={profile.profileImage} className="profile-avatar" />

          <Typography
              variant="h4"
              component="h1"
              align="center"
              className="profile-title"
          >
            My Profile
          </Typography>

          {(error || success) && (
              <Alert
                  severity={error ? "error" : "success"}
                  className="profile-error"
              >
                {error || success}
              </Alert>
          )}

          {isEditing ? (
              <Box component="form" className="profile-form">
                {/* Old Password */}
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                {/* New Password */}
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                {/* Confirm Password */}
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    className="save-button"
                    onClick={handleSave}
                    disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
                <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    sx={{ mt: 1 }}
                >
                  Cancel
                </Button>
              </Box>
          ) : (
              <Box className="profile-info">
                <Typography variant="h6" align="center">
                  {profile.username}
                </Typography>
                <Typography
                    variant="body1"
                    align="center"
                    className="profile-email"
                >
                  {profile.email}
                </Typography>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    className="edit-button"
                >
                  Change Password
                </Button>
              </Box>
          )}
        </Box>
      </Container>
  );
}
