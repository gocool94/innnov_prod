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
      // Extract only the allowed fields for update
      const updatedFields = {
        ideaTitle: selectedIdea.ideaTitle,
        ideaDescription: selectedIdea.ideaDescription,
        valueAddWords: selectedIdea.valueAddWords,
        googleLink: selectedIdea.googleLink,
        status: selectedIdea.status, // If status is editable
      };
  
      const response = await fetch(`http://localhost:8000/api/edit-idea-fields/${selectedIdea.idea_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Idea updated successfully:", data);
  
        // Update ideas list only for modified fields
        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) =>
            idea.idea_id === selectedIdea.idea_id ? { ...idea, ...updatedFields } : idea
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
  {/* Beans Earned */}
  <StatusCard
    title="Beans Earned"
    count={userProfile?.beans || 0} // Directly from userProfile
    bgColor="bg-yellow-200"
  />

  {/* Ideas Shared */}
  <StatusCard
    title="Ideas Shared"
    count={userProfile?.submitted_ideas?.length || 0} // Count submitted ideas
    bgColor="bg-blue-200"
  />

  {/* Ideas Accepted */}
  <StatusCard
    title="Ideas Accepted"
    count={ideas.filter((idea) => idea.status === "Approved").length || 0} // Count accepted ideas
    bgColor="bg-green-200"
  />

  {/* Review Pending */}
  <StatusCard
    title="Review Pending"
    count={userProfile?.review_ideas?.length || 0} // Count review ideas
    bgColor="bg-orange-200"
  />

  {/* Ideas Tried (Needs logic) */}
  <StatusCard
    title="Ideas Tried"
    count={0} // Placeholder, define logic if needed
    bgColor="bg-red-200"
  />
</div>

      </div>

      {userProfile?.is_reviewer && (
  <div className="container mx-auto px-4 py-6">
    <div className="bg-yellow-100 p-4 rounded-lg shadow-lg mt-4">
      <h3 className="text-lg font-semibold text-gray-800">You are a reviewer!</h3>
      {loading ? (
        <p>Loading review ideas...</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          {ideas.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No ideas under review at the moment.</p>
          ) : (
            <table className="min-w-full border border-gray-300 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-left">
                  <th className="py-3 px-4 border-b">Title</th>
                  <th className="py-3 px-4 border-b">Description</th>
                  <th className="py-3 px-4 border-b text-center">Status</th>
                  <th className="py-3 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map((idea, index) => (
                  <tr
                    key={idea.idea_id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900">{idea.ideaTitle}</td>
                    <td className="py-3 px-4 text-gray-700 truncate max-w-xs">{idea.ideaDescription}</td>
                    <td className="py-3 px-4 text-center font-medium">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
  idea.status === "Approved"
    ? "bg-green-200 text-green-700"
    : idea.status === "Submitted"
    ? "bg-yellow-200 text-yellow-700"
    : idea.status === "Pending"
    ? "bg-yellow-200 text-yellow-700"
    : idea.status === "Rejected"
    ? "bg-red-200 text-red-700"
    : "bg-gray-200 text-gray-700"
}`}>
  {idea.status || "N/A"}
</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleModalOpen(idea)}
                        className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition font-medium shadow-md"
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
      <h3 className="text-xl font-bold mb-4">Review Idea</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Read-Only Fields */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Submitter Name</label>
          <input
            type="text"
            value={selectedIdea.name || ""}
            readOnly
            className="border border-gray-300 p-2 rounded bg-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Email</label>
          <input
            type="text"
            value={selectedIdea.email || ""}
            readOnly
            className="border border-gray-300 p-2 rounded bg-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Title</label>
          <input
            type="text"
            value={selectedIdea.ideaTitle || ""}
            readOnly
            className="border border-gray-300 p-2 rounded bg-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Description</label>
          <textarea
            value={selectedIdea.ideaDescription || ""}
            readOnly
            className="border border-gray-300 p-2 rounded bg-gray-200"
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Value Add (Words)</label>
          <textarea
            value={selectedIdea.valueAddWords || ""}
            readOnly
            className="border border-gray-300 p-2 rounded bg-gray-200"
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Google Link</label>
          <input
            type="text"
            value={selectedIdea.googleLink || ""}
            readOnly
            className="border border-gray-300 p-2 rounded bg-gray-200"
          />
        </div>

        {/* Editable Fields */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Grading Score</label>
          <input
            type="text"
            value={selectedIdea.gradingScore || ""}
            onChange={(e) => setSelectedIdea((prev) => ({ ...prev, gradingScore: e.target.value }))}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Comments</label>
          <textarea
            value={selectedIdea.comments || ""}
            onChange={(e) => setSelectedIdea((prev) => ({ ...prev, comments: e.target.value }))}
            className="border border-gray-300 p-2 rounded"
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Status</label>
          <input
            type="text"
            value={selectedIdea.status || ""}
            onChange={(e) => setSelectedIdea((prev) => ({ ...prev, status: e.target.value }))}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
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
