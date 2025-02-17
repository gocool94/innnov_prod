import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    // Fetch all ideas
    fetch("http://localhost:8000/fetch_ideas/")
      .then((res) => res.json())
      .then((data) => setIdeas(data))
      .catch((err) => console.error("Error fetching ideas:", err));

    // Fetch all users
    fetch("http://localhost:8000/users/")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Handle user assignment changes
  const handleAssignChange = (ideaId, userEmail) => {
    setAssignments((prev) => ({
      ...prev,
      [ideaId]: userEmail,
    }));
  };

  // Assign Idea to User
  const assignIdeaToUser = async (ideaId) => {
    const assignedUser = assignments[ideaId];
    if (!assignedUser) {
      alert("Please select a user before assigning.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/update-idea/${ideaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assigned_user_email: assignedUser,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Idea assigned to ${assignedUser} successfully!`);
      } else {
        alert(`Error: ${result.detail}`);
      }
    } catch (error) {
      console.error("Error assigning idea:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Admin Dashboard - Assign Ideas</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 border border-gray-300 text-left">Sl No</th>
                <th className="px-4 py-3 border border-gray-300 text-left">Idea ID</th>
                <th className="px-4 py-3 border border-gray-300 text-left">Idea Title</th>
                <th className="px-4 py-3 border border-gray-300 text-left">View</th>
                <th className="px-4 py-3 border border-gray-300 text-left">Assign User</th>
                <th className="px-4 py-3 border border-gray-300 text-left">Submit</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea, index) => (
                <tr key={idea.idea_id} className="hover:bg-gray-100 transition duration-300">
                  <td className="px-4 py-3 border border-gray-300">{index + 1}</td>
                  <td className="px-4 py-3 border border-gray-300">{idea.idea_id}</td>
                  <td className="px-4 py-3 border border-gray-300">{idea.ideaTitle}</td>
                  <td className="px-4 py-3 border border-gray-300">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded transition duration-300"
                      onClick={() => alert(JSON.stringify(idea, null, 2))}
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <select
                      className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring focus:border-blue-400"
                      value={assignments[idea.idea_id] || ""}
                      onChange={(e) => handleAssignChange(idea.idea_id, e.target.value)}
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user.email} value={user.email}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded transition duration-300"
                      onClick={() => assignIdeaToUser(idea.idea_id)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
