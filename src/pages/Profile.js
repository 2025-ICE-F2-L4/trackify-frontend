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

  // States for password change
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

  if (!profile) {
    return (
      <Container maxWidth="sm">
        <Box className="loading-container">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // If user has opted to change the password, validate the password fields.
    if (isChangingPassword) {
      if (!oldPassword) {
        setError("Please enter your old password.");
        return;
      }
      if (!newPassword || !confirmNewPassword) {
        setError("Please fill in the new password fields.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match.");
        return;
      }
    }

    // Build the update payload.
    const updateData = {
      username: profile.username,
    };
    if (isChangingPassword) {
      updateData.oldPassword = oldPassword;
      updateData.password = newPassword;
    }

    try {
      const response = await api.put("/auth/me", updateData);
      // Update the profile and global state using data from the response.
      setProfile({
        ...response.data,
        profileImage: "profpic.png",
      });
      setUser(response.data);
      setError("");
      setIsEditing(false);
      // Reset password change fields
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsChangingPassword(false);
    } catch (err) {
      console.error("Error updating user data:", err);
      // If the backend returns an error message, display it.
      setError(err.response?.data?.message || "Failed to update user data.");
    }
  };

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

        {error && (
          <Alert severity="error" className="profile-error">
            {error}
          </Alert>
        )}

        {isEditing ? (
          <Box component="form" className="profile-form">
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              name="username"
              value={profile.username}
              onChange={handleChange}
            />

            {/* Email is displayed but not editable */}
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              disabled
            />

            {/* Button to reveal password change fields */}
            {!isChangingPassword && (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsChangingPassword(true)}
                className="change-password-button"
              >
                Change password
              </Button>
            )}

            {isChangingPassword && (
              <Box className="password-fields">
                <TextField
                  margin="normal"
                  fullWidth
                  label="Old password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Repeat new password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </Box>
            )}

            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={handleSave}
              className="save-button"
            >
              Save Changes
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
              Edit Profile
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
