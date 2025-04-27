import React from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import "./TasksFilter.css";

export default function TasksFilter({ filter, setFilter, searchTerm = "", setSearchTerm = () => {} }) {
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
        </div>
    );
}