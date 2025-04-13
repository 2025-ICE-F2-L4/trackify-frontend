import React from 'react';
import Tasks from '../components/Tasks';

const TasksPage = () => {
    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px'
        }}>
            <Tasks />
        </div>
    );
};

export default TasksPage;
