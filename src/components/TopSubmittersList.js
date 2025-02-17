import React, { useEffect, useState } from "react";

const TopSubmittersList = () => {
  const [submitters, setSubmitters] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopSubmitters = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/top-submitters");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to fetch top submitters");
        }

        if (!Array.isArray(data.submitters)) {
          throw new Error("Unexpected API response format");
        }

        setSubmitters(data.submitters);
      } catch (err) {
        console.error("Failed to fetch top submitters:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSubmitters();
  }, []);

  if (loading) return <p>Loading top submitters...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Submitters</h3>
      <ul>
        {submitters.length > 0 ? (
          submitters.map((submitter, index) => (
            <li key={index} className="flex justify-between border-b py-2">
              <span>{submitter.name}</span>
              <span className="font-bold text-blue-500">{submitter.beans}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No submitters found.</p>
        )}
      </ul>
    </div>
  );
};

export default TopSubmittersList;
