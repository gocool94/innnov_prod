import React from "react";

const Modal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null; // If modal is not open, return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-1/2 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Share your Idea Here</h2>
        <p className="mb-4">
          Welcome to KipiInnovate! Please fill in the details below to share
          your brilliant ideas.
        </p>

        {/* Form */}
        <form>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Name*</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              defaultValue="James Anderson"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Email*</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg"
              defaultValue="james.anderson@kipi.bi"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Idea Title*</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter Title"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Idea Category*</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Accelerator, Native
                Apps, Blogs, etc.
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Best Practices,
                Checklists, etc.
              </label>
              {/* Add other categories as needed */}
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Idea Description*
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter Text"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Value Add (1 is Low & 5 is High)*
            </label>
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="flex items-center">
                  <input
                    type="radio"
                    name="valueAdd"
                    value={value}
                    className="mr-2"
                  />
                  {value}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Value Add in Words*
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter Text"
            ></textarea>
          </div>

          {/* OK and Cancel buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
