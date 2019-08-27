import React from 'react';
import {connect} from 'react-redux'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';

 let mapStateToProps=(state)=>{
    return {data:state}
  }
   

class ContactUs extends React.Component {
    async componentDidMount(){
        try {
          const response = await httpClient.ApiCall('post', APIEndPoints.getStaticPage, {
            page_id: 1
          })
          this.setState({html: response.data.content, loading: false})
        } catch (error) {
          this.setState({loading: false})
          console.log(error)
        }
      }
      

      state ={
        loading: true,
        html: ''
      }

      getHtlml(){
        return {__html : this.state.html}
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
                        <MyComponent markup={this.getHtlml()}/>
                        {/* <p>Click here and talk to our 
                           customer support right away</p> */}
                           <a href={this.props.data.contactUsInfo[0].link}><img src="./images/help.png"></img></a>
                    </div>
                </div>
            </div>
        )
    }

} 

var MyComponent = ({markup})=>(
    // var markup = {__html: this.props.htmlToRender}
      <div dangerouslySetInnerHTML={markup}></div>
    );

export default connect(mapStateToProps)(ContactUs);
