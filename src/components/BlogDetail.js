import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/blogData.json")
      .then((res) => res.json())
      .then((data) => {
        const foundBlog = data.find(b => b.link === `/blogs/${blogId}`);
        setBlog(foundBlog);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog. Please try again later.");
        setLoading(false);
      });
  }, [blogId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="container mx-auto px-24 py-8">
      <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-md">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-gray-100 text-black px-4 py-2 rounded mb-6 shadow hover:shadow-lg"
        >
          &larr; Go Back
        </button>
        <h1 className="text-3xl font-bold mb-6">{blog.title}</h1>
        <div className="flex items-center justify-between mb-4"> {/* Updated Flexbox layout */}
          <div className="flex items-center">
            <img src={blog.logo} alt={blog.technology} className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium">{blog.technology}</span>
          </div>
          <span className="text-sm text-gray-500">{blog.date}</span>
        </div>
        <hr className="border-t border-gray-200 my-4" />
        <h2 className="text-2xl font-semibold mb-2">{blog.descriptionTitle}</h2>
        <p className="text-gray-700 mb-4">{blog.description}</p>
        <h3 className="text-xl font-semibold mb-2">What You Will Learn</h3>
        <ul className="list-disc list-inside mb-4">
          {blog.learnItems.map((item, index) => (
            <li key={index} className="flex items-center mb-2">
              <span className="bg-gray-700 rounded-full p-2 mr-2 flex items-center justify-center w-8 h-8">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
        <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        <h3 className="text-xl font-semibold mb-2">Requirements</h3>
        <ul className="list-disc list-inside mb-4">
          {blog.requirements.map((requirement, index) => (
            <li key={index} className="text-gray-700">{requirement}</li>
          ))}
        </ul>
        <hr className="border-t border-gray-200 my-4" />
      </div>
    </div>
  );
};

export default BlogDetail;