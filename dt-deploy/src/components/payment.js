import React from 'react';
import TotIt from './totit'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'


import '../shared.scss';
import '../styles/payment.scss';
import '../styles/yourCart.scss';
// import bowlImage from '../assets/images/bowl.png';

// import { ReactComponent as Paytm } from '../assets/icons/paytm.svg';
import { ReactComponent as RazerPay } from '../assets/icons/razorpay.svg';
// import { ReactComponent as GooglePay } from '../assets/icons/goog.svg';
// import { ReactComponent as AmazonPay } from '../assets/icons/amazon.svg';
import { ReactComponent as BackLogo } from '../assets/icons/back2.svg';
import { ComponentHelpers, connect } from '../utils/componentHelper';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
import { pathToFileURL } from 'url';

class ContactUs extends ComponentHelpers {

  options = {
    "key": "rzp_test_ZELvYZc9wj5bXg",
    "amount": 100, // 2000 paise = INR 20, amount in paisa
    "name": "Guest",
    "description": "ordered Items",
    "image": '%PUBLIC_URL%/logo.png',
    "handler": async (response) => {
      this.setState({ loading: true })
      const payment = await httpClient.ApiCall('post', APIEndPoints.storePayment, { payment_info: JSON.stringify(response) })

      this.setState({
        loading: false,
        payment_info: payment
      })
      await this.saveOrder()
    },
    "prefill": {
      "name": "Harshil Mathur",
      "email": ""
    },
    "notes": {
      "address": "Hello World"
    },
    "theme": {
      "color": "#F37254"
    }
  };

  state = {
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
        coupon_id: parseInt(localStorage.getItem('coupon_id')) ? parseInt(localStorage.getItem('coupon_id')) : null
      }, this.source.token)
      this.cartPrices = []
      this.names = ""
      this.price = 0
      data.data.items.forEach((cartItem) => {
        Object.keys(cartItem).forEach((key, index) => {
          if (Array.isArray(cartItem[key])) {
            cartItem[key].forEach((data, ind) => {
              if (ind > 0) {
                this.names += ', '
              }
              this.names += data.name
              this.price += parseInt(data.price)
            })
          } else {
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

  saveOrder = async () => {
    try {
      this.setState({ loading: true })
      const order = await httpClient.ApiCall('post', APIEndPoints.saveOrder, {
        kitchen_id: this.props.data.kitchen_id,
        payment_id: this.state.payment_info && this.state.payment_info.data.id ? this.state.payment_info.data.id : 0,
        address_id: parseInt(localStorage.getItem('address')) ? parseInt(localStorage.getItem('address')) : 0,
        coupon_id: parseInt(localStorage.getItem('coupon_id')) ?
          parseInt(localStorage.getItem('coupon_id')) :
          0,
        payment_type: this.state.paymentMethod.toLowerCase() === 'cod' ? 'COD' : 'Online',
        payment_status: this.state.paymentMethod.toLowerCase() === 'cod' ? 'Pending' : 'Paid'
      })
      this.setState({ loading: false })
      localStorage.setItem('order_id', JSON.stringify({ id: order.data && order.data.order_id, unique_order_id: order.data && order.data.unique_order_id }))
      localStorage.removeItem('address')
      localStorage.removeItem('coupon_id')
      localStorage.removeItem('payment')
      localStorage.removeItem('URL')
      localStorage.removeItem('cartItems')
      this.props.history.push("/ordertracker")
    } catch (error) {
      console.log(error)
    }
  }


  paymentHandler = () => {
    const price = parseFloat(this.state.cartItems.grand_total.replace(/,/g, "") * 100)
    if (!price) {
      return this.NotificationManager.error("Please visit cart page", 'No Payment Details', 1500)
    }
    const address = parseInt(localStorage.getItem('address'))
    if (!address) {
      return this.NotificationManager.error("Please visit cart page", 'No Address Found', 1500)
    }

    switch (this.state.paymentMethod) {
      case 'razorPay': {
        const user = JSON.parse(localStorage.getItem('user'))
        this.options['email'] = user && user.email ? user.email : ''
        this.options['name'] = user && user.full_name ? user.full_name : ''
        this.options['prefill']['email'] = user && user.email ? user.email : ''
        this.options['prefill']['name'] = user && user.full_name ? user.full_name : ''
        this.options["amount"] = price
        let rzp = new window.Razorpay(this.options);
        rzp.open();
        break
      }
      case 'cod': {
        this.saveOrder()
        break
      }
      default: {
        this.NotificationManager.warning("Please select payment method", 'Warning', 1500)
        break
      }
    }


  }

  render() {
    const { cartItems, prices, loading, paymentMethod } = this.state
    return (
      <div className='container'>
        <Loading data={loading} />
        <div className='wrapper'>
          <div className='header'>
            <Link to='/cart'>
              <BackLogo />
            </Link>
            Your Payment
                </div>

          <div className='cartWrapper'>
            <div>
              {
                cartItems.items && cartItems.items.map((cart, index) =>
                  <div key={index} className='cartCard' style={{ height: '246px', marginBottom: '15px' }}>
                    <div className='cartCardWrap'>
                      <div className='cart'>
                        <h4>{cart.name}</h4>
                        <p>{prices[index].names}</p>

                        <div className='cartCardMoney' style={{ width: '30%' }}>
                          <span><p style={{ position: 'absolute', left: '-14px' }}>&#8377; </p>{prices[index].price}</span>
                          {/* <Link to='/my-order'> */}
                          <button className='cartCardFullBtn' style={{ width: '88%', marginLeft: '5%', marginTop: '-5px' }}>{cart.bowl !== null ? cart.bowl.name.split(" ")[0] : (cart.side ? cart.side.name : (cart.extra ? cart.extra.name : cart.curated && cart.curated.name))}</button>
                          {/* </Link> */}
                        </div>
                      </div>

                      <div>
                        {/* <img alt='bowl' src={cart.bowl !== null? cart.bowl.picture: (cart.side?cart.side.picture: (cart.extra?cart.extra.picture: cart.curated &&cart.curated.picture))} /> */}
                        {
                          cart.side || cart.extra || cart.curated ?
                            <div className="cartCardImg">

                              <img
                                alt='bowl'
                                src={cart.side
                                  ? cart.side.picture
                                  : (cart.extra
                                    ? cart.extra.picture
                                    : (cart.curated ? cart.curated.picture : './images/miniBowl.png'))} />
                            </div>
                            : <div className="inBowl">
                              <img style={{ marginTop: '-6px' }} src="./images/miniBowl.png" alt="loading" />
                              {cart.sauces && Object.keys(cart.sauces).length > 0 && (<img className="inBowlsauce" alt='sauce' src={cart.sauces[0].inbowl_picture} />)}
                              {cart.pastas && Object.keys(cart.pastas).length > 0 && (<img className="inBowlpasta" alt='pasta' src={cart.pastas[0].inbowl_picture} />)}
                              {cart.vegetables && cart.vegetables.map((veg, index) => {
                                return (<img key={index} className={`inBowlveggie0${index}`} alt={`veggie0${index}`} src={veg.inbowl_picture} />)
                              })}
                              {cart.garnishes && cart.garnishes.map((gar, index) => {
                                return (<img key={index} className={`inBowlgarnish0${index}`} alt={`garnish0${index}`} src={gar.inbowl_picture} />)
                              })}
                              {cart.meats && cart.meats.map((data, index) => {
                                return (<img key={index} className={`inBowlmeat0${index}`} alt={`meat0${index}`} src={data.inbowl_picture} />)
                              })}
                            </div>
                        }
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
                <div className='paymentMethod' onClick={() => this.setState({ paymentMethod: 'razorPay' })}>
                  <RazerPay style={{ width: '29%' }} />
                  {/* <p>Razer Pay</p> */}
                  <input onChange={() => { }} checked={paymentMethod === 'razorPay'} type='radio' name='paymentOption' value='paytm' />
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
                <div onClick={() => this.setState({ paymentMethod: 'cod' })} className='paymentMethod'>
                  <div> </div>
                  <label htmlFor="paymentOption" style={{ marginLeft: '-29%' }}>Cash on delivery</label>
                  <input onChange={() => { }} checked={paymentMethod === 'cod'} type='radio' name='paymentOption' value='cash' />
                </div>
              </div>


              <button onClick={() => this.paymentHandler()} className='payNow'>Pay Now</button>

            </div>
          </div>
        </div>
      </div>
    )
  }

}
export default connect(ContactUs);
