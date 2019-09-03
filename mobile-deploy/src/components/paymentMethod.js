import React from 'react';
import Method from './payMeth'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
import { ComponentHelpers, connect } from '../utils/componentHelper';


class ContactUs extends ComponentHelpers {

  state = {
    paymentMethod: '',
    loading: false,
    cartItems: ''
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
      this.setState({
        cartItems: data.data,
        loading: false
      })

    } catch (error) {
      if (error.message !== "unMounted") {
        this.setState({ loading: false })
      }
    }
  }

  options = {
    "key": "rzp_test_ZELvYZc9wj5bXg",
    "amount": 1, // 2000 paise = INR 20, amount in paisa
    "name": "Guest",
    "description": "ordered Items",
    "image": "./images/logo.png",
    "handler": async (response) => {
      this.setState({ loading: true })
      const payment = await httpClient.ApiCall('post', APIEndPoints.storePayment, { payment_info: JSON.stringify(response) })

      this.setState({
        payment_info: payment
      })
      await this.saveOrder()
    },
    "prefill": {
      "name": "",
      "email": this.props.data.userDetails.email
    },
    "notes": {
      "address": "Hello World"
    },
    "theme": {
      "color": "#F37254"
    }
  };

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
      this.props.history.push("/thanksfororder")
    } catch (error) {
      console.log(error)
    }
  }


  paymentHandler = () => {
    const price = parseFloat(this.state.cartItems.grand_total.replace(/,/g,"") * 100)
    if (!price) {
      return this.NotificationManager.error("Please visit cart page", 'No Payment Details',1500)
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
    const { loading } = this.state
    return (
      <div className="contactUsWrapp">
        <Loading data={loading} />
        <div className="cnt-nav">
          <Link to="/payment"><img className="prevBtn" src="./images/prevBtn.png" /></Link>
          <h4>Payment</h4>
        </div>
        <div className="methCont" style={{ marginBottom: '110%' }}>
          {
            this.props.data.paymentMethod.map((item, index) => {
              return <Method handler={(type) => this.setState({ paymentMethod: type })} info={item} key={index} />
            })
          }
        </div>
        <button disabled={this.state.paymentMethod === ''} onClick={() => this.paymentHandler()} className="proceedBtn">PROCEED</button>
      </div>
    )
  }

}
export default connect(ContactUs);
