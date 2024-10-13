import React from "react";

interface CustomProgressProps {
  percentage: number;
  backgroundColor?: string; // Background color of the progress bar
  fillColor?: string; // Color of the filled portion
}

const CustomProgress: React.FC<CustomProgressProps> = ({
  percentage,
  backgroundColor = "bg-gray-200",
  fillColor = "bg-blue-500",
}) => {
  return (
    <div className={`relative w-full h-2 ${backgroundColor} rounded-lg`}>
      <div
        className={`absolute top-0 left-0 h-full rounded-lg max-w-full ${fillColor}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default CustomProgress;
