import React from 'react';
import {Link,BrowserRouter as Router} from 'react-router-dom'
// import '../shared.scss';
import  '../styles/about.scss';
import { ReactComponent as BackLogo } from '../assets/icons/back2.svg';
import { ComponentHelpers, connect } from '../utils/componentHelper';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'

   

class AboutUs extends ComponentHelpers {

  state={
    loading: true,
    html: ''
  }

  getHtlml(){
    return {__html : this.state.html}
  }

 async componentDidMount(){
    try {
      
      const response = await  httpClient.ApiCall('post', APIEndPoints.getStaticPage, {
        page_id: 2
      })
      this.setState({html: response.data.content, loading: false})
    } catch (error) {
      this.setState({loading: false})
      console.log(error)
    }
  }
        
    render(){
        return (
            <div className="aboutUsContainer">
            <Loading data={this.state.loading} />
            <div className='container'>
              <div className='abtwrapper' style={{marginLeft: '90px', width: '116%'}}>
                <div className='header'>
                  <Link to='/'>
                    <BackLogo />
                  </Link>
                  About Pasta Project
                </div>
                <div className='wrapper' style={{width: '50%', margin: 'inherit'}}>
                <MyComponent markup={this.getHtlml()} />
                  {/* <h2>Heading</h2>
                  <p>
                    On first try Adobe Xd really fascinated me. Create artboard for each icon/asset and turn off the artboard
                    background fill so the icon is exported with transparent background. Now go to File / Export and export all
                    artboards either as PNG files resolutions
                  </p>
                  <p>
                    On first try Adobe Xd really fascinated me. Create artboard for each icon/asset and turn off the artboard
                    background fill so the icon is exported with transparent background. Now go to File / Export and export all
                    artboards either as PNG files resolutions
                  </p> */}
                  <div className='footer' style={{paddingTop: '66px'}}>
                    <div className='footerLinks'>
                      <a href='#'> News</a>
                      <a href='#'> Privacy policy</a>
                      <a href='#'> Terms &amp; conditions</a>
                    </div>
                    <div className='policy'>
                      <a href='#'>Payments, Refund &amp; Cancellation policy</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          );
    }

} 
export default connect(AboutUs);

var MyComponent = ({markup})=>(
  // var markup = {__html: this.props.htmlToRender}
    <div dangerouslySetInnerHTML={markup}></div>
  );
