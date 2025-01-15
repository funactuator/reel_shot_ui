import { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import FrameDisplay from "./components/FrameDisplay";
import { saveFrame, getAllFrames, deleteFrame } from "./utils/idb";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const App = () => {
  const [frames, setFrames] = useState({});
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [allFrames, setAllFrames] = useState({});
  const [showAllFrames, setShowAllFrames] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);
  const [hasFramesInIndexedDB, setHasFramesInIndexedDB] = useState(false);

  // Check if there are frames in IndexedDB on initial load
  useEffect(() => {
    const checkFramesInIndexedDB = async () => {
      const frames = await getAllFrames();
      setHasFramesInIndexedDB(frames.length > 0);

      // Verify if the images are still available on the backend
      const validFrames = {};
      for (const frame of frames) {
        try {
          const response = await fetch(`${BACKEND_URL}${frame.url}`);
          if (response.ok) {
            validFrames[frame.id + "_" + frame.name] = `${BACKEND_URL}${frame.url}`;
          } else {
            // If the image is not available, remove it from IndexedDB
            await deleteFrame(frame.id);
          }
        } catch (error) {
          console.error("Error fetching image:", error);
          await deleteFrame(frame.id); // Remove the frame if there's an error
        }
      }

      // Update the state with valid frames
      setAllFrames(validFrames);
    };

    checkFramesInIndexedDB();
  }, []);

  const handleUploadSuccess = async (response) => {
    const { unique_id, frames } = response;
    setFrames(frames);
    setIsProcessingComplete(true);
    setUniqueId(unique_id); // Store the unique ID

    // Save frames to IndexedDB
    for (const [name, url] of Object.entries(frames)) {
      await saveFrame({ name, url, unique_id });
    }

    // Update the state to indicate there are frames in IndexedDB
    setHasFramesInIndexedDB(true);
  };

  const handleTryAnotherVideo = () => {
    setFrames({});
    setIsProcessingComplete(false);
    setShowAllFrames(false);
    setUniqueId(null); // Reset unique ID
  };

  const handleViewAllFiles = async () => {
    const frames = await getAllFrames();
    const framesMap = frames.reduce((acc, frame) => {
      acc[frame.id + "_" + frame.name] = `${BACKEND_URL}${frame.url}`;
      return acc;
    }, {});
    setAllFrames(framesMap);
    setShowAllFrames(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Reel Shots
        </h1>
        <h3 className="text-xl font-bold text-center text-gray-500 mb-8">Capture screenshots of Instagram Reels</h3>

        {/* Header with Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={handleTryAnotherVideo}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Try New Video
          </button>
          {hasFramesInIndexedDB && (
            <button
              onClick={handleViewAllFiles}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Show All Frames
            </button>
          )}
        </div>

        {/* File Upload Section */}
        {!isProcessingComplete && !showAllFrames && (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        )}

        {/* Display Frames */}
        {isProcessingComplete && !showAllFrames && (
          <FrameDisplay frames={frames} uniqueId={uniqueId} />
        )}
        {showAllFrames && <FrameDisplay frames={allFrames} uniqueId={null} />}
      </div>
    </div>
  );
};

export default App;