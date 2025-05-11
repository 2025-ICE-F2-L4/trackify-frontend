import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { useUser } from "../context/UserContext";
import api from "../api";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
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

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function Profile() {
  const { setUser } = useUser();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/me");
        setProfile({
          ...response.data,
          profileImage: "profpic.png",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, []);

  // Fetch tasks and map to calendar events
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/task");
        const tasksArray = response.data.tasks; // API returns { tasks: [...] }
        setTasks(tasksArray);
        // Map tasks to calendar events
        const mapped = tasksArray.map(task => ({
          id: task.id_task,
          title: task.name,
          start: new Date(task.startedAt),
          end: task.finishedAt ? new Date(task.finishedAt) : new Date(task.startedAt),
        }));
        setEvents(mapped);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
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
        <Container maxWidth={false}>
          <Box className="loading-container">
            <CircularProgress />
          </Box>
        </Container>
    );
  }

  const allViews = Object.values(Views);

  return (
      <Container maxWidth={false} disableGutters sx={{ display: "flex", flexDirection: "column" }}>
        {/* Profile section */}
        <Box className="profile-box">
          <Avatar src={profile.profileImage} className="profile-avatar" />
          <Typography variant="h4" className="profile-title">
            My Profile
          </Typography>
          {(error || success) && (
              <Alert severity={error ? "error" : "success"} className="profile-error">
                {error || success}
              </Alert>
          )}
          {isEditing ? (
              <Box component="form" className="profile-form">
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button fullWidth variant="contained" onClick={handleSave} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
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
                <Typography variant="body1" align="center" className="profile-email">
                  {profile.email}
                </Typography>
                <Button fullWidth variant="contained" onClick={() => setIsEditing(true)}>
                  Change Password
                </Button>
              </Box>
          )}
        </Box>

        {/* Calendar section */}
        <Box sx={{
          marginLeft: 60,
          width: "70%",
          height: 700,
          mt: 4 }}>
          <Calendar
              localizer={localizer}
              events={events}
              step={60}
              views={allViews}
              defaultDate={new Date()}
              popup={false}
              onSelectEvent={(event) => alert(`Task: ${event.title}`)}
          />
        </Box>
      </Container>
  );
}
