import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TaskItem from "./TaskItem";
import api from "../api";
import "./Tasks.css";

export default function Tasks({ filter, searchTerm = "" }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedDescription, setEditedDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [editedName, setEditedName] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        setIsLoading(true);
        api.get("/task")
            .then((response) => {
                if (response.data && Array.isArray(response.data.tasks)) {
                    const updatedTasks = response.data.tasks.map((task) => ({
                        ...task,
                        completed: !!task.finishedAt,
                    }));
                    setTasks(updatedTasks);
                } else {
                    setTasks([]);
                }
            })
            .catch((error) =>
                setError(
                    error?.response?.data?.message || "Failed to fetch tasks"
                )
            )
            .finally(() => setIsLoading(false));
    };

    const handleAddTask = async () => {
        const payload = { name: newTask };
        try {
            const response = await api.post("/task", payload);
            const createdTask = response.data;
            setTasks([...tasks, createdTask]);
            setNewTask("");
            fetchTasks();
        } catch (error) {
            setError(error?.response?.data?.message || "Error adding task");
        }
    };

    const handleToggleTask = async (index) => {
        const task = tasks[index];
        const isNowCompleted = !task.completed;
        try {
            await api.put(`/task/${task.id_task}`, {
                isFinished: isNowCompleted ? 1 : 0,
            });

            const updatedTasks = tasks.map((t, i) => {
                if (i === index) {
                    return {
                        ...t,
                        completed: isNowCompleted,
                        finishedAt: isNowCompleted
                            ? new Date().toISOString()
                            : null,
                    };
                }
                return t;
            });

            setTasks(updatedTasks);

            if (selectedTask?.index === index) {
                setSelectedTask({
                    ...updatedTasks[index],
                    index,
                });
            }
        } catch (error) {
            setError(
                error?.response?.data?.message || "Error updating task status"
            );
        }
    };

    const handleSelectTask = (index) => {
        setSelectedTask({ ...tasks[index], index });
        setEditedDescription(tasks[index].description);
        setEditMode(false);
        setConfirmDelete(false);
    };

    const handleCloseDetails = () => {
        setSelectedTask(null);
    };

    const handleSaveDescription = () => {
        const updatedTasks = [...tasks];
        updatedTasks[selectedTask.index].description = editedDescription;
        setTasks(updatedTasks);
        setSelectedTask({ ...selectedTask, description: editedDescription });
        setEditMode(false);
    };

    const handleDateChange = (date, field) => {
        const updatedTasks = [...tasks];
        updatedTasks[selectedTask.index][field] = date;
        setTasks(updatedTasks);
        setSelectedTask({ ...selectedTask, [field]: date });
    };

    useEffect(() => {
        if (confirmDelete) {
            const timer = setTimeout(() => {
                setConfirmDelete(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [confirmDelete]);

    const handleDeleteTasks = async (index) => {
        const taskToDelete = tasks[index];
        try {
            console.log("Deleting task with id:", taskToDelete.id_task);
            await api.delete(`/task/${taskToDelete.id_task}`);
            const updatedTasks = tasks.filter((_, i) => i !== index);
            setTasks(updatedTasks);
            if (selectedTask?.index === index) {
                setSelectedTask(null);
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Error deleting task");
        }
    };

    const handleDuplicateTask = async () => {
        if (selectedTask) {
            const baseName = selectedTask.name.replace(/ \(\d+\)$/, "");
            const duplicates = tasks.filter((task) => {
                const taskBaseName = task.name.replace(/ \(\d+\)$/, "");
                return taskBaseName === baseName;
            });
            const duplicateCount = duplicates.length;
            const newName = `${baseName} (${duplicateCount})`;

            const payload = { name: newName };
            try {
                const response = await api.post("/task", payload);
                const createdTask = response.data;
                setTasks([...tasks, createdTask]);
                fetchTasks();
            } catch (error) {
                setError(
                    error?.response?.data?.message || "Error duplicating task"
                );
            }
        }
    };

    const handleSaveName = async () => {
        try {
            await api.put(`/task/${selectedTask.id_task}`, {
                name: editedName,
            });
            const updatedTasks = [...tasks];
            updatedTasks[selectedTask.index].name = editedName;
            setTasks(updatedTasks);
            setSelectedTask({ ...selectedTask, name: editedName });
            setEditingName(false);
            fetchTasks();
        } catch (error) {
            setError(
                error?.response?.data?.message || "Error updating task name"
            );
        }
    };

    const formatDate = (date) => {
        return (
            date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }) +
            " " +
            date.toLocaleDateString([], {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
        );
    };
    const filteredTasks = tasks
        .filter((t) => {
            if (filter === "completed") return t.completed;
            if (filter === "uncompleted") return !t.completed;
            return true;
        })
        .filter((t) =>
            t.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
    return (
        <div className="tasks-container">
            {/* Left side - task list */}
            <div className={`task-list ${selectedTask ? "has-details" : ""}`}>
                <h2 className="task-list-title">Today's Goals</h2>
                {isLoading && <p>Loading Goals...</p>}
                {error && <p className="task-error">{error}</p>}
                <div className="task-input-container">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => {
                            setNewTask(e.target.value);
                        }}
                        placeholder="Add new goal..."
                        className="task-input"
                        onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                    />
                    <button onClick={handleAddTask} className="task-add-button">
                        Add
                    </button>
                </div>
                <ul className="task-list-ul">
                    {filteredTasks.length === 0 ? (
                        <li className="task-empty">No goals to display</li>
                    ) : (
                        filteredTasks.map((task, index) => (
                            <TaskItem
                                key={task.id_task}
                                index={index}
                                task={task}
                                isSelected={selectedTask?.index === index}
                                onToggle={handleToggleTask}
                                onSelect={handleSelectTask}
                                onDelete={handleDeleteTasks}
                                tagColor={task.tagColor}
                                tagName={task.tagName}
                            />
                        ))
                    )}
                </ul>
            </div>
            {/* Right side - task details */}
            {selectedTask && (
                <div className="task-details">
                    <h1 className="task-details-title">Goal Description</h1>
                    <div className="task-name-container">
                        {editingName ? (
                            <>
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) =>
                                        setEditedName(e.target.value)
                                    }
                                    className="task-name-input"
                                />
                                <button
                                    onClick={handleSaveName}
                                    className="task-name-save-button"
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="task-name">
                                    {selectedTask.name}
                                </h2>
                                <button
                                    onClick={() => {
                                        setEditingName(true);
                                        setEditedName(selectedTask.name);
                                    }}
                                    className="task-name-edit-button"
                                    title="Edit task name"
                                >
                                    Edytuj
                                </button>
                            </>
                        )}
                    </div>

                    {editMode ? (
                        <div className="task-description-container">
                            <textarea
                                value={editedDescription}
                                onChange={(e) =>
                                    setEditedDescription(e.target.value)
                                }
                                placeholder="Click to edit description"
                                className="task-description-textarea"
                            />
                            <button
                                onClick={handleSaveDescription}
                                className="task-description-save-button"
                            >
                                Save Description
                            </button>
                        </div>
                    ) : (
                        <p
                            onClick={() => setEditMode(true)}
                            className={`task-description ${
                                selectedTask.description ? "" : "empty"
                            }`}
                        >
                            {selectedTask.description ||
                                "Click to add description..."}
                        </p>
                    )}
                    <div className="task-date-container">
                        {/* Start Date */}
                        <div className="task-date">
                            <strong className="task-date-label">
                                Start Date
                            </strong>
                            <DatePicker
                                selected={new Date(selectedTask.startedAt)}
                                onChange={(date) =>
                                    handleDateChange(date, "startedAt")
                                }
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="HH:mm dd-MM-yyyy"
                                customInput={
                                    <div className="task-datepicker">
                                        {formatDate(
                                            new Date(selectedTask.startedAt)
                                        )}
                                    </div>
                                }
                            />
                        </div>
                    </div>
                    <div className="task-actions-container">
                        <button
                            onClick={() => {
                                if (selectedTask) {
                                    handleToggleTask(selectedTask.index);
                                }
                            }}
                            className={`task-action-button complete ${
                                selectedTask.completed ? "completed" : ""
                            }`}
                        >
                            {selectedTask.completed
                                ? "✗ Mark as Uncompleted"
                                : "✓ Complete Goal"}
                        </button>
                        <button
                            onClick={handleCloseDetails}
                            className="task-action-button close"
                        >
                            ✕ Close
                        </button>
                        <button
                            onClick={() => {
                                if (!confirmDelete) {
                                    setConfirmDelete(true);
                                } else {
                                    handleDeleteTasks(selectedTask.index);
                                    setConfirmDelete(false);
                                }
                            }}
                            className={`task-action-button delete ${
                                confirmDelete ? "confirm" : ""
                            }`}
                        >
                            {confirmDelete ? "Are you sure?" : "🗑 Delete"}
                        </button>
                        <button
                            onClick={handleDuplicateTask}
                            className="task-action-button duplicate"
                        >
                            Duplicate Task
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
