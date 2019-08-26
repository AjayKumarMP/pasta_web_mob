import React from 'react';
import {connect} from 'react-redux'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
 let mapStateToProps=(state)=>{
    return {data:state}
  }
class Thanks extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="contactUsWrapp">
              <div className="cnt-nav">  
                <Link to="/selectsides"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
                <h4>Track order</h4>
              </div>
              <div className="ordTrWr">
              <div className="ordTrackerMainWrap">
                  <div className="leftSide">
                    <div className="wrapForItm">
                        <p>10:40 AM</p>
                        <div className="wr">
                            <div className="wrDot"></div>
                            <div className="wrPl"></div>
                        </div>
                    </div>
                  </div>
                  <div className="rightSide">
                      <p>Order placed</p>
                      <span>We have received your order</span>
                  </div>
              </div>
              <div className="ordTrackerMainWrap">
                  <div className="leftSide">
                    <div className="wrapForItm">
                        <p>10:40 AM</p>
                        <div className="wr">
                            <div className="wrDot"></div>
                            <div className="wrPl"></div>
                        </div>
                    </div>
                  </div>
                  <div className="rightSide">
                      <p>Preparing your meal</p>
                      <span>We are now preparing your baby bowl</span>
                  </div>
              </div>
              <div className="ordTrackerMainWrap">
                  <div className="leftSide">
                    <div className="wrapForItm">
                        <p>10:40 AM</p>
                        <div className="wr">
                            <div className="wrDot activeDot"></div>
                            <div className="wrPl"></div>
                        </div>
                    </div>
                  </div>
                  <div className="rightSide">
                      <p className="activeText">Out for delivery</p>
                      <span className="activeText">Delivery is on it's way</span>
                  </div>
              </div>
              <div className="ordTrackerMainWrap">
                  <div className="leftSide">
                    <div className="wrapForItm">
                        <p>10:40 AM</p>
                        <div className="wr">
                            <div className="wrDot"></div>
                        </div>
                    </div>
                  </div>
                  <div className="rightSide">
                      <p>Delivered</p>
                      <span>Enjoy your pasta</span>
                  </div>
              </div>
              </div>
              <h4 className="ordSmrH4">Order summary</h4>
              <div className="summaryOrd">
                  <div className="leftSide">
                    <p>Order number</p>
                    <p>Delivery address</p>
                    <p>Delivery address</p>
                  </div>
                  <div className="rightSide">
                  <p>#HTL12345</p>
                    <p>1912, Greenwood city, Sector-45,Gurgaon, Haryana.</p>
                    <p>x2 Alfredo Spagetti</p>
                    <p>x2 Alfredo Spagetti</p>
                    <p>x2 Alfredo Spagetti</p>
                    
                  </div>
              </div>
              <div className="tmptst"> <p>Total ammount</p><p>$ 200.50</p></div>
            </div>
        )
    }

} 
export default connect(mapStateToProps)(Thanks);
