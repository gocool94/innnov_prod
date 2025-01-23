import React, { useEffect, useState } from "react";

const BrowseIdeas = () => {
  const [ideas, setIdeas] = useState([]); // State to hold ideas
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle errors
  const [selectedIdea, setSelectedIdea] = useState(null); // State for the selected idea to show in modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  // Fetch ideas when component mounts
  useEffect(() => {
    const fetchIdeas = async () => {
      console.log("Fetching ideas..."); // Debug log
      try {
        const response = await fetch("http://127.0.0.1:8000/fetch_ideas");
        if (!response.ok) {
          throw new Error("Failed to fetch ideas");
        }
        const data = await response.json();
        console.log("Fetched ideas:", data); // Debug log
        setIdeas(data);
      } catch (error) {
        console.error("Error fetching ideas:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  const toggleModal = () => {
    console.log("Toggling modal..."); // Debug log
    setIsModalOpen(!isModalOpen);
  };

  const viewIdea = (idea) => {
    console.log("View idea clicked:", idea); // Debug log
    setSelectedIdea(idea);
    toggleModal();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Browse Ideas</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading ideas...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : ideas.length === 0 ? (
          <p className="text-center text-gray-600">No ideas available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div key={idea._id} className="border p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800">{idea.ideaTitle}</h3>
                <p className="text-gray-600">{idea.ideaDescription}</p>
                <button
                  className="mt-4 text-blue-500 hover:underline"
                  onClick={() => viewIdea(idea)} // Pass the view idea handler
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render modal if open */}
      {isModalOpen && selectedIdea && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedIdea.ideaTitle}</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="ideaDescription" className="text-gray-600">Description</label>
                <textarea
                  id="ideaDescription"
                  className="w-full h-32 p-2 border border-gray-300 rounded"
                  value={selectedIdea.ideaDescription}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label htmlFor="valueAdd" className="text-gray-600">Value Add</label>
                <textarea
                  id="valueAdd"
                  className="w-full h-32 p-2 border border-gray-300 rounded"
                  value={selectedIdea.valueAdd}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label htmlFor="complexity" className="text-gray-600">Complexity</label>
                <input
                  id="complexity"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={selectedIdea.complexity}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label htmlFor="contributors" className="text-gray-600">Contributors</label>
                <input
                  id="contributors"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={Array.isArray(selectedIdea.contributors) ? selectedIdea.contributors.join(", ") : selectedIdea.contributors}
                  readOnly
                />
              </div>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={toggleModal}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseIdeas;
