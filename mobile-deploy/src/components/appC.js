import React from 'react';
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import Cp from './cp'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
import { ComponentHelpers, connect } from '../utils/componentHelper';

   

class ContactUs extends ComponentHelpers{
    state ={
        loading: true,
        coupons: [],
        coupon_id: 0,
        promoCode: ''
    }

    async componentDidMount(){
        try {
            this.setState({loading: true})
            this.source = httpClient.getSource()
            const response = await httpClient.ApiCall('post', APIEndPoints.getCoupons, undefined, this.source.token)
            this.setState({coupons: response.data && Object.keys(response.data).flatMap(key=>[response.data[key]]), loading: false})
        } catch(err){
            console.log(err)
            if(err.message !== 'unMounted'){
                this.setState({loading: false})
            }            
        }
    }

    componentWillUnmount(){
        this.source && this.source.cancel("unMounted")
    }

    checkCoupon = async (coupon)=>{
        if(coupon ==='') return this.NotificationManager.warning('Coupon cannot be empty', 'Warning!!')
        try {
            this.setState({loading: true})
            const response = await httpClient.ApiCall('post', APIEndPoints.checkCoupon, {coupon_code: coupon.code?coupon.code: coupon})
            if(response.message.toLowerCase() !== 'coupon expired!'){
                this.NotificationManager.success('Coupon Applied successfully', 'Success')
                this.setState({coupon_id: response.data.id})
                localStorage.setItem("coupon_id", response.data.id)
            } else {
                this.NotificationManager.error(response.message, 'Error', 1500)
                localStorage.removeItem("coupon_id")
            }
            this.setState({loading: false})
        } catch (error) {
            this.NotificationManager.error(error.response.data.message, 'Error', 1500)
            this.setState({loading: false})
        }
    }
        
    render(){
        const {loading, coupons, coupon_id} = this.state
        return(
            <section className="contactUsWrapp" style={{display: 'block !important  '}}>
            <Loading data={loading} />
              <div className="cnt-nav">
                <Link to="/payment"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
                <h4>Apply coupons</h4>
              </div>
                <div className="appCpMainWrap">
                    <div className="inpWrap">
                        <input onChange={(e)=>this.setState({promoCode: e.target.value})} placeholder="Enter promo code" type="text"></input>
                        <button onClick={()=>this.checkCoupon(this.state.promoCode)} className="apply applyCoupon doneBtn">Apply</button>
                    </div>
                    <div className="avbCp">
                        <h5>Available coupons</h5>
                        <hr/>
                        <div className="avbCpwrap">
                            {
                                coupons.length >0 && coupons.map((item,index)=>{
                                        return <Cp selected={coupon_id === item.id} key={index} handler={this.checkCoupon} info = {item}/>
                                })
                            }
                        </div>
                    </div>
                </div>
            </section>
        )
    }

} 
export default connect(ContactUs);
