import React from "react";

const IdeaDetailsModal = ({ idea, toggleModal }) => {
  if (!idea) return null;

  // Function to determine the status step
  const getStatusStep = (status) => {
    switch (status) {
      case "Submitted":
        return 1;
      case "Pending approval":
        return 2;
      case "Approved/rejected":
        return 3;
      case "Done":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep(idea.status || "Submitted");

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-screen overflow-y-auto shadow-lg">
        
        {/* Tracking Status Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className={`${currentStep >= 1 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>Submitted</span>
            <span className={`${currentStep >= 2 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>Pending approval</span>
            <span className={`${currentStep >= 3 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>Approved/Rejected</span>
            <span className={`${currentStep === 4 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>Done</span>
          </div>
          <div className="h-2 w-full bg-gray-300 rounded">
            <div
              className={`h-full bg-green-600 rounded transition-all duration-500`}
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">{idea.ideaTitle}</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700 font-semibold">Name:</p>
            <p className="text-gray-900 mb-4">{idea.name || "N/A"}</p>

            <p className="text-gray-700 font-semibold">Email:</p>
            <p className="text-gray-900 mb-4">{idea.email || "N/A"}</p>

            <p className="text-gray-700 font-semibold">Idea Title:</p>
            <p className="text-gray-900 mb-4">{idea.ideaTitle || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-700 font-semibold">Idea Category:</p>
            <p className="text-gray-900 mb-4">{idea.ideaCategory?.join(", ") || "N/A"}</p>

            <p className="text-gray-700 font-semibold">Idea Description:</p>
            <p className="text-gray-900 mb-4">{idea.ideaDescription || "N/A"}</p>

            <p className="text-gray-700 font-semibold">Value Add:</p>
            <p className="text-gray-900 mb-4">{idea.valueAdd || "N/A"}</p>
          </div>
        </div>

        {/* Google Link */}
        <div className="mt-4">
          <p className="text-gray-700 font-semibold">Google Link:</p>
          {idea.googleLink ? (
            <a href={idea.googleLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Open Link
            </a>
          ) : (
            <p className="text-gray-900">N/A</p>
          )}
        </div>

        {/* ❌ Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={toggleModal}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailsModal;
