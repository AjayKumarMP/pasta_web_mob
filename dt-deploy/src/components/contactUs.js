import React from 'react';
import {connect} from 'react-redux'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'

import '../shared.scss';
import '../styles/yourCart.scss';
import '../styles/contact.scss';
import { ReactComponent as BackLogo } from '../assets/icons/back2.svg';
import { IoMdMailOpen, IoIosChatbubbles } from 'react-icons/io'
import { IconContext } from 'react-icons'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'

 let mapStateToProps=(state)=>{
    return {data:state}
  }
   

class ContactUs extends React.Component { 

  state ={
    loading: true,
    html: ''
  }

  getHtlml(){
    return {__html : this.state.html}
  }

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

    render(){
      const {loading, html} = this.state
        return (
            <div className='container'>
            <Loading data={loading} />
              <div className='wrapper' >
                <div className='header'>
                  <Link to='/'>
                    <BackLogo />
                  </Link>
                  Contact
                </div>
                <div style={{display: 'inline-flex'}}>
                    
                <div className='cartWrapper'>
                  <div className='contactCard' style={{marginLeft: '30%'}}>
                    <h4>You can e-mail us anytime!</h4>
                    <h5>MAIL ADDRESS</h5>
                    <span>about_us@pastaproject.in</span>
                    <IconContext.Provider value={{ className: 'react-icons' }}>
                    <IoMdMailOpen className="contactUsIcon" size="2em" />
                </IconContext.Provider>
                  </div>
                </div>
                <div className="orClass"><span><hr/></span>OR<span><hr/></span></div>
                <div className='cartWrapper'>
                  <div className='contactCard' style={{background: '#fff',border: '2px solid #fee094'}}>
                    <MyComponent markup={this.getHtlml()}/>
                    {/* <h4>Talk to us</h4>
                    <p>Click here and talk to our customer support right away.</p> */}
                    <IconContext.Provider value={{ className: 'react-icons' }}>
                    <IoIosChatbubbles style={{border: 'none'}} className="contactUsIcon" size="2em" />
                </IconContext.Provider>
                  </div>
                </div>
                </div>
              </div>
            </div>
          );
    }

} 
export default connect(mapStateToProps)(ContactUs);

var MyComponent = ({markup})=>(
    // var markup = {__html: this.props.htmlToRender}
      <div dangerouslySetInnerHTML={markup}></div>
    );
