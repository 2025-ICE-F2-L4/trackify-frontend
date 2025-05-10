import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TaskItem from "./TaskItem";
import api from "../api";
import "./Tasks.css";
import {Autocomplete, Button, Chip, Stack, TextField} from "@mui/material";

export default function Tasks({filter, searchTerm=""}) {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [tempTag, setTempTag] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  // useEffect(() => {
  //   fetchTasks();
  //   fetchTags();
  // }, []);
  useEffect(() => {
    initData();
  }, []);

// inside Tasks.jsx
  const initData = async () => {
    setIsLoading(true);
    try {
      const [tagsRes, tasksRes] = await Promise.all([
        api.get('/tag'),
        api.get('/task'),
      ]);
      const allTags = tagsRes.data.tags || [];
      setTags(allTags);

      const rawTasks = Array.isArray(tasksRes.data.tasks)
          ? tasksRes.data.tasks
          : [];

      const merged = rawTasks.map(t => {
        // Attempt to find full tag object from fetched tags by id_tag or by name
        let tagObj = null;

        // 1) If API returned nested t.tag
        if (t.tag) {
          tagObj = t.tag;
        }
        // 2) If API returned numeric id_tag
        else if (t.id_tag != null) {
          tagObj = allTags.find(tag => tag.id_tag === t.id_tag) || null;
        }
        // 3) If API returned tagName/tagColor, match by name or fallback to build
        else if (t.tagName) {
          // Try matching existing tag by name
          tagObj = allTags.find(tag => tag.name === t.tagName) || null;
          // If no matching tag, build minimal object
          if (!tagObj) {
            tagObj = {
              id_tag: null,     // unknown id
              name: t.tagName,
              color: t.tagColor
            };
          }
        }

        return {
          ...t,
          completed: !!t.finishedAt,
          tag: tagObj,
        };
      });

      setTasks(merged);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      try {
        await api.post("/task", {name: newTask});
        setNewTask("");
        initData();
      } catch (error) {
        setError(error?.response?.data?.message || "Error adding task");
      }
    }
  };

  const handleToggleTask = async (index) => {
    const task = tasks[index];
    const isNowCompleted = !task.completed;
    try {
      await api.put(`/task/${task.id_task}`, {
        isFinished: isNowCompleted ? 1 : 0,
      });
      await initData();

      const updatedTasks = tasks.map((t, i) => {
        if (i === index) {
          return {
            ...t,
            completed: isNowCompleted,
            finishedAt: isNowCompleted ? new Date().toISOString() : null,
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
      setError(error?.response?.data?.message || "Error updating task status");
    }
  };

  const handleSelectTask = (index) => {
    const task = tasks[index];
    setSelectedTask({ ...task, index });
    setTempTag(task.tag || null);
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
      try {
        await api.post("/task", { name: newName });
        await initData();
      } catch (error) {
        setError(error?.response?.data?.message || "Error duplicating task");
      }
    }
  };

  const handleSaveName = async () => {
    try {
      await api.put(`/task/${selectedTask.id_task}`, { name: editedName });
      const updatedTasks = [...tasks];
      updatedTasks[selectedTask.index].name = editedName;
      setTasks(updatedTasks);
      setSelectedTask({ ...selectedTask, name: editedName });
      setEditingName(false);
      await initData();
    } catch (error) {
      setError(error?.response?.data?.message || "Error updating task name");
    }
  };
  // const handleTagChange = (_, option) => {
  //   if (!selectedTask) return;
  //   setSelectedTask(prev => ({ ...prev, tag: option }));
  // };
  //
  // const handleApplyTag = async () => {
  //   if (!selectedTask) return;
  //   const tagId = selectedTask.tag ? selectedTask.tag.id_tag : null;
  //   try {
  //     await api.post('/task/set-tags', { tasks: [selectedTask.id_task], id_tag: tagId });
  //     const updatedTasks = tasks.map((t, i) =>
  //         i === selectedTask.index ? { ...t, tag: selectedTask.tag } : t
  //     );
  //     setTasks(updatedTasks);
  //   } catch (err) {
  //     setError(err?.response?.data?.message || 'Error applying tag to task');
  //   }
  // };
  const handleRemoveTag = async () => {
    if (!selectedTask) return;
    try {
      await api.post('/task/set-tags', { tasks: [selectedTask.id_task] });
      const updatedTasks = tasks.map((t, i) =>
          i === selectedTask.index ? { ...t, tag: null } : t
      );
      setTasks(updatedTasks);
      setSelectedTask(prev => ({ ...prev, tag: null }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Error removing tag');
    }
  };

  const handleTagChange = (_, option) => {
    setTempTag(option);
  };

  const handleApplyTag = async () => {
    if (!selectedTask) return;
    const tagId = tempTag ? tempTag.id_tag : null;
    try {
      await api.post('/task/set-tags', { tasks: [selectedTask.id_task], id_tag: tagId });
      const updatedTasks = tasks.map((t, i) =>
          i === selectedTask.index ? { ...t, tag: tempTag } : t
      );
      setTasks(updatedTasks);
      setSelectedTask(prev => ({ ...prev, tag: tempTag }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Error applying tag to task');
    }
  };
  const formatDate = (date) => {
    return (
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
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
        if (typeof filter === "number") {
          return t.tag && t.tag.id_tag === filter;
        }
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
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add new goal..."
                className="task-input"
                onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            />
            <button onClick={handleAddTask} className="task-add-button">
              Add
            </button>
          </div>
          <ul className="task-list-ul">
            {filteredTasks.map((task, idx) => (
                <TaskItem
                    key={task.id_task}
                    index={idx}
                    task={task}
                        isSelected={selectedTask?.idx === idx}
                        onToggle={handleToggleTask}
                        onSelect={handleSelectTask}
                        onDelete={handleDeleteTasks}
                    />
                ))}
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
                          onChange={(e) => setEditedName(e.target.value)}
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
                      <h2 className="task-name">{selectedTask.name}</h2>
                      <button
                          onClick={() => {
                            setEditingName(true);
                            setEditedName(selectedTask.name);
                          }}
                          className="task-name-edit-button"
                          title="Edit task name"
                      >
                        🖉
                      </button>
                    </>
                )}
              </div>

              {editMode ? (
                  <div className="task-description-container">
              <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
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
                    {selectedTask.description || "Click to add description..."}
                  </p>
              )}

              {/* Display assigned tag below description */}
              <div style={{marginTop: '16px'}}>
                {selectedTask.tag ? (
                    <Chip
                        label={selectedTask.tag.name}
                        onDelete={handleRemoveTag}
                        style={{
                          backgroundColor: selectedTask.tag.color,
                          color: '#fff',
                          padding: '6px 12px',
                          fontSize: '0.95rem'
                        }}
                    />
                ) : (
                    <Chip
                        label="No Tags"
                        variant="outlined"
                        style={{
                          marginLeft: '0',
                          fontStyle: 'italic',
                          borderColor: '#f44336',
                          color: '#f44336'
                        }}
                    />
                )}
              </div>
              <div className="task-date-container">
                {/* Start Date */}
                <div className="task-date">
                  <strong className="task-date-label">Start Date</strong>
                  <DatePicker
                      selected={new Date(selectedTask.startedAt)}
                      onChange={(date) => handleDateChange(date, "startedAt")}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="HH:mm dd-MM-yyyy"
                      customInput={
                        <div className="task-datepicker">
                          {formatDate(new Date(selectedTask.startedAt))}
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
              {/* Tag selector */}
              <div className="task-tag-selector" style={{marginTop: '16px'}}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Autocomplete
                      options={tags}
                      getOptionLabel={(opt) => opt.name}
                      value={selectedTask.tag || null}
                      onChange={handleTagChange}
                      renderInput={(params) => (
                          <TextField
                              {...params}
                              label="Tag"
                              variant="outlined"
                              size="small"
                              style={{minWidth: 200}}
                          />
                      )}
                      clearOnEscape
                  />

                  <Button
                      variant="contained"
                      size="small"
                      onClick={handleApplyTag}
                      disabled={!selectedTask}
                  >
                    Apply Tag
                  </Button>
                </Stack>
              </div>
            </div>
        )}
      </div>
  )
      ;
}
