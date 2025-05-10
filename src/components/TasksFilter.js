import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import api from "../api"; // Adjust path as needed
import "./TasksFilter.css";

// Props:
// filter: current filter type (all, completed, uncompleted or tag id)
// setFilter: function to update filter
// searchTerm, setSearchTerm: as before
export default function TasksFilter({ filter, setFilter, searchTerm = "", setSearchTerm = () => {} }) {
    const [tags, setTags] = useState([]);
    const [creating, setCreating] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("#ffffff");

    // Load tags from API
    const loadTags = async () => {
        try {
            const response = await api.get('/tag');
            setTags(response.data.tags);
        } catch (err) {
            console.error('Failed to fetch tags', err);
        }
    };

    useEffect(() => {
        loadTags();
    }, []);

    const handleSaveTag = async () => {
        if (!newTagName.trim()) return;
        try {
            await api.post('/tag', { name: newTagName.trim(), color: newTagColor });
            setNewTagName("");
            setNewTagColor("#ffffff");
            setCreating(false);
            loadTags();
        } catch (err) {
            console.error('Failed to create tag', err);
        }
    };

    const handleCancel = () => {
        setCreating(false);
        setNewTagName("");
        setNewTagColor("#ffffff");
    };

    return (
        <div className="tasks-filter">
            <h3 className="filter-title">Filter Goals</h3>
            <TextField
                className="filter-search"
                placeholder="Search by name..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <div className="filter-buttons">
                <button
                    className={filter === "all" ? "active" : ""}
                    onClick={() => setFilter("all")}
                >
                    All
                </button>
                <button
                    className={filter === "completed" ? "active" : ""}
                    onClick={() => setFilter("completed")}
                >
                    Completed
                </button>
                <button
                    className={filter === "uncompleted" ? "active" : ""}
                    onClick={() => setFilter("uncompleted")}
                >
                    Uncompleted
                </button>
            </div>
            <h4 className="filter-subtitle">Tags</h4>
            <div className="filter-tags">
                {tags.map(tag => (
                    <button
                        key={tag.id}
                        className={filter === tag.id ? "active tag-button" : "tag-button"}
                        onClick={() => setFilter(tag.id)}
                        style={{ backgroundColor: tag.color }}
                    >
                        {tag.name}
                    </button>
                ))}
                {creating ? (
                    <div className="tag-creation-inline">
                        <TextField
                            size="small"
                            placeholder="Tag name"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                        />
                        <input
                            type="color"
                            className="tag-color-picker"
                            value={newTagColor}
                            onChange={(e) => setNewTagColor(e.target.value)}
                        />
                        <button onClick={handleSaveTag}>
                            <CheckIcon fontSize="small" />
                        </button>
                        <button onClick={handleCancel}>
                            <CloseIcon fontSize="small" />
                        </button>
                    </div>
                ) : (
                    <button className="tag-add-button" onClick={() => setCreating(true)}>
                        <AddIcon fontSize="small" />
                    </button>
                )}
            </div>
        </div>
    );
}
