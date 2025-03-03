import React from "react";
import s from './PollDropdown.module.css';

const PollDropdown = ({ partyFilter, setPartyFilter }) => {
    // The list of options for the dropdown
    const options = ["a", "b", "c", "n"];

    // Handle change in selection
    const handleChange = (e) => {
        setPartyFilter(e.target.value); // Update the state with the selected value
    };

    return (
        <div className={s.dropContainer}>
            <select
                id="pollSelect"
                name="pollSelect"
                className={s.optionsContainer}
                value={partyFilter} // Set the current value to reflect the state
                onChange={handleChange} // Update state on selection change
                aria-placeholder="Select an option"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option.toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PollDropdown;
