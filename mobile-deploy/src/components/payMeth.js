import React from 'react'
class Method extends React.Component {

    handler =(e)=>{
        // console.log(e.target.checked)
    }
    render(){
        return(
            <div onClick={()=>this.props.handler(this.props.info.val)} className="pMethod">
                <div className="leftSide">
                    <div className="itemWrap">
                    <div className="imgWrap">
                    { this.props.info.src ? <img className="pytImg" src={this.props.info.src} /> : null }
                    </div>
                        <p>{this.props.info.name}</p>
                    </div>
                </div>
                <div className="rightSide">
                <label className="container">
                    <input type="radio" name="radio"/>
                    <span className="checkmark"></span>
                </label>
                </div>
            </div>
        )
    }
}
export default Method ;