import React from 'react'

class Addr extends React.Component{
    constructor(props){
        super(props);
    }
      
    render(){
        return(
            <div className="addresDiv">
                <div className="decor"><p>{this.props.inf}</p></div>
               <div className="edtCont">
                <img className="edt" src="./images/edit.png"></img>
               </div>
                <div className="mainInfo">
                    <h3>{this.props.info.name}</h3>
                    <p className="phSct">{this.props.info.phone} <span>{this.props.info.email}</span></p>
                    <p className="strSct">{this.props.info.address}</p>
                </div>
            </div>
        )
    }
}
export default Addr;