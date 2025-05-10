import React from "react";
import "./TaskItem.css";
import {Chip} from "@mui/material";

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

const TaskItem = ({ task, index, isSelected, onToggle, onSelect }) => {
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
        <span className={`task-name ${task.completed ? "completed" : ""}`}>
          {task.name}
        </span>
        {/* Display tag chip if present */}
        {task.tag ? (
            <Chip
                label={task.tag.name}
                size="small"
                style={{
                  marginLeft: '8px',
                  backgroundColor: task.tag.color,
                  color: '#fff',
                  height: '24px',
                  fontSize: '0.75rem'
                }}
            />
        ) : null}
      </div>

      {/* Dates */}
      <div className="task-dates">
        <div>Start: {formatDate(task.startedAt)}</div>
        {task.completed && task.finishedAt && (
          <div>End: {formatDate(task.finishedAt)}</div>
        )}
      </div>
    </li>
  );
};

export default TaskItem;
