import React from 'react';

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const TaskItem = ({ todo, index, isSelected, onToggle, onSelect}) => {
    return (
        <li
            onClick={() => onSelect(index)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                margin: '15px 0',
                fontSize: '22px',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#f0f0f0' : 'transparent',
                transition: 'background-color 0.2s',
            }}
        >
            <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggle(index);
                    }}
                    style={{
                        width: '24px',
                        height: '24px',
                        marginRight: '15px',
                        cursor: 'pointer',
                        accentColor: '#4CAF50',
                        transform: 'scale(1.2)',
                    }}
                />
                <span
                    style={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#888' : '#333',
                        flexGrow: 1,
                    }}
                >
                    {todo.name}
                </span>
            </div>

            {/* Daty */}
            <div style={{fontSize: '16px', color: '#666', marginLeft: '39px'}}>
                <div>Start: {formatDate(todo.startedAt)}</div>
                {todo.completed && todo.completedAt && (
                    <div>Koniec: {formatDate(todo.completedAt)}</div>
                )}
            </div>

        </li>

    );
};

export default TaskItem;
