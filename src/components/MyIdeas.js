import React, { useEffect, useState } from "react";
import IdeaDetailsModal from "./IdeaDetailsModal";

const MyIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [totalBeans, setTotalBeans] = useState(0); // State for total beans earned
  const [selectedIdea, setSelectedIdea] = useState(null); // State for selected idea
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  // Fetch ideas when component mounts
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/fetch_ideas");
        if (!response.ok) {
          throw new Error("Failed to fetch ideas");
        }
        const data = await response.json();
        setIdeas(data);
        
        // Calculate total beans earned
        const beansEarned = data.reduce((total, idea) => {
          return total + (idea.beansEarned || 0); // Assuming beansEarned is a property in idea
        }, 0);
        setTotalBeans(beansEarned);
        
      } catch (error) {
        console.error("Error fetching ideas:", error);
      }
    };

    fetchIdeas();
  }, []);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleViewClick = (idea) => {
    setSelectedIdea(idea);
    toggleModal();
  };

  return (
    <div className="mt-4 mx-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Ideas</h2>
        
        <div className="flex justify-between items-center mb-4">
          <div className="p-4 border border-yellow-400 bg-yellow-100 rounded-lg">
            <span className="text-lg font-semibold">
              Beans earned: <span className="font-bold">{totalBeans}</span>
            </span>
          </div>
        </div>

        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 border-b text-left">Idea Title</th>
              <th className="py-2 border-b text-left">Idea Description</th>
              <th className="py-2 border-b text-left">Date Submitted</th>
              <th className="py-2 border-b text-left">Status</th>
              <th className="py-2 border-b text-left">Beans Earned</th>
              <th className="py-2 border-b text-left">Links</th>
            </tr>
          </thead>
          <tbody>
            {ideas.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">No ideas found.</td>
              </tr>
            ) : (
              ideas.map((idea) => (
                <tr key={idea._id} className="hover:bg-gray-100 transition-colors">
                  <td className="border-b py-2 px-4">{idea.ideaTitle}</td>
                  <td className="border-b py-2 px-4">{idea.ideaDescription}</td>
                  <td className="border-b py-2 px-4">{idea.dateSubmitted}</td>
                  <td className="border-b py-2 px-4">
                    <span className={`px-2 py-1 rounded ${getStatusClass(idea.status)}`}>
                      {idea.status}
                    </span>
                  </td>
                  <td className="border-b py-2 px-4">{idea.beansEarned || "N/A"}</td>
                  <td className="border-b py-2 px-4">
                    <button className="text-blue-500 hover:underline" onClick={() => handleViewClick(idea)}>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    
    {isModalOpen && (
      <IdeaDetailsModal idea={selectedIdea} toggleModal={toggleModal} />
    )}
  </div>
  );
};

// Helper function to get the status class for styling
const getStatusClass = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-green-200 text-green-700";
    case "Pending":
      return "bg-yellow-200 text-yellow-700";
    case "Idea Tried":
      return "bg-red-200 text-red-700";
    default:
      return "";
  }
};

export default MyIdeas;
