import React, { useState } from 'react';
import './HistoryDatatable.css';
import { IoEyeOutline, IoChevronBack, IoChevronForward, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import MessageDetailModal from '../MessageDetailModal/MessageDetailModal';

const HistoryDatatable = ({ data, loading, page, totalPages, onPageChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Effect to handle filtering data based on search query
  React.useEffect(() => {
    if (!searchQuery) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(message => {
      const query = searchQuery.toLowerCase();
      return (
        message.studentId.toLowerCase().includes(query) ||
        message.studentName.toLowerCase().includes(query) ||
        message.messageContent.toLowerCase().includes(query) ||
        message.id.toLowerCase().includes(query)
      );
    });
    
    setFilteredData(filtered);
  }, [data, searchQuery]);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle view message details
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="historyTableContainer">
      <div className="titleRow">
        <div className="headertext">Message Records</div>
        <div className="searchDiv">
          <div className="searchInputWrapper">
            <input
              value={searchQuery}
              placeholder="Search in current page..."
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      
      <div className="dataTableOverflow">
        <table className="historyTable">
          <thead>
            <tr>
              <th>Message ID</th>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Date Sent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loadingCell">
                  <div className="loadingSpinner"></div>
                  <p>Loading message history...</p>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="noDataCell">
                  <div className="noDataMessage">
                    <h3>No Messages Found</h3>
                    <p>Try changing your search criteria or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((message) => (
                <tr key={message.id} className="dataRow">
                  <td>{message.id}</td>
                  <td>{message.studentId}</td>
                  <td>{message.studentName}</td>
                  <td>{formatDate(message.sentDate)}</td>
                  <td>
                    <div className={`statusBadge ${message.status === 'Delivered' ? 'success' : 'error'}`}>
                      {message.status === 'Delivered' ? (
                        <IoCheckmarkCircleOutline />
                      ) : (
                        <IoCloseCircleOutline />
                      )}
                      {message.status}
                    </div>
                  </td>
                  <td>
                    <button 
                      className="viewBtn" 
                      onClick={() => handleViewMessage(message)}
                      title="View Message Details"
                    >
                      <IoEyeOutline /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="paginationContainer">
          <div className="paginationInfo">
            Page {page} of {totalPages}
          </div>
          <div className="paginationControls">
            <button 
              className="paginationBtn" 
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1 || loading}
            >
              <IoChevronBack /> Previous
            </button>
            <button 
              className="paginationBtn" 
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages || loading}
            >
              Next <IoChevronForward />
            </button>
          </div>
        </div>
      )}
      
      {showModal && selectedMessage && (
        <MessageDetailModal 
          message={selectedMessage} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default HistoryDatatable; 