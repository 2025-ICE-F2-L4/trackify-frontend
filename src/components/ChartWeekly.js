import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import api from "../api";

const ChartWeekly = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await api.get("/chart/weekly");
                setChartData(response.data);
            } catch (error) {
                console.error("Error fetching graph data:", error);
            }
        };

        fetchChartData();
    }, []);

    const chartSetting = {
        yAxis: [
            {
                label: "Completed Tasks",
            },
        ],
        series: [
            {
                dataKey: "completed_tasks",
                label: "Completed Tasks",
            },
        ],
        height: 300,
        width: 700,
        sx: {
            [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
                transform: "translateX(-10px)",
            },
        },
    };

    return (
        <BarChart
            dataset={chartData}
            xAxis={[
                {
                    scaleType: "band",
                    dataKey: "day_name",
                    tickPlacement: "extremities",
                    tickLabelPlacement: "middle",
                },
            ]}
            {...chartSetting}
        />
    );
};

export default ChartWeekly;
