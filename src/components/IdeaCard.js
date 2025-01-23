import React from "react";

const IdeaCard = ({ ideaTitle, ideaDescription, valueAdd, complexity, contributors }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800">{ideaTitle}</h3>
      <p className="text-gray-600 mt-2">{ideaDescription}</p>

      {/* Additional information */}
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <strong>Value Add:</strong> {valueAdd}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Complexity:</strong> {complexity}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Contributors:</strong> {contributors}
        </p>
      </div>

      <button className="mt-4 text-blue-500 hover:underline">
        View Details &gt;
      </button>
    </div>
  );
};

export default IdeaCard;
