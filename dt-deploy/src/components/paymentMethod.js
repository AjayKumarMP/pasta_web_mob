import React from 'react';
import {connect} from 'react-redux'
import Method from './payMeth'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
 let mapStateToProps=(state)=>{
    return {data:state}
  }

class ContactUs extends React.Component {
    constructor(props){
        super(props);
    }
        
    render(){
        return(
            <div className="contactUsWrapp">
              <div className="cnt-nav">
                <Link to="/payment"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
                <h4>Payment</h4>
              </div>
              <div className="methCont">
                  {
                      this.props.data.paymentMethod.map((item,index)=>{
                        return <Method info = {item} key ={index} />
                      })
                  }
              </div>
              <Link className="proceedBtn">PROCEED</Link>
            </div>
        )
    }

} 
export default connect(mapStateToProps)(ContactUs);
