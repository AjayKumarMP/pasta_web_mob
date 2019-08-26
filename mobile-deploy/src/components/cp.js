import React from 'react';
class Cp extends React.Component{
    render(){
        return(
            <div className="cp">
                <div className="headCont">
                <img src={this.props.info.src}/>
                <h3>{this.props.info.name}</h3>
                <a >Apply</a>
                </div>
                <p className="p1">{this.props.info.headInfo}</p>
                <p className="p2">{this.props.info.mainInfo}</p>
                    <hr/>
            </div>
        )
    }
}
export default Cp