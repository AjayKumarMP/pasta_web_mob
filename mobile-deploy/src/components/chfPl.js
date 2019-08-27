import React from 'react';
import {connect} from 'react-redux'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
 let mapStateToProps=(state)=>{
    return {data:state}
  }
   

class CheffCurated extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            addCartText: "+  Add to cart"
        }
    }

    toggleAddress(){
        this.setState({
            addCartText: this.state.addCartText === '+  Add to cart'? 'Addedd': '+  Add to cart'
        })
        
    }
        
    render(){
        return(
            <div className="chfPlMainWrap">
               <img src={this.props.info.src}></img>
               <div className="underDescription">
                   <h5>{this.props.info.name}</h5>
                   <p>{this.props.info.ingr}</p>
                   <div className="undr">
                   <span>₹ {this.props.info.price}</span>
                   <a onClick={()=>{this.props.handler(this.props.info);this.toggleAddress()}}>{this.state.addCartText}</a>
                   </div>
               </div> 
            </div>
        )
    }

} 
export default connect(mapStateToProps)(CheffCurated);
