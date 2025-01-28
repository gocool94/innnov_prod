import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";
import MainHomepage from "./components/MainHomepage";
import MyIdeas from "./components/MyIdeas";
import ReviewIdeas from "./components/ReviewIdeas";
import ContactUs from "./components/ContactUs";
import BrowseIdeas from "./components/BrowseIdeas";
import Header from "./components/Header";
import InnovationPage from "./components/InnovationPage";
import FAQ from "./components/FAQ";
import Blogs from "./components/Blogs";
import BlogDetail from './components/BlogDetail';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [initial, setInitial] = useState("");

  const handleLoginSuccess = (profile) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
  };

  return (
    <Router>
    <div>
    {/* Render Header only if the user is logged in */}
    {isLoggedIn && <Header initial={initial} userProfile={userProfile} />}

      <Routes>
        {/* Redirect directly to MainHomepage if logged in */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <MainHomepage userProfile={userProfile} />
            ) : (
              <Homepage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        {/* MainHomepage route */}
        <Route
          path="/mainhomepage"
          element={<MainHomepage userProfile={userProfile} />}
        />
        <Route path="/browse-ideas" element={<BrowseIdeas />} />
          <Route path="/my-ideas" element={<MyIdeas />} />
          <Route path="/review-ideas" element={<ReviewIdeas />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/innovation" element={<InnovationPage />} /> 
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blogs/:blogId" element={<BlogDetail />} />
          <Route path="/blogs" element={<Blogs />} />
      </Routes>
      </div>
    
      
    </Router>
  );
}

export default App;