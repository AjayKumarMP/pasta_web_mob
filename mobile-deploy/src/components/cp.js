import React from 'react';
class Cp extends React.Component{
    render(){
        return(
            <div className="cp">
                <div className="headCont">
                {/* <img src={this.props.info.picture}/> */}
                <h3>{this.props.info.code}</h3>
                <a onClick={()=>this.props.handler(this.props.info)}>{this.props.selected?'Applied':'Apply'}</a>
                </div>
                {/* <p className="p1">{this.props.info.headInfo}</p> */}
                <p className="p2">{`Use code ${this.props.info.code} and you can get a ${this.props.info.discount} discount.`}</p>
                    <hr/>
            </div>
        )
    }
}
export default Cp