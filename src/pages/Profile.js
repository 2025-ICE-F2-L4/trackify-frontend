import React, { useState, useEffect } from "react";
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
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import "./Profile.css";

import ChartWeekly from "../components/ChartWeekly";
import ChartMonthly from "../components/ChartMonthly";
import ChartCompleted from "../components/ChartCompleted";
import "../components/Charts.css";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [events, setEvents] = useState([]);
    const [reports, setReports] = useState([]);
    const [completedStats, setCompletedStats] = useState({
        finished: 0,
        unfinished: 0,
    });
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/auth/me")
            .then((res) =>
                setProfile({ ...res.data, profileImage: "profpic.png" })
            )
            .catch(() => setError("Failed to fetch user data."));

        api.get("/task")
            .then((res) => {
                const mapped = res.data.tasks.map((task) => ({
                    id: task.id_task,
                    title: task.name,
                    start: new Date(task.startedAt),
                    end: task.finishedAt
                        ? new Date(task.finishedAt)
                        : new Date(task.startedAt),
                    color: task.tagColor || "#1976d2" // default if missing
                }));
                setEvents(mapped);
            })
            .catch(console.error);

        api.get("/task/report/week")
            .then((res) => setReports(res.data.tasksStats || []))
            .catch(console.error);
        // Fetch chart endpoints
        Promise.all([
            api.get("/chart/completed"),
            api.get("/chart/weekly"),
            api.get("/chart/monthly"),
        ])
            .then(([cRes, wRes, mRes]) => {
                // Completed stats: object with finished_tasks and unfinished_tasks
                const { finished_tasks, unfinished_tasks } = cRes.data;
                setCompletedStats({
                    finished: finished_tasks,
                    unfinished: unfinished_tasks,
                });

                // Weekly: array of [day_name, completed_tasks]
                setWeeklyData(
                    wRes.data.map((item) => [
                        item.day_name,
                        item.completed_tasks,
                    ])
                );

                // Monthly: { labels: [...], values: [...] }
                const labels = mRes.data.labels;
                const values = mRes.data.values;
                setMonthlyData(
                    labels.map((lbl, idx) => [
                        new Date(lbl).getTime(),
                        values[idx],
                    ])
                );
            })
            .catch(console.error);
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
            const msg =
                err.response?.data?.message || "Failed to change password.";
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
        <Container
            maxWidth={false}
            disableGutters
            sx={{ display: "flex", flexDirection: "column" }}
        >
            {/* Profile section */}
            <Box className="profile-box">
                <Avatar src={profile.profileImage} className="profile-avatar" />
                <Typography variant="h4" className="profile-title">
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
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Save Changes"
                            )}
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
                        >
                            Change Password
                        </Button>
                    </Box>
                )}
                {/* Weekly Reports section below profile */}
                <Box
                    className="reports-box"
                    sx={{
                        mt: 2,
                        mx: 2,
                        p: 2,
                        width: "100%",
                        border: "1px solid #ddd",
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Weekly Reports
                    </Typography>
                    {reports.length === 0 ? (
                        <Typography variant="body2">
                            No reports available.
                        </Typography>
                    ) : (
                        <List>
                            {reports.map((stat, i) => (
                                <ListItem key={i} divider>
                                    <ListItemText
                                        primary={`${stat.tagName} (${stat.total} tasks)`}
                                        secondary={`${
                                            stat.finished || 0
                                        } finished / ${
                                            stat.total - (stat.finished || 0)
                                        } unfinished`}
                                        style={{ color: stat.color }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Box>

            {/* Calendar section */}
            <Box
                sx={{
                    marginLeft: 60,
                    width: "70%",
                    height: 700,
                    mt: 4,
                }}
                className="calendar-box-container"
            >
                <Calendar
                    localizer={localizer}
                    events={events}
                    step={60}
                    views={allViews}
                    defaultDate={new Date()}
                    popup={false}
                    onSelectEvent={(event) => alert(`Task: ${event.title}`)}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.color,
                            color: "white",
                            borderRadius: "4px",
                            border: "none",
                            padding: "2px 5px"
                        }
                    })}
                />

            </Box>

            {/* Charts section */}
            <div className="charts-container">
                <div className="chart-container chart-weekly">
                    <h2>Completed Tasks (last 7 days)</h2>
                    <ChartWeekly />
                </div>
                <div className="chart-container chart-completed">
                    <h2>Total Completed Tasks</h2>
                    <ChartCompleted />
                </div>
                <div className="chart-container chart-monthly">
                    <h2>Completed Tasks (last 30 days)</h2>
                    <ChartMonthly />
                </div>
            </div>
        </Container>
    );
}
