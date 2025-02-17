import React, { useState, useEffect } from "react";

const ShareUpdateModal = ({ toggleModal, userProfile }) => {
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    ideaTitle: "",
    ideaCategory: "",
    ideaDescription: "",
    valueAdd: "",
    valueAddWords: "",
    toolsTechnologies: "",
    contributors: "",
    complexity: "",
    primaryBeneficiary: "",
    implementIdea: "",
    googleLink: "",
  });

  // Initializing the status to null (could also be "Submitted" or another status)
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (userProfile && userProfile.name && userProfile.email) {
      setFormData((prevData) => ({
        ...prevData,
        name: userProfile.name,
        email: userProfile.email,
      }));
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Prepare payload to include 'status' and 'beans'
  const preparePayload = () => {
    return {
      ...formData,
      status: "Submitted", // Add the status field with the value "Submitted"
      beans: 100, // Automatically add 100 beans when submitting an idea
      ideaCategory: formData.ideaCategory.split(",").map((item) => item.trim()),
      toolsTechnologies: formData.toolsTechnologies.split(",").map((item) => item.trim()),
      primaryBeneficiary: formData.primaryBeneficiary.split(",").map((item) => item.trim()),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = preparePayload();
    console.log("Prepared Payload:", payload); // Check the payload to confirm it includes the status and beans

    try {
      const response = await fetch("http://127.0.0.1:8000/ideas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Error: Response not OK");
        throw new Error("Failed to submit idea");
      }

      const data = await response.json();
      console.log("Idea submitted successfully:", data);

      setStatus("Submitted");
      console.log("Status updated to Submitted");

      // Reset form data after submission
      setFormData({
        name: userProfile?.name || "",
        email: userProfile?.email || "",
        ideaTitle: "",
        ideaCategory: "",
        ideaDescription: "",
        valueAdd: "",
        valueAddWords: "",
        toolsTechnologies: "",
        contributors: "",
        complexity: "",
        primaryBeneficiary: "",
        implementIdea: "",
        googleLink: "",
      });

      toggleModal(); // Close modal after submission
    } catch (error) {
      console.error("Error submitting idea:", error);
      setStatus("Failed to submit"); // Show error status if something goes wrong
    }
  };

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
        <h2 className="text-3xl font-bold mb-6 text-green-700">
          Submit Your Idea
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-gray-700 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Your Name"
              value={formData.name}
              readOnly
              style={{ backgroundColor: "#e5e7eb" }}
            />

            <label className="text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Your Email"
              value={formData.email}
              readOnly
              style={{ backgroundColor: "#e5e7eb" }}
            />

            <label className="text-gray-700 font-semibold">Idea Title</label>
            <input
              type="text"
              name="ideaTitle"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Title of the Idea"
              value={formData.ideaTitle}
              onChange={handleChange}
            />

            <label className="text-gray-700 font-semibold">
              Idea Category (Comma-Separated)
            </label>
            <input
              type="text"
              name="ideaCategory"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Categories (e.g., Tech, Health)"
              value={formData.ideaCategory}
              onChange={handleChange}
            />

            <label className="text-gray-700 font-semibold">
              Idea Description
            </label>
            <textarea
              name="ideaDescription"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Describe your idea here"
              rows="4"
              value={formData.ideaDescription}
              onChange={handleChange}
            ></textarea>

            <label className="text-gray-700 font-semibold">Value Add</label>
            <input
              type="text"
              name="valueAdd"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Value Add"
              value={formData.valueAdd}
              onChange={handleChange}
            />

            <label className="text-gray-700 font-semibold">
              Google Link
            </label>
            <input
              type="url"
              name="googleLink"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Google link"
              value={formData.googleLink}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Submit Idea
            </button>
            <button
              type="button"
              className="ml-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareUpdateModal;
