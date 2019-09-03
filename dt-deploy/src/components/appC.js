import React from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom'
import '../App.scss'
import Cp from './cp'
import { ComponentHelpers, connect } from '../utils/componentHelper';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
import { ReactComponent as BackLogo } from  '../assets/icons/back2.svg';


class ContactUs extends ComponentHelpers {
    state = {
        loading: true,
        coupons: [],
        coupon_id: 0
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })
            this.source = httpClient.getSource()
            const response = await httpClient.ApiCall('post', APIEndPoints.getCoupons, undefined, this.source.token)
            this.setState({ coupons: response.data && Object.keys(response.data).flatMap(key => [response.data[key]]), loading: false })
        } catch (err) {
            console.log(err)
            if (err.message !== 'unMounted') {
                this.setState({ loading: false })
            }
        }
    }

    componentWillUnmount() {
        this.source && this.source.cancel("unMounted")
    }

    checkCoupon = async (coupon) => {
        if (coupon === '') return this.NotificationManager.warning('Coupon cannot be empty', 'Warning!!')
        try {
            this.setState({ loading: true })
            const response = await httpClient.ApiCall('post', APIEndPoints.checkCoupon, { coupon_code: coupon.code ? coupon.code : coupon })
            if (response.message.toLowerCase() !== 'coupon expired!') {
                this.NotificationManager.success('Coupon Applied successfully', 'Success', 1500)
                this.setState({ coupon_id: response.data.id })
                localStorage.setItem("coupon_id", response.data.id)
            } else {
                this.NotificationManager.error(response.message, 'Error', 1500)
                localStorage.removeItem("coupon_id")
            }
            this.setState({ loading: false })
        } catch (error) {
            this.NotificationManager.error(error.response.data.message, 'Error', 1500)
            this.setState({ loading: false })
        }
    }

    render() {
        const { loading, coupons, coupon_id } = this.state
        return (
            <>
                <Loading data={loading} />
                <div className="appContainer">
                    <div className="contactUsWrapp">
                        <div className='header'>
                            <Link to='/cart'>
                                <BackLogo />
                            </Link>
                            Apply Coupons
                        </div>
                        <div className="appCpMainWrap">
                            <div className="inpWrap" style={{ display: 'block' }}>
                                <input style={{ marginRight: '40%' }} onChange={(e) => this.setState({ promocode: e.target.value })} placeholder="Enter promo code" type="text" />
                                <button style={{ width: '10%' }} onClick={() => this.checkCoupon(this.state.promocode)} className="doneBtn apply">Apply</button>
                            </div>
                            <div className="avbCp">
                                <h5>Available coupons</h5>
                                <hr />
                                <div className="avbCpwrap">
                                    {
                                        coupons.map((item, index) => {
                                            return <Cp key={index} selected={coupon_id === item.id} handler={this.checkCoupon} info={item} />
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}
export default connect(ContactUs);
