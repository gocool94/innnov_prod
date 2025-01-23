// TopSubmittersList.js
import React from "react";

const TopSubmittersList = () => {
  // Sample data for top submitters
  const submitters = [
    { id: 1, name: "Alice Johnson", score: 120 },
    { id: 2, name: "Bob Smith", score: 115 },
    { id: 3, name: "Cathy Brown", score: 110 },
    { id: 4, name: "David Wilson", score: 105 },
    { id: 5, name: "Eve Davis", score: 100 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Submitters</h3>
      <ul>
        {submitters.map((submitter) => (
          <li key={submitter.id} className="flex justify-between border-b py-2">
            <span>{submitter.name}</span>
            <span className="font-bold text-blue-500">{submitter.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSubmittersList;
