import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]); // Holds blogs from JSON
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch blogs from JSON
  useEffect(() => {
    fetch("/blogData.json")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Function to truncate the description to the first full stop
  const truncateDescription = (description) => {
    const firstFullStopIndex = description.indexOf('.');
    if (firstFullStopIndex !== -1) {
      return description.substring(0, firstFullStopIndex + 1);
    }
    return description;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-t-2xl" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img src={blog.logo} alt={blog.technology} className="w-6 h-6 mr-2" />
                  <span className="text-sm font-medium">{blog.technology}</span>
                </div>
                <span className="text-sm text-gray-500">{blog.date}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-700 mb-4">{truncateDescription(blog.description)}</p> {/* Truncate description */}
              <Link to={blog.link} className="text-blue-500 hover:underline">Read Now &gt;</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;