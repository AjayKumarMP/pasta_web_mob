import React from 'react';
import {connect} from 'react-redux'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import Cp from './cp'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
 let mapStateToProps=(state)=>{
    return {data:state}
  }
   

class ContactUs extends React.Component {
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
                this.setState({coupon_id: response.data.id})
                localStorage.setItem("coupon_id", response.data.id)
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
        const {loading, coupons, coupon_id} = this.state
        return(
            <div className="contactUsWrapp">
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
                                coupons.map((item,index)=>{
                                        return <Cp selected={coupon_id === item.id} key={index} handler={this.checkCoupon} info = {item}/>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

} 
export default connect(mapStateToProps)(ContactUs);
