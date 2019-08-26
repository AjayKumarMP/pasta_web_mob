import React from 'react';
import {connect} from 'react-redux'
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
                <Link to="/"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
                <h4>Contact us</h4>
              </div>
                <div className="cnt-main-wrap">
                    <div className="email-wrapp">
                        <h5>Your can e-mail us anytime!</h5>
                        <p>Mail address</p>
                        <span>{this.props.data.contactUsInfo[0].email}</span>
                        <a href={"mailto:"+this.props.data.contactUsInfo[0].email}><img src="./images/email.png"></img></a>
                    </div>
                    <div className="live-supp-wrapp">
                        <h5>Talk to us</h5>
                        <p>Click here and talk to our 
                           customer support right away</p>
                           <a href={this.props.data.contactUsInfo[0].link}><img src="./images/help.png"></img></a>
                    </div>
                </div>
            </div>
        )
    }

} 
export default connect(mapStateToProps)(ContactUs);
