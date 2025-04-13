import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TaskItem from './TaskItem';
import api from "../api";

export default function Tasks() {
    const [tasks, settasks] = useState([]);
    const [newTask, setnewTask] = useState('');
    const [selectedTask, setselectedTask] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        setIsLoading(true);
        api.get('/task')
            .then((response) => {
                if (response.data && Array.isArray(response.data.tasks)) {
                    settasks(response.data.tasks);
                } else {
                    settasks([]);
                }
            })
            .catch((error) =>
                setError(error?.response?.data?.message || 'Failed to fetch tasks'))
            .finally(() => setIsLoading(false));
    };

    const handleAddTask = async () => {
        if (newTask.trim() !== '') {
            const payload = { name: newTask };
            try {
                const response = await api.post('/task', payload);
                const createdTask = response.data;
                settasks([...tasks, createdTask]);
                setnewTask('');
                fetchTasks();
            } catch (error) {
                setError(error?.response?.data?.message || 'Error adding task');
            }
        }
    };

    const handleToggleTask = (index) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        settasks(updatedTasks);
        // If the currently selected task is the one that was toggled, update its state too.
        if (selectedTask && selectedTask.index === index) {
            setselectedTask({ ...updatedTasks[index], index });
        }
    };

    const handleSelectTask = (index) => {
        setselectedTask({ ...tasks[index], index });
        setEditedDescription(tasks[index].description);
        setEditMode(false);
        setConfirmDelete(false);
    };

    const handleCloseDetails = () => {
        setselectedTask(null);
        setEditMode(false);
        setConfirmDelete(false);
    };

    const handleCompleteTask = () => {
        if (selectedTask) {
            handleToggleTask(selectedTask.index);
            const updated = {
                ...selectedTask,
                completed: !selectedTask.completed,
            };
            setselectedTask(updated);
        }
    };

    const handleSaveDescription = () => {
        const updatedTasks = [...tasks];
        updatedTasks[selectedTask.index].description = editedDescription;
        settasks(updatedTasks);
        setselectedTask({ ...selectedTask, description: editedDescription });
        setEditMode(false);
    };

    const handleDateChange = (date, field) => {
        const updatedTasks = [...tasks];
        updatedTasks[selectedTask.index][field] = date;
        settasks(updatedTasks);
        setselectedTask({ ...selectedTask, [field]: date });
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
            settasks(updatedTasks);
            if (selectedTask?.index === index) {
                setselectedTask(null);
            }
        } catch (error) {
            setError(error?.response?.data?.message || 'Error deleting task');
        }
    };

    // New function to duplicate the selected task.
    const handleDuplicateTask = async () => {
        if (selectedTask) {
            // Remove any existing " (number)" from the end of the name
            const baseName = selectedTask.name.replace(/ \(\d+\)$/, '');
            // Count how many tasks (including any previous duplicates) share the same base name
            const duplicates = tasks.filter(task => {
                const taskBaseName = task.name.replace(/ \(\d+\)$/, '');
                return taskBaseName === baseName;
            });
            // Next duplicate number: if the original is present, the first duplicate gets (1)
            const duplicateCount = duplicates.length;
            const newName = `${baseName} (${duplicateCount})`;

            const payload = { name: newName };
            try {
                const response = await api.post('/task', payload);
                const createdTask = response.data;
                settasks([...tasks, createdTask]);
                fetchTasks();
            } catch (error) {
                setError(error?.response?.data?.message || 'Error duplicating task');
            }
        }
    };

    const formatDate = (date) => {
        return (
            date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
            ' ' +
            date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })
        );
    };

    return (
        <div className="container" style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5' }}>
            {/* Left side - task list */}
            <div
                style={{
                    width: selectedTask ? '50%' : '100%',
                    padding: '40px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    transition: 'width 0.3s ease',
                }}
            >
                <h2 style={{ fontSize: '44px', marginBottom: '30px', color: '#333', fontWeight: '600' }}>Today's Goals</h2>
                {isLoading && <p>Loading Goals...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ display: 'flex', marginBottom: '30px', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setnewTask(e.target.value)}
                        placeholder="Add new goal..."
                        style={{
                            flex: 1,
                            padding: '18px 20px',
                            marginRight: '15px',
                            fontSize: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            outline: 'none'
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    <button
                        onClick={handleAddTask}
                        style={{
                            padding: '16px 25px',
                            fontSize: '20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s',
                        }}
                    >
                        Add
                    </button>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {tasks.length === 0 ? (
                        <li style={{ fontSize: '22px', color: '#999' }}>No goals to display</li>
                    ) : (
                        tasks.map((task, index) => (
                            <TaskItem
                                key={task.id || index}
                                index={index}
                                task={task}
                                isSelected={selectedTask?.index === index}
                                onToggle={handleToggleTask}
                                onSelect={handleSelectTask}
                                onDelete={handleDeleteTasks}
                            />
                        ))
                    )}
                </ul>
            </div>
            {/* Right side - task details */}
            {selectedTask && (
                <div
                    style={{
                        width: '50%',
                        padding: '40px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        position: 'relative',
                        overflowY: 'auto',
                    }}
                >
                    <h1 style={{ fontSize: '40px', marginBottom: '30px', color: '#333', fontWeight: '600' }}>Goal Description</h1>
                    <h2 style={{ fontSize: '32px', marginBottom: '30px', color: '#333', fontWeight: '500' }}>{selectedTask.name}</h2>
                    {editMode ? (
                        <div style={{ marginBottom: '40px' }}>
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                placeholder="Click to edit description"
                                style={{
                                    width: '100%',
                                    minHeight: '150px',
                                    padding: '15px',
                                    fontSize: '20px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                            <button
                                onClick={handleSaveDescription}
                                style={{
                                    padding: '12px 24px',
                                    fontSize: '20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    marginTop: '15px'
                                }}
                            >
                                Save Description
                            </button>
                        </div>
                    ) : (
                        <p
                            onClick={() => setEditMode(true)}
                            style={{
                                fontSize: '24px',
                                lineHeight: '1.6',
                                marginBottom: '40px',
                                color: selectedTask.description ? '#555' : '#aaa',
                                cursor: 'pointer',
                                padding: '15px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '6px',
                                fontStyle: selectedTask.description ? 'normal' : 'italic'
                            }}
                        >
                            {selectedTask.description || 'Click to add description...'}
                        </p>
                    )}
                    <div style={{ display: 'flex', gap: '40px', marginBottom: '40px', flexWrap: 'wrap' }}>
                        <div style={{ minWidth: '300px' }}>
                            <strong style={{ display: 'block', fontSize: '24px', marginBottom: '15px' }}>Start Date</strong>
                            <DatePicker
                                selected={new Date(selectedTask.startedAt)}
                                onChange={(date) => handleDateChange(date, 'startedAt')}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="HH:mm dd-MM-yyyy"
                                customInput={
                                    <div style={{
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        backgroundColor: '#f9f9f9'
                                    }}>
                                        {formatDate(new Date(selectedTask.startedAt))}
                                    </div>
                                }
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '40px', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleCompleteTask}
                            style={{
                                padding: '15px 30px',
                                fontSize: '22px',
                                backgroundColor: selectedTask.completed ? 'purple' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            {selectedTask.completed ? '✗ Mark as Uncompleted' : '✓ Complete Goal'}
                        </button>
                        <button
                            onClick={handleCloseDetails}
                            style={{
                                padding: '15px 30px',
                                fontSize: '22px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            ✕ Close
                        </button>
                        <button
                            onClick={() => {
                                if (!confirmDelete) {
                                    setConfirmDelete(true);
                                } else {
                                    handleDeleteTasks(selectedTask.index);
                                    setConfirmDelete(false); // Reset the confirmation after deletion
                                }
                            }}
                            style={{
                                padding: '15px 30px',
                                fontSize: '22px',
                                backgroundColor: confirmDelete ? 'red' : '#ff9800', // Switch to red in confirmation mode
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            {confirmDelete ? 'Are you sure?' : '🗑 Delete'}
                        </button>
                        {/* New Duplicate Task Button */}
                        <button
                            onClick={handleDuplicateTask}
                            style={{
                                padding: '15px 30px',
                                fontSize: '22px',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            Duplicate Task
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
