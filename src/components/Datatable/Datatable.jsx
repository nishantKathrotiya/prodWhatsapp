import React, { useEffect, useState } from 'react';
import Dataview from '../Dataview/Dataview';
import PollDropdown from '../PollDropdown/PollDropdown';
import { MdFilterAltOff } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import Filter from '../Dropdown/Filter';
import './Datatable.css';
import { toast } from 'react-hot-toast';
import { sendMessages } from '../../Services/Operations/Message';

const Datatable = ({ data }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [partyFilter, setPartyFilter] = useState('n');
    const [filteredData, setFilteredData] = useState(data);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        let filtered = data;

        if (searchQuery) {
            filtered = filtered.filter(entry => {
                const query = searchQuery.toLowerCase();
                return (
                    (entry.name && entry.name.toLowerCase().includes(query)) ||
                    (entry.studentId && entry.studentId.toLowerCase().includes(query))
                );
            });
        }

        if (partyFilter !== 'n') {
            filtered = filtered.filter(entry => {
                return entry.batch.toLowerCase().includes(partyFilter.toLowerCase());
            });
        }

        setFilteredData(filtered);
    }, [searchQuery, partyFilter, data]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSelect = (studentId, contactNo) => {
        setSelectedIds((prevIds) => {
            const isSelected = prevIds.some((entry) => entry.studentId === studentId);
            if (isSelected) {
                return prevIds.filter((entry) => entry.studentId !== studentId);
            } else {
                return [...prevIds, { studentId, contactNo }];
            }
        });
    };
    

    const clearFilters = () => {
        setSearchQuery('');
        setPartyFilter('n');
        setSelectedIds([]); // Clear selected IDs
    };

    // Extract selected IDs
    const getSelectedIds = () => {
        sendMessages(selectedIds,setSelectedIds)
    };

    return (
        <div className='dataTableContainer'>
            <div className='titleRow'>
                <div className='headertext'>All The Entries</div>
                <div className='searchDiv'>
                        <button onClick={getSelectedIds} className='btm'>Send</button>
                </div>
            </div>
            <div className='dataTableOverflow'>
                <div className='columnTitle'>
                    <span className='titlelable'>Select</span>
                    <span className='titlelable'>StudentID </span>
                    <span className='titlelable'>Name</span>
                    <span className='titlelable'>Semester</span>
                    <span className='titlelable lastLine'>Class</span>
                    <span className='titlelable lastLine'>Batch</span>
                </div>
                {
                    filteredData.length === 0 ? (
                        <div className='loadingCenter'><h1>No Data Found</h1></div>
                    ) : (
                        <>
                            {filteredData.map((entry, i) => (
                                <Dataview
                                    key={i}
                                    entry={entry}
                                    onSelect={handleSelect} // Pass the handler to Dataview
                                    isSelected={selectedIds.some((selectedEntry) => selectedEntry.studentId === entry.studentId)}

                                />
                            ))}
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default Datatable;
