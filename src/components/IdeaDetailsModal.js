import React from "react";

const IdeaDetailsModal = ({ idea, toggleModal }) => {
  if (!idea) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
      onClick={toggleModal}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto"
        style={{ width: "75vw", maxWidth: "1200px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 text-green-700">Idea Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-gray-700 font-semibold">Submitter Name</label>
          <p className="px-3 py-2 border rounded-lg">{idea.name}</p>

          <label className="text-gray-700 font-semibold">Submitter Email</label>
          <p className="px-3 py-2 border rounded-lg">{idea.email}</p>

          <label className="text-gray-700 font-semibold">Idea Title</label>
          <p className="px-3 py-2 border rounded-lg">{idea.ideaTitle}</p>

          <label className="text-gray-700 font-semibold">
              Idea Description
            </label>
            <textarea
              name="ideaDescription"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Describe your idea here"
              rows="4"
              value={idea.ideaDescription}
            ></textarea>

            <label className="text-gray-700 font-semibold">
              Value Add in Words
            </label>
            <textarea
              name="valueAddWords"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Explain the value add"
              rows="4"
              value={idea.valueAddWords}
            ></textarea>

          <label className="text-gray-700 font-semibold">
              Google Link to Resource
            </label>
            <input
              type="url"
              name="googleLink"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Google link"
              value={idea.googleLink}
              
            />
        </div>
        <button
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
          onClick={toggleModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default IdeaDetailsModal;