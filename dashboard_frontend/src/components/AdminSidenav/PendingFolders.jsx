import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Loader from '../Loader';
var api_url = import.meta.env.VITE_API_URL;

const PendingFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const intervalIdRef = useRef(null);

  const fetchAssignFolders = async () => {
    try {
      const response = await axios.get(`${api_url}/pending-folders-fetch-DB`);
      setFolders(response.data);
    } catch (error) {
      console.log('getting error at the time of fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignFolders();
  }, []);

  const handleSubmitConfirmation = async (folderId, action) => {
    const Confirmation = window.confirm(
      `Are you sure you want to ${action === 'accept' ? 'accept' : 'reject'} this folder?`
    );
    if (Confirmation) {
      try {
        const response = await axios.post(`${api_url}/confirm-folders`, {
          folderId,
          action,
        });
        if (response.status === 200) {
          alert(response.data.message);
          fetchAssignFolders();
        }
      } catch (error) {
        console.log('error:', error);
      }
    }
  };

  const handleDownload = async (folderName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${api_url}/download/${folderName}`, {
        responseType: 'blob',
        validateStatus: (status) => status < 500,
      });

      if (response.status === 403) {
        alert(
          response.data.message || 'Download limit reached. You can no longer download this folder.'
        );
        return;
      }

      if (response.status === 404) {
        alert('Folder not found. Please check the folder name and try again.');
        return;
      }

      const blob = new Blob([response.data], { type: 'application/zip' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      console.log('Download successful');
    } catch (err) {
      console.error('Download error:', err);
      setError('An error occurred while trying to download the file.');
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (folderName) => {
    try {
      const response = await axios.get(`${api_url}/extract-images/${folderName}`);
      const imageUrls = response.data;

      setImageUrls(imageUrls);
      setImageIndex(0);
      setIsDisplaying(true);
      setIsPaused(false);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  useEffect(() => {
    if (!isPaused && imageUrls.length > 0) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }

      intervalIdRef.current = setInterval(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      }, 1000);
    } else if (isPaused && intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [isPaused, imageUrls]);

  const handleNext = () => {
    if (imageIndex < imageUrls.length - 1) {
      setImageIndex(imageIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleViewClose = () => {
    setImageUrl('');
    setIsDisplaying(false);
    setIsPaused(true);
  };

  useEffect(() => {
    if (imageUrls.length > 0) {
      setImageUrl(imageUrls[imageIndex]);
    }
  }, [imageIndex, imageUrls]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="assigned-folders">
        <h1>Folders Pending For Administration Confirmation</h1>
        <table>
          <thead>
            <tr>
              <th>Folder Name</th>
              <th>Region</th>
              <th>Uploaded By</th>
              <th>Image Count</th>
              <th>Image Index</th>
              <th>Data Type</th>
              <th>Sub Data Type</th>
              <th>Uploaded Date</th>
              <th>Action</th>
              <th>Download</th>
              <th>Confirmation</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {folders.length > 0 ? (
              folders.map((folder) => (
                <tr key={folder._id}>
                  <td>{folder.folderName}</td>
                  <td>{folder.region}</td>
                  <td>{folder.uploaded_by_name}</td>
                  <td>{folder.totalImageCount}</td>
                  <td>{folder.imageIndex}</td>
                  <td>{folder.dataType.dataTypeName}</td>
                  <td>{folder.subDataType.subDataTypeName}</td>
                  <td>{new Date(folder.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="action-button">{folder.status}</button>
                  </td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => handleDownload(folder.folderName)}
                    >
                      Download
                    </button>
                  </td>
                  <td>
                    <div className="folder-assign-btn">
                      <button
                        className="action-button"
                        onClick={() => handleSubmitConfirmation(folder._id, 'accept')}
                      >
                        Accept
                      </button>
                      <button
                        className="action-button"
                        onClick={() => handleSubmitConfirmation(folder._id, 'reject')}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => handleView(folder.folderName)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No Uploaded Folders Found</td>
              </tr>
            )}
          </tbody>
        </table>

        {isDisplaying && imageUrl && (
          <div className="view-box">
            <div className='view-box-header'>
              <div className="controls-view-box">
                <button className="action-button" onClick={handlePrevious}>
                  {/* <i class="fa-solid fa-arrow-left"></i> */}
                  Previous
                </button>

                <button
                  className="action-button"
                  onClick={isPaused ? handleResume : handlePause}
                  disabled={imageUrls.length === 0}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>

                <button className="action-button" onClick={handleNext}>
                  Next 
                  {/* <i class="fa-solid fa-arrow-right"></i> */}
                </button>
              </div>
              <div className="view-close-icon" onClick={handleViewClose}>X</div>
            </div>

            <img src={`${api_url}${imageUrl}`} alt="Folder Image" className="view-image" />
          </div>
        )}
      </div>
    </>
  );
};

export default PendingFolders;
