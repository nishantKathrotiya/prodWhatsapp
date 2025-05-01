import React, { useState, useEffect } from 'react';
import { getMessageHistory } from '../../Services/Operations/History';
import { toast } from 'react-hot-toast';
import s from './History.module.css';
import { IoChevronDown, IoChevronUp, IoTimeOutline, IoSearch } from "react-icons/io5";

const History = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());

    const fetchMessageHistory = async () => {
        setLoading(true);
        try {
            const response = await getMessageHistory(page);
            setMessages(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast.error("Failed to fetch message history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessageHistory();
    }, [page]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleRow = (messageId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(messageId)) {
                newSet.delete(messageId);
            } else {
                newSet.add(messageId);
            }
            return newSet;
        });
    };

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

    const filteredMessages = messages.filter(message => {
        const query = searchQuery.toLowerCase();
        return (
            message.sender.toLowerCase().includes(query) ||
            message.receiver.toLowerCase().includes(query) ||
            message.message.toLowerCase().includes(query) ||
            message._id.toLowerCase().includes(query)
        );
    });

    return (
        <div className={s.historyContainer}>
            <div className={s.historyHeader}>
                <h2 className={s.title}>Message History</h2>
                <div className={s.searchBox}>
                    <IoSearch className={s.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className={s.searchInput}
                    />
                </div>
            </div>

            <div className={s.tableContainer}>
                {loading ? (
                    <div className={s.loading}>Loading...</div>
                ) : filteredMessages.length === 0 ? (
                    <div className={s.noData}>No messages found</div>
                ) : (
                    <div className={s.tableWrapper}>
                        <div className={s.tableHeader}>
                            <div className={s.headerCell}>Message ID</div>
                            <div className={s.headerCell}>Sender</div>
                            <div className={s.headerCell}>Receiver</div>
                            <div className={s.headerCell}>Date & Time</div>
                            <div className={s.headerCell}>Status</div>
                            <div className={s.headerCell}>Details</div>
                        </div>
                        <div className={s.tableBody}>
                            {filteredMessages.map((message) => (
                                <div key={message._id} className={s.tableRowContainer}>
                                    <div className={s.tableRow}>
                                        <div className={s.cell}>{message._id}</div>
                                        <div className={s.cell}>{message.sender}</div>
                                        <div className={s.cell}>{message.receiver}</div>
                                        <div className={s.cell}>
                                            <div className={s.dateTime}>
                                                <IoTimeOutline className={s.timeIcon} />
                                                <span>{formatDate(message.timestamp)}</span>
                                            </div>
                                        </div>
                                        <div className={s.cell}>
                                            <span className={`${s.statusBadge} ${message.status === 'success' ? s.success : s.failed}`}>
                                                {message.status}
                                            </span>
                                        </div>
                                        <div className={s.cell}>
                                            <button 
                                                className={s.expandButton}
                                                onClick={() => toggleRow(message._id)}
                                            >
                                                {expandedRows.has(message._id) ? (
                                                    <IoChevronUp />
                                                ) : (
                                                    <IoChevronDown />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {expandedRows.has(message._id) && (
                                        <div className={s.expandedContent}>
                                            <div className={s.messageContent}>
                                                <h3>Message Content</h3>
                                                <p>{message.message}</p>
                                            </div>
                                            <div className={s.additionalInfo}>
                                                <div className={s.infoItem}>
                                                    <span className={s.infoLabel}>Sender ID:</span>
                                                    <span>{message.senderId}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {!loading && filteredMessages.length > 0 && (
                <div className={s.pagination}>
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className={s.paginationButton}
                    >
                        Previous
                    </button>
                    <span className={s.pageInfo}>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className={s.paginationButton}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default History; 