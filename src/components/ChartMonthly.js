import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { axisClasses } from "@mui/x-charts";
import api from "../api";

const ChartMonthly = () => {
    const [chartLabels, setChartLabels] = useState([]);
    const [chartValues, setChartValues] = useState([]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await api.get("/chart/monthly");

                setChartValues(response.data.values);

                const formattedLabels = response.data.labels.map((dateStr) => {
                    const date = new Date(dateStr);
                    return date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                    });
                });

                setChartLabels(formattedLabels);
            } catch (error) {
                console.error("Error fetching graph data:", error);
            }
        };

        fetchChartData();
    }, []);

    return (
        <LineChart
            xAxis={[{ data: chartLabels, scaleType: "band" }]}
            yAxis={[
                {
                    label: "Completed Tasks",
                },
            ]}
            series={[
                {
                    data: chartValues,
                    label: "Completed Tasks",
                },
            ]}
            height={300}
            width={1200}
        />
    );
};

export default ChartMonthly;
