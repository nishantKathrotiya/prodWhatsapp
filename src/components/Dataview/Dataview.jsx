import React from 'react';
import './Dataview.css';

const Dataview = ({ entry, onSelect, isSelected }) => {
  return (
    <div className='rowdata'>
      {/* Checkbox added in the first span */}
      <span className='titlelable'>
      <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(entry.studentId, entry.contactNo)} // Pass both studentId and contactNo
        />
      </span>
      <span className='titlelable'>{entry.studentId}</span>
      <span className='titlelable'>{entry.name}</span>
      <span className='titlelable'>{entry.semester}</span>
      <span className='titlelable lastLine'>{entry.class}</span>
      <span className='titlelable lastLine'>{entry.batch}</span>
    </div>
  );
};

export default Dataview;
