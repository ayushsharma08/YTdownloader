'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPreview from '../components/VideoPreview';

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [itag, setItag] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false); // For Fetch Video button
  const [downloading, setDownloading] = useState(false); // For Download button

  useEffect(() => {
    if (url) {
      fetchVideoDetails();
    }
  }, [url]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchVideoDetails = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    setLoading(true); // Show loading spinner
    try {
      const response = await axios.get(`/api/fetch-video?url=${encodeURIComponent(url)}`);
      setVideoData(response.data);
      setError('');
    } catch (err) {
      setError('Invalid URL or failed to fetch video details');
      setVideoData(null);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const handleDownload = async () => {
    if (!itag) {
      setError('Please select a format');
      return;
    }
    setDownloading(true); // Show loading spinner
    try {
      window.location.href = `/api/download?url=${encodeURIComponent(url)}&itag=${itag}`;
    } catch (err) {
      setError('Failed to download video');
    } finally {
      setDownloading(false); // Hide loading spinner
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 dark:bg-gray-900 p-6 flex flex-col items-center">
      {/* Theme Toggler Button */ }
      <button
        onClick={ () => setDarkMode(!darkMode) }
        className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full dark:bg-gray-200 dark:text-gray-800"
      >
        { darkMode ? '☀️' : '🌙' }
      </button>

      <h1 className="text-purple-600 dark:text-purple-400 text-4xl font-bold mb-4 text-center">
        YouTube Video Downloader
      </h1>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={ url }
          onChange={ (e) => setUrl(e.target.value) }
          className="border p-2 rounded-lg w-full md:w-3/4 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        <button
          onClick={ fetchVideoDetails }
          disabled={ loading } // Disable button while loading
          className="bg-blue-600 text-white px-4 py-2 rounded-lg md:w-1/4 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 flex items-center justify-center"
        >
          { loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            'Fetch Video'
          ) }
        </button>
      </div>
      { error && <p className="text-red-500 mt-2">{ error }</p> }

      { videoData && (
        <div className="mt-4 w-full max-w-2xl">
          <VideoPreview thumbnail={ videoData.thumbnail } title={ videoData.title } />
          <select
            value={ itag }
            onChange={ (e) => setItag(e.target.value) }
            className="border p-2 mt-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-lg"
          >
            <option value="">Select Format</option>
            { videoData.formats.map((format) => (
              <option
                key={ `${format.itag}-${format.mimeType}` }
                value={ format.itag }
              >
                { format.quality } ({ format.mimeType.split(';')[0] })
              </option>
            )) }
          </select>
          <button
            onClick={ handleDownload }
            disabled={ downloading } // Disable button while downloading
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 w-full hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 flex items-center justify-center"
          >
            { downloading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Download'
            ) }
          </button>
        </div>
      ) }

      {/* Footer */ }
      <footer className="mt-8 text-center text-gray-600 dark:text-gray-400">
        &copy; { new Date().getFullYear() } YouTube Video Downloader. All rights reserved.
      </footer>
    </div>
  );
}