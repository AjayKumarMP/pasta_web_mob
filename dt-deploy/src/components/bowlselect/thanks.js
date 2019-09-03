import React from 'react';
import {connect} from 'react-redux'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
 let mapStateToProps=(state)=>{
    return {data:state}
  }
   
class AboutUs extends React.Component {
    constructor(props){
        super(props);
    }
         
    render(){
      const order = JSON.parse(localStorage.getItem("order_id"))
        return(
          <div className="appContainer">

            <div className="contactUsWrapp">
              <div className="cnt-nav">  
                <Link to="/selectsides"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
              </div>
              <div className="thanksMainWrapp">
                  <img className="thImg" src='./images/th.png' />
                  <h5>Thank you for ordering with us</h5>
                  <p>Your order {order.unique_order_id} has been placed. </p>
                    {/* It will be delivered by 11:47</p> */}
                <Link to='/ordertracker' className="ordTrack">Track order</Link>
                <Link to="/cantactus" className="suppOnl" >Customer support</Link>
              </div>
            </div>
          </div>
        )
    }

} 
export default connect(mapStateToProps)(AboutUs);
