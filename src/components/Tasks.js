import React, {useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TaskItem from './TaskItem';
import api from "../api";

export default function Tasks() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => { fetchTasks(); }, [])

    const fetchTasks = () => {
        setIsLoading(true);
        api.get('/task')
            .then((response) => {
                if (response.data && Array.isArray(response.data.tasks)) {
                    setTodos(response.data.tasks);
                } else {
                    setTodos([]);
                }
            })
            .catch((error) =>
                setError(error?.response?.data?.message || 'Failed to fetch tasks'))
            .finally(() => setIsLoading(false));
    };
    const handleAddTodo = async () => {
        if (newTodo.trim() !== '') {
            const now = new Date();
            const defaultEndDate = new Date();
            defaultEndDate.setDate(now.getDate() + 7);

            const payload = { name: newTodo };

            try {
                const response = await api.post('/task', payload);
                const createdTask = response.data;
                setTodos([...todos, createdTask]);
                setNewTodo('');
                fetchTasks()
            } catch (error) {
                setError(error?.response?.data?.message || 'Error adding task')
            }
        }
    };

    const handleToggleTodo = (index) => {
        const updatedTodos = todos.map((todo, i) =>
            i === index ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
    };

    const handleSelectTodo = (index) => {
        setSelectedTodo({ ...todos[index], index });
        setEditedDescription(todos[index].description);
        setEditMode(false);
    };

    const handleCloseDetails = () => {
        setSelectedTodo(null);
        setEditMode(false);
    };

    const handleCompleteTask = () => {
        if (selectedTodo) {
            handleToggleTodo(selectedTodo.index);
            setSelectedTodo(null);
        }
    };

    const handleSaveDescription = () => {
        const updatedTodos = [...todos];
        updatedTodos[selectedTodo.index].description = editedDescription;
        setTodos(updatedTodos);
        setSelectedTodo({ ...selectedTodo, description: editedDescription });
        setEditMode(false);
    };

    const handleDateChange = (date, field) => {
        const updatedTodos = [...todos];
        updatedTodos[selectedTodo.index][field] = date;
        setTodos(updatedTodos);
        setSelectedTodo({ ...selectedTodo, [field]: date });
    };

    const handleDeleteTasks = async (index) => {
        const taskToDelete = todos[index];

        try {
            console.log("Deleting task with id:", taskToDelete.id_task);
            await api.delete(`/task/${taskToDelete.id_task}`);
            const updatedTodos = todos.filter((_, i) => i !== index);
            setTodos(updatedTodos);

            if (selectedTodo?.index === index) {
                setSelectedTodo(null);
            }
        } catch (error) {
            setError(error?.response?.data?.message || 'Error deleting task');
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
            {/* Lewa strona - lista tasków */}
            <div
                style={{
                    width: selectedTodo ? '50%' : '100%',
                    padding: '40px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    transition: 'width 0.3s ease',
                }}
            >
                <h2 style={{fontSize: '44px', marginBottom: '30px', color: '#333', fontWeight: '600'}}>Today's
                    Goals</h2>

                {isLoading && <p>Loading Goals...</p>}
                {error && <p style={{color: 'red'}}>{error}</p>}

                <div style={{display: 'flex', marginBottom: '30px', alignItems: 'center'}}>
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
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
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                    />
                    <button
                        onClick={handleAddTodo}
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

                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {todos.length === 0 ? (
                        <li style={{fontSize: '22px', color: '#999'}}>No goals to display</li>
                    ) : (
                        todos.map((todo, index) => (
                            <TaskItem
                                key={todo.id || index}
                                index={index}
                                todo={todo}
                                isSelected={selectedTodo?.index === index}
                                onToggle={handleToggleTodo}
                                onSelect={handleSelectTodo}
                                onDelete={handleDeleteTasks}
                            />
                        ))
                    )}
                </ul>

            </div>

            {/* Prawa strona - szczegóły zadania */}
            {selectedTodo && (
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
                    <h2 style={{ fontSize: '32px', marginBottom: '30px', color: '#333', fontWeight: '500' }}>{selectedTodo.name}</h2>

                    {editMode ? (
                        <div style={{ marginBottom: '40px' }}>
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                placeholder="Click to edit description"
                                style={{ width: '100%', minHeight: '150px', padding: '15px', fontSize: '20px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', resize: 'vertical' }}
                            />
                            <button
                                onClick={handleSaveDescription}
                                style={{ padding: '12px 24px', fontSize: '20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' }}
                            >
                                Save Description
                            </button>
                        </div>
                    ) : (
                        <p
                            onClick={() => setEditMode(true)}
                            style={{ fontSize: '24px', lineHeight: '1.6', marginBottom: '40px', color: selectedTodo.description ? '#555' : '#aaa', cursor: 'pointer', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px', fontStyle: selectedTodo.description ? 'normal' : 'italic' }}
                        >
                            {selectedTodo.description || 'Click to add description...'}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '40px', marginBottom: '40px', flexWrap: 'wrap' }}>
                        <div style={{ minWidth: '300px' }}>
                            <strong style={{ display: 'block', fontSize: '24px', marginBottom: '15px' }}>Start Date</strong>
                            <DatePicker
                                selected={new Date(selectedTodo.startedAt)}
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
                                        {formatDate(new Date(selectedTodo.startedAt))}
                                    </div>
                                }
                            />

                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '20px', marginTop: '40px'}}>
                        <button
                            onClick={handleCompleteTask}
                            style={{
                                padding: '15px 30px',
                                fontSize: '22px',
                                backgroundColor: '#4CAF50',
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
                            ✓ Complete Goal
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
                            onClick={() => handleDeleteTasks(selectedTodo.index)}
                            style={{
                                padding: '15px 30px',
                                fontSize: '22px',
                                backgroundColor: '#ff9800',
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
                            🗑 Delete
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}
