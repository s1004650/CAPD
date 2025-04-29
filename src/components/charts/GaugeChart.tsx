import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  title: string;
  unit: string;
  thresholds?: {
    low: number;
    high: number;
  };
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min,
  max,
  title,
  unit,
  thresholds,
}) => {
  // 確保值在範圍內
  const safeValue = Math.max(min, Math.min(max, value));
  
  // 百分比計算
  const percentage = ((safeValue - min) / (max - min)) * 100;
  
  // 根據閾值決定顏色
  const getColor = () => {
    if (!thresholds) return '#3B82F6'; // 默認藍色
    
    if (safeValue < thresholds.low) return '#F87171'; // 低於下限: 紅色
    if (safeValue > thresholds.high) return '#F87171'; // 高於上限: 紅色
    return '#10B981'; // 在正常範圍: 綠色
  };

  const color = getColor();
  
  // 圖表數據
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, '#E5E7EB'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  // 圖表選項
  const options = {
    cutout: '80%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm text-center h-60">
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      <div className="relative h-40">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold" style={{ color }}>
            {safeValue}
          </span>
          <span className="text-gray-500 text-sm">{unit}</span>
        </div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default GaugeChart;