import { useState } from "react";
import FileUpload from "./components/FileUpload";
import FrameDisplay from "./components/FrameDisplay";
import { saveFrame, getAllFrames } from "./utils/idb";

const App = () => {
  const [frames, setFrames] = useState({});
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [allFrames, setAllFrames] = useState({});
  const [showAllFrames, setShowAllFrames] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);

  const handleUploadSuccess = async (response) => {
    console.log(response);
    const { unique_id, frames } = response;
    setFrames(frames);
    setIsProcessingComplete(true);
    setUniqueId(unique_id); // Store the unique ID

    // Save frames to IndexedDB
    for (const [name, url] of Object.entries(frames)) {
      await saveFrame({ name, url, unique_id });
    }
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
      acc[frame.name] = frame.url;
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
        {!isProcessingComplete ? (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <div className="text-center space-x-4">
            <button
              onClick={handleTryAnotherVideo}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Try Another Video
            </button>
            <button
              onClick={handleViewAllFiles}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              View All Files
            </button>
          </div>
        )}
        {!showAllFrames && Object.keys(frames).length > 0 && (
          <FrameDisplay frames={frames} uniqueId={uniqueId} />
        )}
        {showAllFrames && <FrameDisplay frames={allFrames} uniqueId={uniqueId} />}
      </div>
    </div>
  );
};

export default App;