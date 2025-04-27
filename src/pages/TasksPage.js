import React, { useState } from "react";
import TasksFilter from "../components/TasksFilter";
import Tasks from "../components/Tasks";
import "./TasksPage.css";

const TasksPage = () => {
    const [filter, setFilter] = useState("all");

    return (
        <div className="tasks-page-container">
            <TasksFilter filter={filter} setFilter={setFilter} />
            <Tasks filter={filter} />
        </div>
    );
};

export default TasksPage;