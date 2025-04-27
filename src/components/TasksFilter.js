import React from "react";
import "./TasksFilter.css";

export default function TasksFilter({ filter, setFilter }) {
    return (
        <div className="tasks-filter">
            <h3 className="filter-title">Filter Tasks</h3>
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