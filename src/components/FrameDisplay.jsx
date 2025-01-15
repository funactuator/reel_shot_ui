import React, { useState, useEffect } from "react";

const FrameDisplay = ({ frames, uniqueId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(frames).map(([name, url]) => (
          <div
            key={name}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => openModal(url)}
          >
            <img
              src={
                uniqueId
                  ? `http://127.0.0.1:8000/get-frame/${uniqueId}/${name}`
                  : url
              }
              alt={name}
              className="w-full h-auto rounded-md"
            />
            <p className="text-sm text-gray-600 mt-2 text-center">{name}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl max-h-full overflow-auto">
            <img
              src={
                uniqueId
                  ? `http://127.0.0.1:8000/get-frame/${uniqueId}/${selectedImage}`
                  : selectedImage
              }
              alt="Full-size frame"
              className="w-full h-auto rounded-md"
            />
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameDisplay;