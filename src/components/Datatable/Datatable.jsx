import React, { useEffect, useState } from 'react';
import Dataview from '../Dataview/Dataview';
import { MdFilterAltOff } from "react-icons/md";
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
        setModal(true);
    };

    return (
       <>
         <div className='dataTableContainer'>
            <div className='titleRow'>
                <div className='headertext'>Students</div>
                <div className='searchDiv'>
                    <input
                        value={searchQuery}
                        placeholder='Enter name or studentID'
                        onChange={(e) => handleSearchChange(e)} />
                    <MdFilterAltOff className='iconFix' onClick={clearFilters} />
                    <button onClick={getSelectedIds} className='btm'>Send</button>
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
                    <span className='titlelable'>StudentID </span>
                    <span className='titlelable'>Name</span>
                    <span className='titlelable'>Semester</span>
                    <span className='titlelable'>divison</span>
                    <span className='titlelable '>Batch</span>
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
                                    onSelect={handleSelect}
                                    isSelected={selectedIds.some((selectedEntry) => selectedEntry.studentId === entry.studentId)}
                                />
                            ))}
                        </>
                    )
                }
            </div>
        </div>
       </>
    );
};

export default Datatable;
