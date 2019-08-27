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

    componentDidMount(){
      
    }
         
    render(){
      const order = JSON.parse(localStorage.getItem("order_id"))
        return(
            <div className="contactUsWrapp">
              <div className="cnt-nav">  
                <Link to="/selectsides"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
              </div>
              <div className="thanksMainWrapp">
                  <img className="thImg" src='./images/th.png' />
                  <h5>Thank you for ordering with us</h5>
                  <p>Your order {order && order.unique_order_id} has been placed. </p>
                <Link to='/ordertracker' className="ordTrack">Track order</Link>
                <Link to="/contactus" className="suppOnl" >Customer support</Link>
              </div>
            </div>
        )
    }

} 
export default connect(mapStateToProps)(AboutUs);
