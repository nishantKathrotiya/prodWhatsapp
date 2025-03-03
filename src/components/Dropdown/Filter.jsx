import { useRef, useState } from "react"
import { CiFilter } from "react-icons/ci"
import { address,vote } from "../../utils/address"

import "./Filter.css"

import useOnClickOutside from "../../customHooks/useOnClickOutside"



const Filter = ({ id, callBack }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useOnClickOutside(ref, () => setOpen(false));
    if (!true) return null;

    const renderFilter = () => (
        <>
            {id === 'address' &&
                address.map((data, index) => (
                    <div
                        key={index}
                        className="linkAtDropDown_22"
                        onClick={() => {
                            callBack(data); 
                            setOpen(false); 
                        }}
                    >
                        {data}
                    </div>
                ))}

            {id === 'vote' &&
                vote.map((data, index) => (
                    <div
                        key={index}
                        className="linkAtDropDown_22"
                        onClick={() => {
                            callBack(data); // Invoke the callback correctly
                            setOpen(false); // Close the dropdown after selection
                        }}
                    >
                        {data.toUpperCase()}
                    </div>
                ))}
        </>
    );

    return (
        <button className="relative removerBtnCss" onClick={() => setOpen(true)}>
            <div className="ProfileDrop_22">
                <CiFilter className="icon" />
            </div>
            {open && (
                <div onClick={(e) => e.stopPropagation()} ref={ref} className="DropDownContainer_22">
                    {renderFilter()}
                </div>
            )}
        </button>
    );
};

export default Filter;
