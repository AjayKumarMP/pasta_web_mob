import React from 'react';
import TotIt from './totit'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'


import '../shared.scss';
import '../styles/payment.scss';
import  '../styles/yourCart.scss';
// import bowlImage from '../assets/images/bowl.png';

// import { ReactComponent as Paytm } from '../assets/icons/paytm.svg';
import { ReactComponent as RazerPay } from '../assets/icons/razorpay.svg';
// import { ReactComponent as GooglePay } from '../assets/icons/goog.svg';
// import { ReactComponent as AmazonPay } from '../assets/icons/amazon.svg';
import { ReactComponent as BackLogo } from '../assets/icons/back2.svg';
import { ComponentHelpers , connect} from '../utils/componentHelper';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'

class ContactUs extends ComponentHelpers {

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
                loading: false,
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

    state={
        cartItems: [],
        loading: true,
        prices: [],
        paymentMethod: '',
        payment_info: undefined
    }

    async componentDidMount() {
        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        document.body.appendChild(script);
		try {
			this.setState({ loading: true })
			this.source = httpClient.getSource()
			const data = await httpClient.ApiCall('post', APIEndPoints.getCartItems, {
        coupon_id: parseInt(localStorage.getItem('coupon_id'))?parseInt(localStorage.getItem('coupon_id')): null
      }, this.source.token)
            this.cartPrices = []
            this.names = ""
            this.price = 0
            data.data.items.forEach((cartItem) => {
                Object.keys(cartItem).forEach((key, index) => {
                    if (Array.isArray(cartItem[key])) {
                        cartItem[key].forEach((data, ind) => {
                            if(ind > 0){
                                this.names += ', '
                            }
                            this.names += data.name
                            this.price += parseInt(data.price)
                        })
                    }  else {
                        this.names += cartItem[key] && cartItem[key].name ? cartItem[key].name : ''
                        this.price += cartItem[key] && cartItem[key].price ? parseInt(cartItem[key].price) : 0
                    }
                    if (index + 1 !== Object.keys(cartItem).length && cartItem[key] && cartItem[key].name) {
                        this.names += ", "
                    }
                })
                this.cartPrices.push({ names: this.names, price: this.price })
                this.names = ""
                this.price = 0
            })
            this.setState({
                cartItems: data.data,
                prices: this.cartPrices,
                loading: false
            })

		} catch (error) {
			if (error.message !== "unMounted") {
				this.setState({ loading: false })
			}
			console.log(error)
		}
    }

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
        this.props.history.push("/ordertracker")
      } catch (error) {
        console.log(error)        
      }
    }


    paymentHandler =()=> {
        switch(this.state.paymentMethod){
            case 'razerPay': {
                this.options["amount"] = parseInt(this.state.cartItems.grand_total * 100)
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
        const {cartItems, prices, loading, paymentMethod} = this.state
        return (
            <div className='container'>
            <Loading data={loading} />
              <div className='wrapper'>
                <div className='header'>
                  <Link to='my-order'>
                    <BackLogo />
                  </Link>
                  Your Payment
                </div>
        
                <div className='cartWrapper'>
                  <div>
                    {
                        cartItems.items && cartItems.items.map((cart, index)=>
                    <div key={index} className='cartCard'>
                      <div className='cartCardWrap'>
                        <div className='cart'>
                          <h4>{cart.name}</h4>
                          <p>{prices[index].names}</p>
        
                          <div className='cartCardMoney'>
                            <span>{prices[index].price}</span>
                            {/* <Link to='/my-order'> */}
                              <button className='cartCardFullBtn'>{cart.bowl !== null? cart.bowl.name: (cart.side?cart.side.name: (cart.extra?cart.extra.name: cart.curated &&cart.curated.name))}</button>
                            {/* </Link> */}
                          </div>
                        </div>
        
                        <div className='cartCardImg'>
                          <img alt='bowl' src={cart.bowl !== null? cart.bowl.picture: (cart.side?cart.side.picture: (cart.extra?cart.extra.picture: cart.curated &&cart.curated.picture))} />
                        </div>
                      </div>
                    </div>
                    )
                    }
        
                    <br />
                  </div>
        
                  <div>
                    <h4>Choose your payment method</h4>
        
                    <div>
                      <div className='paymentMethod' onClick={()=>this.setState({paymentMethod:'razerPay'})}>
                        <RazerPay style={{width: '29%'}}/>
                        {/* <p>Razer Pay</p> */}
                        <input onChange={()=>{}} checked={paymentMethod === 'razerPay'} type='radio' name='paymentOption' value='paytm' />
                      </div>
                    </div>

                    {/* <div>
                      <div className='paymentMethod'>
                        <Paytm />
                        <p>Paytm Pay</p>
                        <input type='radio' name='paymentOption' value='paytm' />
                      </div>
                    </div>
        
                    <div>
                      <div className='paymentMethod'>
                        <GooglePay />
                        <p>Google Pay</p>
                        <input type='radio' name='paymentOption' value='googleplay' />
                      </div>
                    </div>
        
                    <div>
                      <div className='paymentMethod'>
                        <AmazonPay />
                        <p>Amazon Pay</p>
                        <input type='radio' name='paymentOption' value='amazonpay' />
                      </div>
                    </div> */}
        
                    <div>
                      <div onClick={()=>this.setState({paymentMethod:'cod'})} className='paymentMethod'>
                        <div> </div>
                        <label htmlFor="paymentOption" style={{marginLeft: '-29%'}}>Cash on delivery</label>
                        <input onChange={()=>{}} checked={paymentMethod === 'cod'}  type='radio' name='paymentOption' value='cash' />
                      </div>
                    </div>
        
                    
                      <button onClick={()=>this.paymentHandler()} className='payNow'>Pay Now</button>
                    
                  </div>
                </div>
              </div>
            </div>
          )
    }

} 
export default connect(ContactUs);
