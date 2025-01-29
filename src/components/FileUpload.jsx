import { useState } from "react";
import axios from "axios";

const FileUpload = ({ onUploadSuccess }) => {
  const [sourceType, setSourceType] = useState("file"); // "file" or "url"
  const [file, setFile] = useState(null);
  const [reelUrl, setReelUrl] = useState("");
  const [method, setMethod] = useState("pixel");
  const [threshold, setThreshold] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (sourceType === "file") {
        if (!file) {
          setError("Please select a file.");
          setLoading(false);
          return;
        }

        // Upload file
        const formData = new FormData();
        formData.append("video_file", file);
        formData.append("method", method);
        formData.append("threshold", threshold);

        response = await axios.post(`${BACKEND_URL}/extract-frames`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        if (!reelUrl) {
          setError("Please enter a Reel URL.");
          setLoading(false);
          return;
        }

        // Submit Reel URL
        const formData = new FormData();
        formData.append("reel_url", reelUrl);
        formData.append("method", method);
        formData.append("threshold", threshold);

        response = await axios.post(
          `${BACKEND_URL}/extract-frames-url`,
          formData
        );
      }

      onUploadSuccess(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "An error occurred while processing the video."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Upload Video or Enter Reel URL
      </h2>

      {/* Toggle Switch for File / URL */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Source
        </label>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Upload Video</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={sourceType === "url"}
              onChange={() => setSourceType(sourceType === "file" ? "url" : "file")}
            />
            <div className="w-16 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-8 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
          <span className="text-gray-700">Reel URL</span>
        </div>
      </div>

      {/* Conditionally show file input or url input */}
      {sourceType === "file" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video File
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full items-center px-4 py-6 bg-blue-50 text-blue-700 rounded-lg shadow-sm tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-100 transition duration-300">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-base leading-normal">
                {file ? file.name : "Select a file"}
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {sourceType === "url" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram Reel URL
          </label>
          <input
            type="text"
            value={reelUrl}
            onChange={(e) => setReelUrl(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.instagram.com/reel/..."
          />
        </div>
      )}

      {/* Method dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Method
        </label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ssim">SSIM</option>
          <option value="pixel">Pixel Difference</option>
        </select>
      </div>

      {/* Threshold input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Threshold
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
      >
        {loading ? "Processing..." : "Upload / Process"}
      </button>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
};

export default FileUpload;
