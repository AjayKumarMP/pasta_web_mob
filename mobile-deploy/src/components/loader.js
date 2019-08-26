import React from "react";
import { FaSpinner } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const Spinner = ({ data }) => {
    return (
        <>
            <div hidden={!data} className="loading">
                <IconContext.Provider value={{ className: 'react-icons' }}>
                    <FaSpinner className="fa-spin" size="3em" />
                </IconContext.Provider>
            </div>
        </>
    );
}

export default Spinner;