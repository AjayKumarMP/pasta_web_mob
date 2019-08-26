import React from 'react';
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import Summary from './ordSumm'
import ordSumm from './ordSumm';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import { ComponentHelpers, connect } from '../utils/componentHelper';
import Loading from './loader'


class ContactUs extends ComponentHelpers {
    constructor(props){
        super(props);

        this.state = {
            check:false,
        }

    }
    handlerCheck= async (order_id)=>{
        if(this.state.check){
            return this.setState({ check: false });
        }
        try {
            this.setState({loading: true})
            this.source = httpClient.getSource()
            const response = await httpClient.ApiCall('post', APIEndPoints.getOrderDetails, {
                order_id
            }, this.source.token)
            this.setState({ check: true });
        } catch (error) {
            if(error.message !== 'unMounted'){
                this.setState({loading: false})
            }
            console.log(error)            
        }
    }

    componentWillUnmount(){
        this.source.cancel("unMounted")
    }

    render(){
        return(
            <div className="ordItemCont">
                <Loading data={this.state.loading} />
              <div className="headCont">
                  <div className="leftSide">
                      <span>
                          <p>ORDER DELIVERED TO</p>
                          <h5>{this.props.info.address.address}</h5>
                      </span>
                      <span>
                          <p>ORDER NUMBER</p>
                          <h5>{this.props.info.ordNum}</h5>
                      </span>
                      <span>
                          <p>TOTAL</p>
                          <h5>Rs {this.props.info.grant_total}</h5>
                      </span>
                  </div>
                  <div className="rightSide">
                  <span>
                          <p>ORDERED ON</p>
                          <h5>{this.props.info.date}</h5>
                      </span>
                      <a onClick={this.handlerCheck} className="summOpenbtn"><img src="./images/eye.png" />VIEW ORDER SUMMARY</a>
                  </div>
                { this.state.check ? <Summary /> : null }
              </div>
              <div className="Ordfooter">
                  <h5>{this.props.info.customer_status}</h5>
                  <Link to="">Reorder</Link>
              </div>
            </div>
        )
    }

} 
export default connect(ContactUs);
