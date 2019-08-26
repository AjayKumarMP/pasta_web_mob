import React from 'react'

class Addr extends React.Component{
    formatAddress(addr) {
        if (!addr) {
            return ''
        }
        return ((addr.flat_no
            ? addr.flat_no + ", "
            : '') + (addr.street
            ? addr.street + ", "
            : '') + (addr.city
            ? addr.city + ", "
            : '') + (addr.locality
            ? addr.locality
            : ''))
    }
    
    render(){
        return(
            <div className="addresDiv">
                <div className="decor"><p>{this.props.inf}</p></div>
               <div onClick={()=>this.props.editAddr(this.props.info)} className="edtCont">
                <img className="edt" alt="loading" src="./images/edit.png"></img>
               </div>
                <div className="mainInfo">
                    <h3>{this.props.info.address_name}</h3>
                    <p className="phSct">{this.props.info.phone_no} <span>{this.props.info.email}</span></p>
                    <p className="strSct">{this.formatAddress(this.props.info)}</p>
                </div>
            </div>
        )
    }
}
export default Addr;