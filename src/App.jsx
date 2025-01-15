import { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import FrameDisplay from "./components/FrameDisplay";
import { saveFrame, getAllFrames } from "./utils/idb";

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
      acc[frame.id + '_' + frame.name] = 'http://localhost:8000' + frame.url;
      return acc;
    }, {});
    setAllFrames(framesMap);
    setShowAllFrames(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Video Frame Extractor
        </h1>

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
        {!isProcessingComplete && !showAllFrames && <FileUpload onUploadSuccess={handleUploadSuccess} />}

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