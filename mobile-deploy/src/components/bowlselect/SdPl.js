import React from 'react'

class SidePlate extends React.Component {
    constructor(props) {
        super(props);
    }
    handler = (e) => {
        let t = document.querySelectorAll('.tmpt')
        for (let i = 0; i < t.length; i++) {
            t[i].style.fontWeight = "450"

        }
        let tmp = document.querySelectorAll('.selectSide div');
        // for (let i = 0; i < tmp.length; i++) {
        //     tmp[i].style.border = '3px solid transparent'
        //     tmp[i].style.boxShadow="none"

        // }
            if (e.target.classList.contains('activeSide')) {
                e.target.classList.remove('activeSide')
                e.target.parentNode.style.border = "1px solid transparent"
                e.target.parentNode.style.boxShadow = "none"
            } else {
                e.target.parentNode.style.border = "1px solid #FFFFFF"
                e.target.parentNode.style.boxShadow = "0 3px 10px rgba(0,0,0,0.5)"
                e.target.parentNode.querySelector('p').style.fontWeight = 'bold'
                e.target.classList.add('activeSide')
            }

    }
    render() {
        return (
            <div onClick={(e) => { this.handler(e); this.props.handler(this.props.info) }} className="selectSideCont" style={{ background: this.props.style }}>
                <div className="fClick"></div>
                <div className="crcle">
                    {this.props.info.src ? <img src={this.props.info.src} /> : null}
                </div>
                <p className='tmpt'>{this.props.info.name}</p>
            </div>
        )
    }
}
export default SidePlate;