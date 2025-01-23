import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaLightbulb, FaClipboardList, FaEnvelope, FaBell, FaQuestionCircle, FaBlog } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import logo from './logo.png';
import ShareUpdateModal from "./ShareUpdateModal"; 
import './header.css';

const Header = ({ initial, userProfile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
  const navigate = useNavigate(); // Hook to access navigation

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen); // Function to toggle modal

  // Handle logout functionality
  const handleLogout = () => {
    // Clear the user session or authentication token
    localStorage.removeItem("user"); // Assuming you're storing user data in localStorage

    // Redirect to the homepage (or login page)
    navigate("/login"); // You can change "/login" to whatever path you want the user to be redirected to
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gray-100">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          {/* Logo and Site Name */}
          <div className="logo flex items-center">
            <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-bold">
              <span className="text-black">kipi</span>
              <span className="text-green-600">.innovate</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-8">
            <NavLink
              exact
              to="/"
              activeClassName="text-green-600 font-bold border-b-2 border-green-600"
              className="text-gray-700 hover:text-green-600 flex items-center"
            >
              <FaHome className="mr-2" /> Homepage
            </NavLink>
            <NavLink
              to="/browse-ideas"
              activeClassName="text-green-600 font-bold border-b-2 border-green-600"
              className="text-gray-700 hover:text-green-600 flex items-center"
            >
              <FaLightbulb className="mr-2" /> Browse Ideas
            </NavLink>
            <NavLink
              to="/my-ideas"
              activeClassName="text-green-600 font-bold border-b-2 border-green-600"
              className="text-gray-700 hover:text-green-600 flex items-center"
            >
              <FaClipboardList className="mr-2" /> My Ideas
            </NavLink>
            <NavLink
              to="/contact-us"
              activeClassName="text-green-600 font-bold border-b-2 border-green-600"
              className="text-gray-700 hover:text-green-600 flex items-center"
            >
              <FaEnvelope className="mr-2" /> Contact Us
            </NavLink>
            <NavLink
              to="/FAQ"
              activeClassName="text-green-600 font-bold border-b-2 border-green-600"
              className="text-gray-700 hover:text-green-600 flex items-center"
            >
              <FaQuestionCircle className="mr-2" /> FAQ's
            </NavLink>
            <NavLink
              to="/Blogs"
              activeClassName="text-green-600 font-bold border-b-2 border-green-600"
              className="text-gray-700 hover:text-green-600 flex items-center"
            >
              <FaBlog className="mr-2" /> Blogs
            </NavLink>
          </nav>

          {/* Notification and User Icon */}
          <div className="header-icons flex items-center space-x-3">
            <FaBell className="icon" />
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
                  {initial}
                </div>
                <FiUser className="icon" />
              </button>
              {/* Dropdown for user actions */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleLogout} // Call logout handler
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Promotional Banner */}
        <div className="promo-banner bg-green-600 text-white p-4 flex justify-between items-center">
          <p className="font-bold text-lg">
            Your Idea Could Be The Next Big Thing. Submit Now!
          </p>
          <button onClick={toggleModal} className="bg-white text-green-600 px-4 py-2 rounded">
            Share It Now!
          </button>
        </div>
      </div>

      {/* Share Update Modal */}
      {isModalOpen && <ShareUpdateModal toggleModal={toggleModal} userProfile={userProfile} />} {/* Render modal conditionally */}
    </>
  );
};

export default Header;
