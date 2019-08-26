import React from 'react'
class Method extends React.Component {

    handler =(e)=>{
        console.log(e.target.checked)
    }
    render(){
        return(
            <div className="pMethod">
                <div className="leftSide">
                    <div className="itemWrap">
                    <div className="imgWrap">
                    { this.props.info.src ? <img className="pytImg" src={this.props.info.src} /> : null }
                    </div>
                        <p>{this.props.info.name}</p>
                    </div>
                </div>
                <div className="rightSide">
                <label class="container">
                    <input type="radio" checked="checked" name="radio"/>
                    <span class="checkmark"></span>
                </label>
                </div>
            </div>
        )
    }
}
export default Method ;