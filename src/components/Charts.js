import React from "react";
import "./Charts.css";
import ChartWeekly from "./ChartWeekly";
import ChartMonthly from "./ChartMonthly";

const Charts = () => {
    return (
        <>
            <div className="charts-container">
                <div className="chart-container">
                    <h2>Weekly Completed Tasks</h2>
                    <ChartWeekly />
                </div>
                <div className="chart-container">
                    <h2>Monthly Completed Tasks</h2>
                    <ChartMonthly />
                </div>
            </div>
        </>
    );
};

export default Charts;
