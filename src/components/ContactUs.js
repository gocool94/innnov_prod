import React from "react";
import slack from "./slack.png"

const ContactUs = () => {
  return (
    <div className="mt-4 mx-4">
      <div className="bg-white shadow-md rounded-lg p-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Connect with us</h2>
          <p className="text-gray-600 mt-2">
            We’d love to hear from you! Reach out to us for any queries or feedback.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={slack} // Slack icon URL
            alt="Slack"
            className="w-10 h-10 mb-2" // Size of the icon
          />
          <span className="text-gray-600">tsc-forum</span>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
