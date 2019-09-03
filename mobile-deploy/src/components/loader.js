import React from "react";
import { FaCog } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const Loader = ({ data }) => {
    return (
        <>
            <div hidden={!data} className="loading">
                <IconContext.Provider value={{ className: 'react-icons' }}>
                    {/* <FaCog className="fa-spin" size="5em" /> */}
                    <img src="./images/loader.gif" style={{ width: '38%' }} alt="" />
                    {/* <div className="loadGif"></div> */}
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
                top: '35%',
                zIndex: 9999,
                height: '100%',
            }}>
                <IconContext.Provider value={{ className: 'react-icons' }}>
                    <img src="./images/load1.gif" style={{ width: '38%' }} alt="" />
                </IconContext.Provider>
            </div>
        </>
    );
}

export default Loader;