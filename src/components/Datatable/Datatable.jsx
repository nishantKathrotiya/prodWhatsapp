import React, { useEffect, useState } from 'react';
import Dataview from '../Dataview/Dataview';
import { MdFilterAltOff } from "react-icons/md";
import { IoSearch, IoSend, IoCheckmarkCircleOutline, IoClose } from "react-icons/io5";
import './Datatable.css';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const Datatable = ({ data, selectedIds, handleSelect, setModal }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [selectAll, setSelectAll] = useState(false);

    const { status } = useSelector((state) => state.profile)

    useEffect(() => {
        let filtered = data;

        if (searchQuery) {
            filtered = filtered.filter(entry => {
                const query = searchQuery.toLowerCase();
                return (
                    (entry.firstName && (entry.firstName + entry.lastName).toLowerCase().includes(query)) ||
                    (entry.studentId && entry.studentId.toLowerCase().includes(query))
                );
            });
        }

        setFilteredData(filtered);
    }, [searchQuery, data]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearFilters = () => {
        setSearchQuery('');
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            // Select all visible students
            filteredData.forEach(entry => {
                if (!selectedIds.some(selected => selected.studentId === entry.studentId)) {
                    handleSelect(entry.studentId, entry.firstName, entry.lastName);
                }
            });
        } else {
            // Deselect all visible students
            filteredData.forEach(entry => {
                if (selectedIds.some(selected => selected.studentId === entry.studentId)) {
                    handleSelect(entry.studentId, entry.firstName, entry.lastName);
                }
            });
        }
    };

    // Extract selected IDs
    const getSelectedIds = () => {
        if (selectedIds.length === 0) {
            toast.error('Please select at least one student');
            return;
        }
        setModal(true);
    };

    return (
        <div className='dataTableContainer'>
            <div className='titleRow'>
                <div className='headertext'>Student Records</div>
                <div className='searchDiv'>
                    <div className='searchInputWrapper'>
                        <IoSearch className='searchIcon' />
                        <input
                            value={searchQuery}
                            placeholder='Search by name or ID'
                            onChange={(e) => handleSearchChange(e)}
                        />
                        <IoClose className='clearIcon' onClick={clearFilters} title="Clear filters" />
                    </div>
                    <btn onClick={getSelectedIds} className={(selectedIds?.length ?? 0) === 0 ? 'btm disabled' : 'btm'} disabled={selectedIds.length === 0}>
                        <IoSend className='planeIcon' />
                        <span> ({selectedIds?.length ?? 0})</span>
                    </btn>
                </div>
            </div>
            <div className='dataTableOverflow'>
                <div className='columnTitle'>
                    <span className='titlelable'>
                        <input
                            type="checkbox"
                            className='checkBox'
                            checked={selectAll}
                            onChange={handleSelectAll}
                        />
                    </span>
                    <span className='titlelable'>StudentID</span>
                    <span className='titlelable'>Name</span>
                    <span className='titlelable'>Semester</span>
                    <span className='titlelable'>Division</span>
                    <span className='titlelable'>Batch</span>
                </div>
                {
                    filteredData.length === 0 ? (
                        <div className='loadingCenter'>
                            <div className='noDataMessage'>
                                <h3>No Students Found</h3>
                                <p>Try changing your search criteria</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {filteredData.map((entry, i) => (
                                <Dataview
                                    key={i}
                                    entry={entry}
                                    onSelect={handleSelect}
                                    isSelected={selectedIds.some((selectedEntry) => selectedEntry.studentId === entry.studentId)}
                                />
                            ))}
                            <div className="tableFooter">
                                <div className="selectedCountContainer">
                                    <IoCheckmarkCircleOutline className="selectedIcon" />
                                    <span>{selectedIds.length} student{selectedIds.length !== 1 ? 's' : ''} selected</span>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default Datatable;
