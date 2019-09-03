import React from 'react';
import {Route, Link, BrowserRouter as Router} from 'react-router-dom'
import Orditem from './ordItem'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'

import '../shared.scss';
import '../styles/yourCart.scss';
import '../styles/order.scss';
import {ReactComponent as BackLogo} from '../assets/icons/back2.svg';
import {ComponentHelpers, connect} from '../utils/componentHelper'
import {IoIosEye} from 'react-icons/io'
import {IconContext} from 'react-icons'
import regularBowl from '../assets/images/regular-bowl.png';

class ContactUs extends ComponentHelpers {
    constructor(props) {
        super(props);
        this.state = {
            myOrders: [],
            loading: true
        }
    }

    async componentDidMount() {
        try {
            if (!this.props.data.isUserLoggedIn()) {
                return this
                    .props
                    .history
                    .push('/login')
            }
            this.setState({loading: true})
            const response = await httpClient.ApiCall('post', APIEndPoints.myOrders)
            this.setState({myOrders: response.data, loading: false})
        } catch (error) {
            this.setState({loading: false})
            console.log(error)
        }
    }

    viewOrderSumary(order_id) {
        localStorage.setItem('order_details_id', order_id)
        this
            .props
            .history
                .push('/order-summary')
    }

    reOrder = async (order)=>{
      try {
        this.setState({loading: true})
        
        await httpClient.ApiCall('post', APIEndPoints.reorder, {
          order_id: order.id,
          kitchen_id: this.props.data.kitchen_id
        })
        this.setState({loading: false})
      } catch (error) {
        this.setState({loading: false})
        console.log(error)
      }
    }

    render() {
        const {myOrders, loading} = this.state
        return (
            <div className='container'>
                <Loading data={loading}/>
                <div className='wrapper'>
                    <div className='header'>
                        <Link to='/'>
                            <BackLogo/>
                        </Link>
                        My Orders
                    </div>

                    <div
                        className='cartWrapper'
                        style={{
                        display: 'block',
                        width: '67%',
                        marginLeft: '14%'
                    }}>
                        {myOrders.map((data, index) => <div key={index} className='orderCard'>
                            <div
                                className='orderDetails'
                                style={{
                                display: 'grid',
                                gridRowStart: 1,
                                gridRowEnd: 100,
                                padding: '3%'
                            }}>
                                <div
                                    style={{
                                    gridColumn: 1 / 4
                                }}><img
                                    style={{
                            // margin: '11%'
                            width: '37%',
                            marginLeft: '22%'
                        }}
                                    src={regularBowl}
                                    alt="loading"/></div>
                                <div className="ordrightSide">
                                    <div
                                        style={{
                                        gridColumn: 1 / 6
                                    }}>
                                        <label>ORDER DELIVERED TO</label>
                                        <p>{data.address && data.address.address_text}</p>

                                        <div className='break' style={{flexDirection: 'row'}}>
                                        <div>

                                        <label>ORDER NUMBER</label>
                                        <p>{data.unique_order_id}</p>
                                        </div>
                                        <div>

                                        <label>TOTAL</label>
                                        <p>Rs {data.grant_total}</p>
                                        </div>
                                        </div>

                                    </div>

                                    <div
                                        style={{
                                        gridColumn: 1 / 6,
                                        flexDirection: 'row'
                                    }}>
                                        <div style={{justifyContent: 'center'}}>
                                            <label>ORDERED ON</label>
                                            <p>{data
                                                    .created_at
                                                    .split(" ")[0]}</p>
                                        </div>
                                        <div style={{justifyContent: 'flex-end'}} onClick={() => this.viewOrderSumary(data.id)}>
                                            <p className="viewSummary">
                                                <IconContext.Provider
                                                    value={{
                                                    className: 'react-icons'
                                                }}>
                                                    <IoIosEye style={{paddingTop: '1px', paddingBottom:'11px'}} size="2em"/>
                                                </IconContext.Provider>View order summary</p>
                                        </div>{' '}
                                    </div>
                                </div>
                            </div>

                            <div className='orderDetails'>
                                <p className='deliveryText'>{data.payment_status}</p>
                                <button onClick={()=>this.reOrder(data)} disabled={loading} className='orderbtn'>REORDER</button>
                            </div>
                        </div>)
}
                    </div>
                </div>
            </div>
        );
    }

}
export default connect(ContactUs);
