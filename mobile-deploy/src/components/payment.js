import React from 'react';
import TotIt from './totit'
import {Route,Link,BrowserRouter as Router} from 'react-router-dom'
import { ComponentHelpers, connect } from '../utils/componentHelper';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
 
class ContactUs extends ComponentHelpers {
    

    state={
        cartItems: [],
        loading: true,
        prices: [],
        paymentMethod: '',
        payment_info: undefined
    }

    async componentDidMount() {
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

    render(){
        const {cartItems, loading} = this.state
        return(
            <div className="contactUsWrapp">
            <Loading data={loading}/>
              <div className="cnt-nav">
                <Link to="/"><img className="prevBtn" src="./images/prevBtn.png"/></Link>
                <h4>Payment</h4>
              </div>
                <div className="pmntMainWrapp" style={{marginBottom:'67%'}}>
                    <div className="usePastaC">
                       <div className="head">
                            <h5>Use Pasta Project credits ($ 50)</h5>
                            <p>Use Pasta Project credits</p>
                            <hr/>
                       </div>
                       <div className="under">
                           <Link to="/apply" >Apply coupons</Link>
                       </div>
                    </div>
                    <div className="grTotWrapp">
                        <div className="leftSide">
                                <p className="p1">item Total</p>
                                <p className="p2">Packing & shipping charges</p>
                                <p className="p2">Taxes & charges</p>
                                <p className="p3">Discount</p>
                                <h5>Grand Total</h5>
                            </div>  
                        <div className="rightSide">
                        <p className="p1">{cartItems.subtotal}</p>
                                <p className="p2">{cartItems.charges && (parseInt(cartItems.charges[2]
                                                        ? cartItems.charges[2].amount
                                                        : 0 + parseInt(cartItems.charges[0]
                                                            ? cartItems.charges[0].amount
                                                            : 0)))}</p>
                                <p className="p3">{cartItems.charges && parseInt(cartItems.charges[1] && cartItems.charges[1].amount)}</p>
                                <p className="p2">{cartItems.discount}</p>
                                <h5>{cartItems.grand_total}</h5>
                            </div>  
                    </div>

                    <div className="itmWrapp">
                        {/* {
                            cartItems.items && cartItems.items.map((item,index)=>
                                <TotIt price={this.state.prices[index].price} key={index} info={item} />
                            )
                        } */}
                    </div>
                </div>
                <Link onClick={()=>localStorage.setItem('payment', cartItems.grand_total)} to="/paymentmethods" className='proccedLinkCrt'>PROCEED</Link>
            </div>
        )
    }

} 
export default connect(ContactUs);
