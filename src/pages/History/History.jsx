import React, { useState, useEffect } from 'react';
import s from './History.module.css';
import { toast } from 'react-hot-toast';
import HistoryDatatable from '../../components/HistoryDatatable/HistoryDatatable';
import { IoCalendarOutline, IoPersonOutline, IoMailOutline, IoSearch, IoFilterOutline } from "react-icons/io5";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const History = () => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [messageId, setMessageId] = useState('');

  // Mock data for message history (replace with actual API call)
  const fetchMessageHistory = async (pageNumber = 1, filters = {}) => {
    setLoading(true);
    
    try {
      // This would be replaced with an actual API call
      // const response = await apiConnector('GET', HISTORY_ENDPOINTS.GET_MESSAGES, { page: pageNumber, ...filters });
      
      // Mock data for demonstration
      setTimeout(() => {
        const mockResponse = {
          data: {
            success: true,
            messages: generateMockData(10, filters),
            totalPages: 5,
            currentPage: pageNumber
          }
        };
        
        setMessageHistory(mockResponse.data.messages);
        setTotalPages(mockResponse.data.totalPages);
        setPage(mockResponse.data.currentPage);
        setLoading(false);
      }, 800);
      
    } catch (error) {
      toast.error("Failed to fetch message history");
      setLoading(false);
    }
  };

  // Generate mock data for demonstration
  const generateMockData = (count, filters) => {
    const messages = [];
    const now = new Date();
    
    // Apply student ID filter if provided
    if (filters.studentId) {
      // Return only messages for specific student ID
      return Array(Math.floor(Math.random() * 10) + 1).fill().map((_, i) => ({
        id: `msg-${Math.floor(Math.random() * 1000)}`,
        studentId: filters.studentId,
        studentName: `Student ${filters.studentId}`,
        messageContent: `Message content for student ${filters.studentId}. This is message number ${i+1}.`,
        sentDate: new Date(now - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        sentBy: `Admin ${Math.floor(Math.random() * 5) + 1}`,
        status: Math.random() > 0.2 ? 'Delivered' : 'Failed'
      }));
    }
    
    // Apply message ID filter if provided
    if (filters.messageId) {
      return [{
        id: filters.messageId,
        studentId: `STU${Math.floor(Math.random() * 1000)}`,
        studentName: `Student Name ${Math.floor(Math.random() * 100)}`,
        messageContent: `This is the content of message ${filters.messageId}. It contains important information for the student.`,
        sentDate: new Date(now - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        sentBy: `Admin ${Math.floor(Math.random() * 5) + 1}`,
        status: Math.random() > 0.2 ? 'Delivered' : 'Failed'
      }];
    }
    
    // Generate random messages for the specified count
    for (let i = 0; i < count; i++) {
      const sentDate = new Date(now - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
      
      // Apply date filters if provided
      if (filters.startDate && sentDate < filters.startDate) continue;
      if (filters.endDate && sentDate > filters.endDate) continue;
      
      messages.push({
        id: `msg-${Math.floor(Math.random() * 1000)}`,
        studentId: `STU${Math.floor(Math.random() * 1000)}`,
        studentName: `${['John', 'Jane', 'Bob', 'Alice', 'Tom'][Math.floor(Math.random() * 5)]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
        messageContent: `This is a sample message ${i+1}. It contains important information for the student.`,
        sentDate: sentDate.toISOString(),
        sentBy: `Admin ${Math.floor(Math.random() * 5) + 1}`,
        status: Math.random() > 0.2 ? 'Delivered' : 'Failed'
      });
    }
    
    return messages;
  };

  // Initial fetch
  useEffect(() => {
    fetchMessageHistory(1);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchMessageHistory(newPage, {
      startDate,
      endDate,
      studentId: studentId || undefined,
      messageId: messageId || undefined
    });
  };

  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    fetchMessageHistory(1, {
      startDate,
      endDate,
      studentId: studentId || undefined,
      messageId: messageId || undefined
    });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setStudentId('');
    setMessageId('');
    fetchMessageHistory(1);
  };

  return (
    <div className={s.historyContainer}>
      <div className={s.historyHeader}>
        <h2 className={s.fullWidthH2}>Message History</h2>
        
        <div className={s.filterToggle}>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={s.filterToggleBtn}
          >
            <IoFilterOutline /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <form className={s.filtersContainer} onSubmit={handleFilterSubmit}>
            <div className={s.filterGroup}>
              <label htmlFor="dateRange">
                <IoCalendarOutline className={s.inputIcon} /> Date Range
              </label>
              <div className={s.datePickerContainer}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  className={s.datePicker}
                />
                <span className={s.dateRangeSeparator}>to</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                  className={s.datePicker}
                />
              </div>
            </div>
            
            <div className={s.filterGroup}>
              <label htmlFor="studentId">
                <IoPersonOutline className={s.inputIcon} /> Student ID
              </label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student ID"
              />
            </div>
            
            <div className={s.filterGroup}>
              <label htmlFor="messageId">
                <IoMailOutline className={s.inputIcon} /> Message ID
              </label>
              <input
                type="text"
                id="messageId"
                value={messageId}
                onChange={(e) => setMessageId(e.target.value)}
                placeholder="Enter message ID"
              />
            </div>
            
            <div className={s.filterActions}>
              <button type="submit" className={s.applyFilterBtn} disabled={loading}>
                <IoSearch /> Apply Filters
              </button>
              <button type="button" className={s.clearFilterBtn} onClick={handleClearFilters} disabled={loading}>
                Clear
              </button>
            </div>
          </form>
        )}
      </div>
      
      <HistoryDatatable 
        data={messageHistory} 
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default History; 