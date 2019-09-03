import React from "react";
import { FaCog } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const Loader = ({ data }) => {
    return (
        <>
            <div hidden={!data} className="loading">
                <IconContext.Provider value={{ className: 'react-icons' }}>
                    {/* <FaCog className="fa-spin" size="5em" /> */}
                    <img src="./images/loader.gif" style={{ width: '13%' }} alt="" />
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
                left: '0',
                paddingTop: '20%',
                top: '0',
                paddingLeft: '50%',
                width: '100%',
                zIndex: 99999,
                backgroundColor: 'rgba(255,255,255,0.7)',
                height: '100%',
            }}>
                <IconContext.Provider value={{ className: 'react-icons' }}>
                    {/* <FaCog className="fa-spin" size="5em" /> */}
                    <img src="./images/loader.gif" style={{ width: '13%' }} alt="" />
                </IconContext.Provider>
            </div>
        </>
    );
}

export default Loader;