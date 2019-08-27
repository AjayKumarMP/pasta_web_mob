import React from 'react';
import { connect } from 'react-redux'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import httpClient from '../../utils/httpClient';
import APIEndPoints from '../../utils/APIEndPoints';
import Loading from '../loader'
let mapStateToProps = (state) => {
    return { data: state }
}
class Thanks extends React.Component {

    state = {
        loading: true,
        orderDetails: {}
    }

    async componentDidMount() {
        const order = JSON.parse(localStorage.getItem('order_id'))
        try {
            const details = await httpClient.ApiCall('post', APIEndPoints.orderDetails, {
                order_id:  order && order.id? order.id : 0
            })
            this.setState({
                orderDetails: details.data,
                loading: false
            })
        } catch (error) {
            this.setState({loading: false})
        }
    }
    render() {
        const { loading, orderDetails } = this.state
        return (
            <div className="contactUsWrapp">
                <Loading data={loading} />
                <div className="cnt-nav">
                    <Link to="/"><img className="prevBtn" src="./images/prevBtn.png" /></Link>
                    <h4>Track order</h4>
                </div>
                <div className="ordTrWr">
                    <div className="ordTrackerMainWrap">
                        <div className="leftSide">
                            <div className="wrapForItm">
                                <p></p>
                                <div className="wr">
                                    <div className={["wrDot", orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'placed' ? 'activeDot' : ''].join(' ')}></div>
                                    <div className="wrPl"></div>
                                </div>
                            </div>
                        </div>
                        <div className="rightSide">
                            <p className={orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'placed' ? 'activeText' : ''}>Order placed</p>
                            <span className={orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'placed' ? 'activeText' : ''}>We have received your order</span>
                        </div>
                    </div>
                    <div className="ordTrackerMainWrap">
                        <div className="leftSide">
                            <div className="wrapForItm">
                                <p></p>
                                <div className="wr">
                                    <div className={["wrDot", orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'preparing your meal' ? 'activeDot' : ''].join(' ')}></div>
                                    <div className="wrPl"></div>
                                </div>
                            </div>
                        </div>
                        <div className="rightSide">
                            <p className={orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'preparing your meal' ? 'activeText' : ''}>Preparing your meal</p>
                            <span className={orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'preparing your meal' ? 'activeText' : ''}>We are now preparing your baby bowl</span>
                        </div>
                    </div>
                    <div className="ordTrackerMainWrap">
                        <div className="leftSide">
                            <div className="wrapForItm">
                                <p></p>
                                <div className="wr">
                                    <div className={["wrDot", orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'out for delivery' ? 'activeDot' : ''].join(' ')}></div>
                                    <div className="wrPl"></div>
                                </div>
                            </div>
                        </div>
                        <div className="rightSide">
                            <p className={orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'out for delivery' ? 'activeText' : ''}>Out for delivery</p>
                            <span className={orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'out for delivery' ? 'activeText' : ''}>Delivery is on it's way</span>
                        </div>
                    </div>
                    <div className="ordTrackerMainWrap">
                        <div className="leftSide">
                            <div className="wrapForItm">
                                <p></p>
                                <div className="wr">
                                    <div className={["wrDot", orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'delivered' ? 'activeDot' : ''].join(' ')}></div>
                                </div>
                            </div>
                        </div>
                        <div className="rightSide">
                            <p className={orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'delivered' ? 'activeText' : ''}>Delivered</p>
                            <span className={orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'delivered' ? 'activeText' : ''}>Enjoy your pasta</span>
                        </div>
                    </div>
                </div>
                <h4 className="ordSmrH4">Order summary</h4>
                <div className="summaryOrd">
                    <div className="leftSide">
                        <p>Order number</p>
                        <p>Delivery address</p>
                        {/* <p>Delivery address</p> */}
                    </div>
                    <div className="rightSide">
                        <p>{orderDetails.id}</p>
                        <p>1912, Greenwood city, Sector-45,Gurgaon, Haryana.</p>
                        {/* <p>x2 Alfredo Spagetti</p>
                    <p>x2 Alfredo Spagetti</p>
                    <p>x2 Alfredo Spagetti</p> */}

                    </div>
                </div>
                <div className="tmptst"> <p>Total ammount</p><p>{orderDetails.grant_total}</p></div>
            </div>
        )
    }

}
export default connect(mapStateToProps)(Thanks);
