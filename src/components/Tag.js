import React from "react";
import "./Tag.css";

const Tag = ({ text, color }) => {
    return (
        <span className={`tag`} style={{ backgroundColor: `${color}` }}>
            {text}
        </span>
    );
};

export default Tag;
