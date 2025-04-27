import React, { useState } from "react";
import TasksFilter from "../components/TasksFilter";
import Tasks from "../components/Tasks";
import "./TasksPage.css";

const TasksPage = () => {
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="tasks-page-container">
            <TasksFilter
                filter={filter}
                setFilter={setFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <Tasks filter={filter} searchTerm={searchTerm} />
        </div>
    );
};

export default TasksPage;