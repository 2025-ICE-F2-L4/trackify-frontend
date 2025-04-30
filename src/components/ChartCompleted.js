import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import api from "../api";

export default function ChartCompleted() {
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await api.get("/chart/completed");

                const chartData = [
                    {
                        label: "Finished tasks",
                        id: 1,
                        value: response.data.unfinished_tasks,
                    },
                    {
                        label: "Unfinished tasks",
                        id: 2,
                        value: response.data.finished_tasks,
                    },
                ];

                setGraphData(chartData);
            } catch (error) {
                console.error("Error fetching graph data:", error);
            }
        };

        fetchGraphData();
    }, []);

    return (
        <div className="chart-container">
            <h2>Completed Tasks</h2>
            <PieChart series={[{ data: graphData }]} width={225} height={200} />
        </div>
    );
}
