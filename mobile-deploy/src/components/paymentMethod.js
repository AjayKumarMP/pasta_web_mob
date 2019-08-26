import React from 'react';
import {connect} from 'react-redux'
import Method from './payMeth'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
 let mapStateToProps=(state)=>{
    return {data:state}
  }

class ContactUs extends React.Component {
    
    state ={
        paymentMethod: '',
        loading: false
    }
    componentDidMount(){
        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        document.body.appendChild(script);
    }

    options = {
        "key": "rzp_test_ZELvYZc9wj5bXg",
        "amount": 1000, // 2000 paise = INR 20, amount in paisa
        "name": "Guest",
        "description": "ordered Items",
        "image": "/your_logo.png",
        "handler":  async (response)=>{
          this.setState({loading: true})
            const payment = await httpClient.ApiCall('post', APIEndPoints.storePayment, {payment_info: JSON.stringify(response)})

            this.setState({
                payment_info: payment
                })
            await this.saveOrder()
        },
        "prefill": {
        "name": "Harshil Mathur",
        "email": "harshil@razorpay.com"
        },
        "notes": {
        "address": "Hello World"
        },
        "theme": {
        "color": "#F37254"
        }
        };

    saveOrder= async ()=>{
        try {
          this.setState({loading: true})
          const order = await httpClient.ApiCall('post', APIEndPoints.saveOrder, {
              kitchen_id: this.props.data.kitchen_id,
              payment_id: this.state.payment_info && this.state.payment_info.data.id?this.state.payment_info.data.id: 0,
              address_id: parseInt(localStorage.getItem('address'))?parseInt(localStorage.getItem('address')): 0,
              coupon_id: parseInt(localStorage.getItem('coupon_id'))?
              parseInt(localStorage.getItem('coupon_id')):
              0,
              payment_type:this.state.paymentMethod.toLowerCase() ==='cod'?'COD': 'Online',
              payment_status: this.state.paymentMethod.toLowerCase() ==='cod'?'Pending': 'Paid'
          })            
          this.setState({loading: false})
          localStorage.setItem('order_id', order.data && order.data.order_id)
          localStorage.removeItem('address')
          localStorage.removeItem('coupon_id')
          localStorage.removeItem('payment')
          this.props.history.push("/ordertracker")
        } catch (error) {
          console.log(error)        
        }
      }
  
  
      paymentHandler =()=> {
          console.log(localStorage.getItem('payment'), this.state.paymentMethod)
          switch(this.state.paymentMethod){
              case 'razorPay': {
                  this.options["amount"] = parseInt(parseInt(localStorage.getItem('payment') * 100))
                  let rzp = new window.Razorpay(this.options);
                  rzp.open();
                  break
              }
              case 'cod': {
                  this.saveOrder()
                  break
              }
              default: break
          }
          
          }
        
    render(){
        const {loading} =this.state
        return(
            <div className="contactUsWrapp">
            <Loading data={loading} />
              <div className="cnt-nav">
                <Link to="/payment"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
                <h4>Payment</h4>
              </div>
              <div className="methCont" style={{marginBottom: '110%'}}>
                  {
                      this.props.data.paymentMethod.map((item,index)=>{
                        return <Method handler={(type)=>this.setState({paymentMethod: type})} info = {item} key ={index} />
                      })
                  }
              </div>
              <button disabled={this.state.paymentMethod === ''} onClick={()=>this.paymentHandler()} className="proceedBtn">PROCEED</button>
            </div>
        )
    }

} 
export default connect(mapStateToProps)(ContactUs);
