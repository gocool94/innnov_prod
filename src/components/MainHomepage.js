import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusCard from "./StatusCard";
import TopSubmittersList from "./TopSubmittersList";
import Header from "./Header"; // Import Header component
import innovation from "./innovation.png";

const MainHomepage = ({ userProfile, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const logout = () => {
    console.log("Logging out...");
    setIsLoggedIn(false);
    localStorage.removeItem("user"); // Clear user session from localStorage
    navigate("/"); // Redirect to login page
  };

  const handleNavigation = () => {
    console.log("Navigating to innovation page...");
    navigate("/innovation");
  };

  const handleModalClose = () => {
    setSelectedIdea(null);
    setIsModalOpen(false);
  };

  const handleModalOpen = (idea) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/update-idea/${selectedIdea.idea_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedIdea), // Ensure `selectedIdea` has all required fields
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Idea updated successfully:", data);
  
        // Optionally refresh the ideas list
        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) =>
            idea.idea_id === selectedIdea.idea_id ? { ...selectedIdea } : idea
          )
        );
  
        handleModalClose();
      } else {
        const errorData = await response.json();
        console.error("Failed to update the idea:", errorData.detail || errorData);
      }
    } catch (error) {
      console.error("Error updating idea:", error);
    }
  };
  

  useEffect(() => {
    console.log("User profile:", userProfile); // Debugging userProfile

    const fetchReviewIdeas = async () => {
      if (userProfile?.review_ideas && userProfile?.review_ideas.length > 0) {
        try {
          console.log(
            "Fetching review ideas for IDs:",
            userProfile?.review_ideas
          );
          const response = await fetch(
            `http://localhost:8000/api/review-ideas?ids=${userProfile?.review_ideas.join(
              ","
            )}`
          );

          const data = await response.json();
          console.log("API response:", data); // Debugging API response

          if (response.ok) {
            setIdeas(data.ideas || []); // Ensure 'data.ideas' is valid
            console.log("Review ideas set in state:", data.ideas);
          } else {
            console.error("Error fetching review ideas:", data.detail);
            setIdeas([]);
          }
        } catch (error) {
          console.error("Error fetching review ideas:", error);
          setIdeas([]);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No review ideas to fetch.");
        setLoading(false);
      }
    };

    fetchReviewIdeas();
  }, [userProfile]);

  if (!userProfile) {
    console.log("User profile not available yet.");
    return <p>Loading...</p>;
  }

  

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Welcome, {userProfile?.email || "Guest"}! Here is your Idea Status:
        </h2>
        <div className="grid grid-cols-5 gap-4">
          <StatusCard
            title="Beans Earned"
            count={userProfile?.beans || 0}
            bgColor="bg-yellow-200"
          />
          <StatusCard
            title="Ideas Shared"
            count={userProfile?.ideasShared || 0}
            bgColor="bg-blue-200"
          />
          <StatusCard
            title="Ideas Accepted"
            count={userProfile?.ideasAccepted || 0}
            bgColor="bg-green-200"
          />
          <StatusCard
            title="Review Pending"
            count={userProfile?.reviewPending || 0}
            bgColor="bg-orange-200"
          />
          <StatusCard
            title="Ideas Tried"
            count={userProfile?.ideasTried || 0}
            bgColor="bg-red-200"
          />
        </div>
      </div>

      {userProfile?.is_reviewer && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-yellow-100 p-4 rounded-lg shadow-lg mt-4">
            <h3 className="text-lg font-semibold text-gray-800">
              You are a reviewer!
            </h3>
            {loading ? (
              <p>Loading review ideas...</p>
            ) : (
              <div className="overflow-x-auto mt-4">
                {userProfile?.review_ideas.length === 0 ? (
                  <p>No ideas under review at the moment.</p>
                ) : (
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Description</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ideas.map((idea) => (
                        <tr key={idea.idea_id} className="border-b">
                          <td className="py-2 px-4">{idea.ideaTitle}</td>
                          <td className="py-2 px-4">{idea.ideaDescription}</td>
                          <td className="py-2 px-4">
                            {idea.status || "N/A"}
                          </td>
                          <td className="py-2 px-4">
                            <button
                              onClick={() => handleModalOpen(idea)}
                              className="text-blue-500 hover:underline"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && selectedIdea && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Idea Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(selectedIdea).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-gray-700 font-semibold">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={selectedIdea[key] || ""}
                    onChange={(e) =>
                      setSelectedIdea((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="border border-gray-300 p-2 rounded"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 grid grid-cols-2 gap-4">
        <TopSubmittersList />
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={innovation}
            alt="Innovation"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Why Innovate with Us
            </h3>
            <button onClick={handleNavigation} className="text-gray-600">
              Know More &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHomepage;
