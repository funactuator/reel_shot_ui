import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [method, setMethod] = useState("ssim");
  const [threshold, setThreshold] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("video_file", file);
    formData.append("method", method);
    formData.append("threshold", threshold);

    try {
      const response = await axios.post("http://127.0.0.1:8000/extract-frames", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onUploadSuccess(response.data);
    } catch (err) {
      setError("An error occurred while processing the video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video File
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center px-4 py-6 bg-blue-50 text-blue-700 rounded-lg shadow-sm tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-100 transition duration-300">
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
                required
              />
            </label>
          </div>
        </div>
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
        >
          {loading ? "Processing..." : "Upload"}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
};

export default FileUpload;