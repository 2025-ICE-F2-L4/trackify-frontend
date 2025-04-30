import React from "react";
import "./TaskItem.css";
import Tag from "./Tag";

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const TaskItem = ({
    task,
    index,
    isSelected,
    onToggle,
    onSelect,
    tagColor,
    tagName,
}) => {
    return (
        <li
            onClick={() => onSelect(index)}
            className={`task-item ${isSelected ? "selected" : ""}`}
        >
            <div className="task-header">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggle(index);
                    }}
                    className="task-checkbox"
                />
                <span
                    className={`task-name ${task.completed ? "completed" : ""}`}
                >
                    {task.name}
                </span>
            </div>

            {/* Dates */}
            <div className="task-dates">
                <div>Start: {formatDate(task.startedAt)}</div>
                {task.completed && task.finishedAt && (
                    <div>End: {formatDate(task.finishedAt)}</div>
                )}
            </div>
            {tagName && <Tag color={tagColor} text={tagName} />}
        </li>
    );
};

export default TaskItem;
