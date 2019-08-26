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
        return(
            <div className="contactUsWrapp">
              <div className="cnt-nav">
                <Link to="/"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
                <h4>About pasta project</h4>
              </div>
              <div className="heading">
                  <h3>Heading</h3>
                  <p> On first try Adobe Xd really fascinated me. Create artboard for each icon/asset and turn off the artboard background fill so the icon is exported with transparent background. Now go to File / Export and export all artboards either as PNG files resolutions
                      On first try Adobe Xd really fascinated me. Create artboard for each icon/asset and turn off the artboard background fill so the icon is exported with transparent background. Now go to File / Export and export all artboards either as PNG files resolutions</p>
              </div>
                <div className="under-nav">
                    <nav>
                        <li>News</li>
                        <li>Privacy policy</li>
                        <li>Terms & conditions</li>
                        <li>Payments, Refund & Cancellation policy</li>
                    </nav>
                </div>
            </div>
        )
    }

} 
export default connect(mapStateToProps)(AboutUs);
