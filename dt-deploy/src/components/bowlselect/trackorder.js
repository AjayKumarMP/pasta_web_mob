import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { ComponentHelpers, connect } from '../../utils/componentHelper';
import httpClient from '../../utils/httpClient';
import APIEndPoints from '../../utils/APIEndPoints';
import { ReactComponent as BackLogo } from '../../assets/icons/back2.svg';  


class Thanks extends ComponentHelpers {
    state = {
        order: '',
        orderDetails: {}
    }
    async componentDidMount() {
        const order = JSON.parse(localStorage.getItem('order_id'))
        if (order) {
            const order_details = await httpClient.ApiCall('post', APIEndPoints.orderDetails, {
                order_id: order.id
            })
            this.setState({ order, orderDetails: order_details.data })
        } else {
            this.props.history.push('/')
        }
    }

    render() {
        const {orderDetails}  = this.state
        return (
            <>
                <div className="appContainer" style={{ marginLeft: '3%' }}>
                    <div className="contactUsWrapp">
                        <div className='header'>
                            <Link to='/'>
                                <BackLogo />
                            </Link>

                        </div>
                        <div className="appContainer">

                            <div className="contactUsWrapp">
                                <div className="thanksMainWrapp">
                                    {/* <img  className="thImg" src='./images/th.png' /> */}
                                    <h1>Thank you for ordering with us</h1>
                                    <p>Your order {this.state.order.unique_order_id} has been placed. </p>
                                    {/* It will be delivered by 11:47</p> */}
                                    {/* <Link to='/ordertracker' className="ordTrack">Track order</Link> */}
                                    <Link to="/contactus" className="suppOnl" >Customer support</Link>
                                </div>
                            </div>
                        </div>
                        <div className="ordTrWr">
                            <h2 >Track  Order</h2>
                            <div className="ordTrackerMainWrap">
                        <div className="leftSide">
                            <div className="wrapForItm">
                                <p></p>
                                <div className="wr">
                                    <div className={["wrDot", orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'placed' ? 'activeDot' : 'no'].join(' ')}></div>
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
                                    <div className={["wrDot", orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'on the way' ? 'activeDot' : ''].join(' ')}></div>
                                    <div className="wrPl"></div>
                                </div>
                            </div>
                        </div>
                        <div className="rightSide">
                            <p className={orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'on the way' ? 'activeText' : ''}>Out for delivery</p>
                            <span className={orderDetails.customer_status && orderDetails.customer_status.toLowerCase() === 'on the way' ? 'activeText' : ''}>Delivery is on it's way</span>
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
                        <div className="summaryOrd" style={{width: '35%'}}>
                            <div className="leftSide">
                                <p>Order number</p>
                                <p>Delivery address</p>
                                {/* <p>Delivery address</p> */}
                            </div>
                            <div className="rightSide">
                                <p>{this.state.orderDetails && this.state.orderDetails.unique_order_id}</p>
                                <p>{this.state.orderDetails.address && this.state.orderDetails.address.address_text}</p>
                                {/* <p>x2 Alfredo Spagetti</p>
                                <p>x2 Alfredo Spagetti</p>
                                <p>x2 Alfredo Spagetti</p> */}

                            </div>
                        </div>
                        <div className="tmptst"> <p>Total ammount</p><p>&#x20B9; {this.state.orderDetails.grant_total}</p></div>
                    </div>
                </div>
            </>
        )
    }

}
export default connect(Thanks);
