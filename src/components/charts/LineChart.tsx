import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartProps {
  title: string;
  data: DataPoint[];
  unit: string;
  highThreshold?: number;
  lowThreshold?: number;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  unit,
  highThreshold,
  lowThreshold,
  color = 'rgb(59, 130, 246)',
}) => {
  // 按日期排序
  const sortedData = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // 格式化日期為 MM/DD 格式
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const labels = sortedData.map((item) => formatDate(item.date));
  const values = sortedData.map((item) => item.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: color,
        backgroundColor: `${color}33`, // 添加透明度
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} ${unit}`;
          }
        }
      },
    },
    scales: {
      y: {
        min: lowThreshold ? Math.min(lowThreshold * 0.9, Math.min(...values)) : undefined,
        max: highThreshold ? Math.max(highThreshold * 1.1, Math.max(...values)) : undefined,
        ticks: {
          callback: function(value) {
            return `${Math.round(value as number)} ${unit}`;
          },
          font: {
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;