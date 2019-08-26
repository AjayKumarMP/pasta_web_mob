import React from 'react';
import {Link,BrowserRouter as Router} from 'react-router-dom'
import '../App.scss'
import Cp from './cp'
import { ComponentHelpers, connect } from '../utils/componentHelper';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
   

class ContactUs extends ComponentHelpers {
    state ={
        loading: true,
        coupons: [],
        coupon_id: 0
    }

    async componentDidMount(){
        try {
            this.setState({loading: true})
            this.source = httpClient.getSource()
            const response = await httpClient.ApiCall('post', APIEndPoints.getCoupons, undefined, this.source.token)
            this.setState({coupons: response.data, loading: false})
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
        try {
            this.setState({loading: true})
            const response = await httpClient.ApiCall('post', APIEndPoints.checkCoupon, {coupon_code: coupon.code?coupon.code: coupon})
            if(response.message.toLowerCase() !== 'coupon expired!'){
                this.setState({coupon_id: coupon.id})
                localStorage.setItem("coupon_id", coupon.id)
            } else {
                localStorage.removeItem("coupon_id")
            }
            this.setState({loading: false})
        } catch (error) {
            this.setState({loading: false})
            console.log(error)            
        }
    }
        
    render(){
        const {loading,coupons, coupon_id}  = this.state
        return(
            <>
            <Loading data={loading} />
            <div className="appContainer">
            <div className="contactUsWrapp">
              <div className="cnt-nav">
                <Link to="/cart"><img className="prevBtn" alt="loading" src="./images/prevBtn.png"/></Link>
                <h4>Apply coupons</h4>
              </div>
                <div className="appCpMainWrap">
                    <div className="inpWrap" style={{display: 'block'}}>
                        <input style={{marginRight: '40%'}} onChange={(e)=>this.setState({promocode: e.target.value})} placeholder="Enter promo code" type="text" />
                        <button style={{width: '10%'}} onClick={()=>this.checkCoupon(this.state.promocode)} className="doneBtn apply">Apply</button>
                    </div>
                    <div className="avbCp">
                        <h5>Available coupons</h5>
                        <hr/>
                        <div className="avbCpwrap">
                            {
                                coupons.map((item,index)=>{
                                    return <Cp key={index} selected={coupon_id === item.id} handler={this.checkCoupon} info = {item}/>
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
