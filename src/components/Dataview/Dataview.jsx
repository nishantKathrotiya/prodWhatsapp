import React from 'react';
import './Dataview.css';

const Dataview = ({ entry, onSelect, isSelected }) => {
  return (
    <div className='rowdata' >
   
      <span className='titlelable'>
        <input
          type="checkbox"
          className='checkBox'
          checked={isSelected}
          onChange={() => onSelect(entry.studentId, entry.firstName,entry.lastName)}
        />
      </span>
      <span className='titlelable'>{entry.studentId}</span>
      <span className='titlelable'>{entry.lastName} {entry.firstName}</span>
      <span className='titlelable'>{entry.currentSemester}{entry.department}</span>
      <span className='titlelable'>{entry.division}</span>
      <span className='titlelable'>{entry.batch}</span>
    </div>
  );
};

export default Dataview;
