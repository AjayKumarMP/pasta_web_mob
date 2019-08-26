import React from "react";
import { FaSpinner } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const Loader = ({ data }) => {
    return (
        <>
            <div hidden={!data} className="loading">
                <IconContext.Provider value={{ className: 'react-icons' }}>
                    <FaSpinner className="fa-spin" size="5em" />
                </IconContext.Provider>
            </div>
        </>
    );
}

export const Spinner = ({ data }) => {
    return (
        <>
            <div hidden={!data} style={{
                position: 'fixed',
                left: '40%',
                paddingTop: '13%',
                top: '10%',
                zIndex: 9999
            }}>
                <IconContext.Provider value={{ className: 'react-icons' }}>
                    <FaSpinner className="fa-spin" size="5em" />
                </IconContext.Provider>
            </div>
        </>
    );
}

export default Loader;

