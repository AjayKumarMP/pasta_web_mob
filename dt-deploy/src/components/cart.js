import React from 'react';
import {Route, Link, BrowserRouter as Router} from 'react-router-dom';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
import {ComponentHelpers, connect} from '../utils/componentHelper';

import {ReactComponent as GreenPin} from '../assets/icons/pin.svg';
import '../shared.scss';
import '../styles/yourCart.scss';

import {ReactComponent as BackLogo} from '../assets/icons/back2.svg';
import Modal from './Modal/Modal';
import Popup from 'reactjs-popup';

class Cart extends ComponentHelpers {
    constructor(props) {
        super(props);

        this.state = {
            numChanged: false,
            cartItems: {},
            loading: true,
            extras: [],
            address: [],
            showModal: false,
            prices: [],
            selectedExtras: [],
            addressChange: false,
            selectedAddress: '',
            guestPopup: false
        };
    }

    async componentDidMount() {
        try {
            if (!this.props.data.isUserLoggedIn()) {
                localStorage.setItem('URL', '/cart')
                return this.setState({guestPopup: true, loading: false});
                // return this.props.history.push('/login')
            } else {
                let item = JSON.parse(localStorage.getItem('cartItem'))
                if (item !== null) {
                    this.addProductToCart(item)
                }
                const sides = JSON.parse(localStorage.getItem('sides'))
                if (sides !== null) {
                    await Promise.all(sides.map((data) => {
                        return this.addProductToCart({}, data.id)
                    }))
                }
                localStorage.removeItem('cartItem')
                localStorage.removeItem('sides')
                localStorage.removeItem('URL')
            }
            this.setState({loading: true})
			this.source = httpClient.getSource()
			
            httpClient
                .ApiCall('post', APIEndPoints.getCartItems, {
					coupon_id: parseInt(localStorage.getItem('coupon_id'))?parseInt(localStorage.getItem('coupon_id')): null
				}, this.source.token)
                .then(data => {
                    this.cartPrices = []
                    this.names = ""
                    this.price = 0
                    data
                        .data
                        .items
                        .forEach((cartItem) => {
                            Object
                                .keys(cartItem)
                                .forEach((key, index) => {
                                    if (Array.isArray(cartItem[key])) {
                                        cartItem[key].forEach((data, ind) => {
                                            this.names += data.name
                                            this.price += parseInt(data.price)
                                            this.names += ', '
                                        })
                                    } else {
                                        this.names += cartItem[key] && cartItem[key].name
                                            ? cartItem[key].name
                                            : ''
                                        this.price += cartItem[key] && cartItem[key].price
                                            ? parseInt(cartItem[key].price)
                                            : 0
                                    }
                                    if (index + 1 !== Object.keys(cartItem).length && cartItem[key] && cartItem[key].name) {
                                        this.names += ", "
                                    }
                                })
                            this.names = this
                                .names
                                .replace(/,\s*$/, "");
                            this
                                .cartPrices
                                .push({names: this.names, price: this.price})
                            this.names = ""
                            this.price = 0
                        })
                    this.setState({cartItems: data.data, prices: this.cartPrices})
                },err=>{
                    console.log(err)
                })
            httpClient
                .ApiCall('post', APIEndPoints.myAddressList, undefined, this.source.token)
                .then(response => {
                    this.setState({
                        address: response.data,
                        selectedAddress: this.formatAddress(response.data[0])
                    })
                }, err=>{
                    console.log(err)
                })
            const extras = await httpClient.ApiCall('post', APIEndPoints.getExtras, {
                kitchen_id: this.props.data.kitchen_id
            }, this.source.token)
            this.setState({extras: extras.data, loading: false})

        } catch (error) {
            if (error.message !== "unMounted") {
                this.setState({loading: false})
            }
            console.log(error)
        }
    }

    componentWillUnmount() {
        this.source && this
            .source
            .cancel('unMounted')
    }

    selectExtras = async(extra) => {
        this.setState({loading: true})
        this.newItem = true
        let extras = this.state.selectedExtras
        const index = extras.indexOf(extra)
        if (index > -1) {
            extras.splice(index, 1)
            await this.deleteItemFromCart(extra.id)
            this.newItem = false

        } else {
            extras.push(extra)
            await this.addProductToCart({}, 0, extra.id)
        }
        this.setState({loading: false, selectedExtras: extras})
    }

    updateCart = async(quantity, cart_id) => {
        this.setState({loading: true})
        try {
            this.source = httpClient.getSource()
            await httpClient.ApiCall('post', APIEndPoints.updateCartItemQuantity, {
                cart_id,
                quantity,
                kitchen_id: this.props.data.kitchen_id
            }, this.source.token)
            this.setState({loading: false})
        } catch (error) {
            if (error.message !== "unMounted") {
                this.setState({loading: false})
            }
            console.log(error)
        }
    }

    formatAddress(addr) {
        if (!addr) {
            return ''
        }
        return ((addr.flat_no
            ? addr.flat_no + ", "
            : '') + (addr.street
            ? addr.street + ", "
            : '') + (addr.city
            ? addr.city + ", "
            : '') + (addr.locality
            ? addr.locality
            : ''))
    }

    addAddress(addres) {
        this.setState({
            selectedAddress: this.formatAddress(addres)
        });
        localStorage.setItem('address', addres.id)
    }

    render() {
        const {
            addressChange,
            showModal,
            guestPopup,
            cartItems,
            loading,
            extras,
            prices,
            address,
            selectedExtras,
            selectedAddress
        } = this.state
        return (
            <div>
                <Loading data={loading}/>
                <div>
                    <title>Your cart</title>
                </div>
                <div hidden={guestPopup} className="container">
                    <div className="wrapper">
                        <Modal showModal={showModal}/>
                        <div className="header">
                            <Link to="/">
                                <BackLogo/>
                            </Link>
                            Your cart
                        </div>

                        <section className="cartWrapper">
                            <div className="column">
                                <Link to='/bowlselect1'>
                                    <button className="addBtn">
                                        Add pasta
                                    </button>
                                </Link>

                                {/* Card 1 */}
                                {cartItems.items && cartItems
                                    .items
                                    .map((cart, index) => 
									<div className="cartCard" key={index}>
                                        <div className="cartCardWrap">
                                            <div className="cart">
                                                <h4>{cart.name}</h4>
                                                <p>{prices[index].names}</p>

                                                <div className="cartCardMoney">
                                                    <span>&#x20B9; {prices[index].price}</span>
                                                    {/* <button
															className="cartCardFullBtn"
															onClick={() => {
																this.setState({ showModal: true })
															}}
														>
															{cart.bowl !== null? cart.bowl.name: cart.side.name}
														</button> */}
                                                </div>
                                            </div>

                                            <div className="cartCardImg">
                                                <img
                                                    alt='bowl'
                                                    src={cart.bowl !== null
                                                    ? cart.bowl.picture
                                                    : (cart.side
                                                        ? cart.side.picture
                                                        : (cart.extra
                                                            ? cart.extra.picture
                                                            : cart.curated.picture))}/>
                                            </div>
                                        </div>

                                        <br/>

                                        <div className="cartCardEdit">
                                            <div className="incrementBody">
                                                <button
                                                    disabled={cart.quantity < 2}
                                                    onClick={() => this.updateCart(--cart.quantity, cart.id)}
                                                    className="incrementBtn">
                                                    -
                                                </button>
                                                <span>{cart.quantity}</span>
                                                <button
                                                    disabled={cart.quantity > 10}
                                                    onClick={() => this.updateCart(++cart.quantity, cart.id)}
                                                    className="incrementBtn">
                                                    +
                                                </button>
                                            </div>

                                            {/* <div>
													<Link to='/edit-pasta'>
														<button className="editBtn">Edit pasta</button>
													</Link>
												</div> */}
                                        </div>
                                    </div>)
}

                                <br/>
                            </div>
                            <div>
                                <div className="drink">
                                    <h4>Add drinks & desserts</h4>
                                    <div className="drinkRow">
                                        {extras.map((extra, index) => <div
                                            onClick={() => this.selectExtras(extra)}
                                            key={index}
                                            className={[
                                            'drinkCard', selectedExtras.indexOf(extra) > -1
                                                ? 'activeborder'
                                                : ''
                                        ].join(' ')}>
                                            <img alt='choco' src={extra.picture}/>
                                            <p>{extra.name}</p>
                                            <div className="drinkCardFooter">
                                                <GreenPin/>
                                                <span>&#x20B9; {extra.price}</span>
                                            </div>
                                        </div>)
}
                                    </div>

                                    <div className="deliveryBox">
                                        <div>
                                            <h4>ENTER DELIVERY ADDRESS</h4>
                                            <div
                                                style={{
                                                cursor: 'pointer'
                                            }}
                                                onClick={() => this.setState({addressChange: true})}
                                                to='/address'>
                                                <p>Change</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p>{selectedAddress}</p>
                                        </div>
                                    </div>

                                    <br/>
                                    <div className="coupon">
                                        <button onClick={() => this.props.history.push('/apply')} className="couponHeader">
                                            <p>Apply coupons</p>
                                            <p>
                                                >
                                            </p>
                                        </button>

                                        <div className="couponsItems">
                                            <ul>
                                                <li>Item total</li>
                                                <li>Packing & shipping charges</li>
                                                <li>Taxes & charges</li>
                                                <li>
                                                    <span className="discountText">Discount</span>
                                                </li>
                                                <li>
                                                    <span className="totalText">Grand Total</span>
                                                </li>
                                            </ul>

                                            <ul className="couponPrices">
                                                <li>{cartItems.subtotal}</li>
                                                <li>{cartItems.charges && (parseInt(cartItems.charges[2]
                                                        ? cartItems.charges[2].amount
                                                        : 0 + parseInt(cartItems.charges[0]
                                                            ? cartItems.charges[0].amount
                                                            : 0)))}</li>
                                                <li>{cartItems.charges && parseInt(cartItems.charges[1] && cartItems.charges[1].amount)}</li>
                                                <li>
                                                    <span className="discountText">{cartItems.discount}</span>
                                                </li>
                                                <li>
                                                    <span className="totalText">{cartItems.grand_total}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        {/* <Link to='/payment'> */}
                                        <button disabled={this.state.selectedAddress === ''} onClick={() => this.props.history.push('/payment')} className="couponBtn">Proceed</button>
                                        {/* </Link> */}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <Popup
                    open={addressChange}
                    onClose={() => this.setState({addressChange: false})}>
                    <div className="addressHeader">
                        <h3>Select Adress</h3>
                        {/* <ul> */}
                        {address.map((addres, index) => <div key={index} className="row" onClick={() => this.addAddress(addres)}>
                            <input type="radio" name="address"/>
                            <label>{this.formatAddress(addres)}</label>
                            <br/>
                        </div>)
}
                    </div>
                </Popup>

                <Popup position="right center" open={guestPopup} onClose={() => this.setState({guestPopup: false})}>
                    <div className="addressHeader">
                        <h3>How Would you like to proceed?</h3>
                        <hr />
                        <div style={{paddingTop: '10%'}}>
                            <button className="credBtn" style={{background: '#1565C0'}} onClick={() => this.props.history.push('/login')}>Login</button>
                            <button className="credBtn" style={{background: '#80CBC4'}} onClick={() => this.props.history.push('/register')}>Register</button>
                            <button className="credBtn" onClick={() => this.props.history.push('/addaddress')}>Continue as Guest</button>
                        </div>
                    </div>
                </Popup>
            </div>

)
	}
}

export default connect(Cart)