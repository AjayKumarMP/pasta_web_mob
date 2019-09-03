import React from 'react';
class Cp extends React.Component{
    render(){
        return(
            <div className="cp">
                <div className="headCont">
                {/* <img src={this.props.info.picture} alt="loading"/> */}
                <h3>{this.props.info.code}</h3>
                <p style={{position: 'absolute',right: 0}} onClick={()=>this.props.handler(this.props.info)}>{this.props.selected?'Applied':'Apply'}</p>
                </div>
                <p className="p1">{`Use code ${this.props.info.code} and you can get a ${this.props.info.discount} discount`}</p>
                {/* <p className="p2">{this.props.info.mainInfo}</p> */}
                    <hr/>
            </div>
        )
    }
}
export default Cp