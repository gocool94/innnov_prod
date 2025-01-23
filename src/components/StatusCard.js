// StatusCard.js
import React from "react";

const StatusCard = ({ title, count, bgColor }) => {
  return (
    <div className={`p-4 rounded-lg shadow-lg ${bgColor}`}>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
    </div>
  );
};

export default StatusCard;
