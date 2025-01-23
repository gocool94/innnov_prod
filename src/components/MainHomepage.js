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

  // Fetch the ideas under review when the component mounts or userProfile changes
  useEffect(() => {
    console.log("User profile:", userProfile); // Log user profile to ensure it's received correctly

    const fetchReviewIdeas = async () => {
      if (userProfile?.review_ideas && userProfile?.review_ideas.length > 0) {
        try {
          console.log("Fetching review ideas...");
          const response = await fetch(`/api/review-ideas?ids=${userProfile?.review_ideas.join(',')}`);
          const data = await response.json();
          if (response.ok) {
            console.log("Fetched review ideas:", data); // Log fetched data
            setIdeas(data.ideas); // Update with the actual 'ideas' from the response
          } else {
            console.error("Error fetching review ideas:", data);
            setIdeas([]); // Set empty if the fetch fails
          }
        } catch (error) {
          console.error("Error fetching review ideas:", error);
          setIdeas([]); // Set empty if an error occurs
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No review ideas to fetch.");
        setLoading(false); // No ideas to review
      }
    };

    fetchReviewIdeas();
  }, [userProfile]);

  // Log if userProfile is not available
  if (!userProfile) {
    console.log("User profile not available yet.");
    return <p>Loading...</p>;
  }

  console.log("Rendering MainHomepage with user profile:", userProfile); // Log userProfile for rendering

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Idea Status */}
      <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
  Welcome, {userProfile?.email || "Guest"}! Here is your Idea Status:
</h2>
        <div className="grid grid-cols-5 gap-4">
          <StatusCard title="Beans Earned" count={userProfile?.beans || 0} bgColor="bg-yellow-200" />
          <StatusCard title="Ideas Shared" count={userProfile?.ideasShared || 0} bgColor="bg-blue-200" />
          <StatusCard title="Ideas Accepted" count={userProfile?.ideasAccepted || 0} bgColor="bg-green-200" />
          <StatusCard title="Review Pending" count={userProfile?.reviewPending || 0} bgColor="bg-orange-200" />
          <StatusCard title="Ideas Tried" count={userProfile?.ideasTried || 0} bgColor="bg-red-200" />
        </div>
      </div>
      
      {/* Conditionally render Review Ideas Table */}
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
                    <td className="py-2 px-4">{idea.status || "N/A"}</td>
                    <td className="py-2 px-4">
                      <button className="text-blue-500 hover:underline">Review</button>
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

      {/* Top 5 Submitters & Featured Section */}
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
