import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
import { ComponentHelpers, connect } from '../utils/componentHelper';

import { ReactComponent as GreenPin } from '../assets/icons/pin.svg';
import '../shared.scss';
import '../styles/yourCart.scss';

import { ReactComponent as BackLogo } from '../assets/icons/back2.svg';
import Modal from './Modal/Modal';
import Popup from 'reactjs-popup';
import { FaTrash } from 'react-icons/fa'
import { IconContext } from 'react-icons'

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
            guestPopup: false,
            showPopup: false,
            popupData: ''
        };
    }

    async componentDidMount() {
        try {
            if (!this.props.data.isUserLoggedIn()) {
                localStorage.setItem('URL', '/cart')
                return this.setState({ guestPopup: true, loading: false });
                // return this.props.history.push('/login')
            } else {
                const curated = JSON.parse(localStorage.getItem('curated'))
                if (curated && curated.length > 0) {
                    Promise.all(
                        curated.map(data => this.addProductToCart({}, 0, 0, 1, data))
                    )
                }
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
                localStorage.removeItem('curated')
            }
            this.setState({ loading: true })
            this.getMyCartItems()
            httpClient
                .ApiCall('post', APIEndPoints.myAddressList, undefined, this.source.token)
                .then(response => {
                    this.setState({
                        address: response.data,
                        selectedAddress: this.formatAddress(response.data[0])
                    })
                    localStorage.setItem('address', response.data[0] && response.data[0].id)
                }, err => {
                    console.log(err)
                })
            const extras = await httpClient.ApiCall('post', APIEndPoints.getExtras, {
                kitchen_id: this.props.data.kitchen_id
            }, this.source.token)
            this.setState({ extras: extras.data, loading: false })

        } catch (error) {
            if (error.message !== "unMounted") {
                this.setState({ loading: false })
            }
            console.log(error)
        }
    }

    getMyCartItems = async () => {
        this.source = httpClient.getSource()
        const coupon_id = parseInt(localStorage.getItem('coupon_id')) ? { coupon_id: parseInt(localStorage.getItem('coupon_id')) } : undefined
        try {
            const data = await httpClient
                .ApiCall('post', APIEndPoints.getCartItems, coupon_id, this.source.token)
            this.cartPrices = []
            this.names = ""
            this.price = 0
            if (data.data) {
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
                            .push({ names: this.names, price: this.price })
                        this.names = ""
                        this.price = 0
                    })
                this.setState({ cartItems: data.data, prices: this.cartPrices, loading: false })
            }
        } catch (error) {
            console.log(error)
            this.setState({ loading: false })
        }
    }

    componentWillUnmount() {
        this.source && this
            .source
            .cancel('unMounted')
    }

    selectExtras = async ({ id, name }) => {
        this.setState({ loading: true })
        await this.addProductToCart({}, 0, id)
        await this.getMyCartItems()
    }

    updateCartQuantity = async (quantity, cart_id) => {
        this.setState({ loading: true })

        try {
            this.source = httpClient.getSource()
            await httpClient.ApiCall('post', APIEndPoints.updateCartItemQuantity, {
                cart_id,
                quantity
            }, this.source.token)
            this.getMyCartItems()
            this.NotificationManager.success("Updated Successfully", 'Success')
        } catch (error) {
            this.NotificationManager.error("Error while updating", 'Error')
            if (error.message !== "unMounted") {
                this.setState({ loading: false })
            }
            console.log(error)
        }
    }

    updateCartItem = async (id) => {
        const cartItems = this.state.popupData
        await this.updateItemInCart({ bowl: { id }, name: cartItems.name }, cartItems && cartItems.id, 0, 0, cartItems.quantity)
        this.setState({
            loading: true,
            showPopup: false,
        })
        this.getMyCartItems()
        this.setState({ loading: false })
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

    deleteCartItem = async (cart_id) => {
        this.setState({ loading: true })
        try {
            this.source = httpClient.getSource()
            await httpClient.ApiCall('post', APIEndPoints.deleteCartItem, {
                cart_id,
                kitchen_id: this.props.data.kitchen_id
            }, this.source.token)
            this.setState({ loading: false })
            this.getMyCartItems()
            this.NotificationManager.success('Succefully deleted Item', 'Success', 1500)
        } catch (error) {
            if (error.message !== "unMounted") {
                this.NotificationManager.error("Error while deleting item", 'Error', 1500)
                this.setState({ loading: false })
            }
        }
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
                <Loading data={loading} />
                <div>
                    <title>Your cart</title>
                </div>
                <div hidden={guestPopup} className="container">
                    <div className="wrapper">
                        <Modal showModal={showModal} />
                        <div className="header">
                            <Link to="/">
                                <BackLogo />
                            </Link>
                            Your cart
                        </div>

                        <Link style={{ marginLeft: '40%' }} to='/bowlselect1'>
                            <button className="addBtn">
                                Add pasta
                                    </button>
                        </Link>
                        <section className="cartWrapper">
                            <div className="column">

                                {cartItems.items && cartItems
                                    .items
                                    .map((cart, index) =>
                                        <div className="cartCard" style={{ marginBottom: cartItems.items.length > 2 ? '1%' : '-169px', height: '250px' }} key={index}>
                                            <div style={{height: '65%'}} className="cartCardWrap">
                                                <div className="cart">
                                                    <h4>{cart.name}</h4>
                                                    <p>{prices[index].names}</p>

                                                    <div className="cartCardMoney">
                                                        <span>&#x20B9; {(prices[index].price * cart.quantity)}</span>
                                                        {cart['bowl'] ?
                                                            <div onClick={() => this.setState({ popupData: cart, showPopup: true })} className='cartCardFullBtn'>
                                                                {cart['bowl']
                                                                    ? cart['bowl']
                                                                        .name
                                                                        .split(" ")[0]
                                                                    : 'None'}
                                                            </div> : ""
                                                        }
                                                    </div>
                                                    <div className="deleteIcon" style={{ bottom:'18%' }} onClick={() => this.deleteCartItem(cart.id)}>
                                                        <IconContext.Provider value={{ className: 'react-icons' }}>
                                                            <FaTrash style={{ marginTop: '-23%', cursor: 'pointer', marginLeft: '2%' }} size="1.5em" />
                                                        </IconContext.Provider>
                                                    </div>
                                                </div>

                                                <div>
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
                                                                <img src="./images/miniBowl.png" alt="loading" />
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

                                            <br />

                                            <div className="cartCardEdit">
                                                <div className="incrementBody">
                                                    <button
                                                        disabled={cart.quantity < 2}
                                                        onClick={() => {
                                                            if (cart['quantity'] > 1) {
                                                                this.updateCartQuantity(--cart.quantity, cart.id)
                                                            }
                                                        }}
                                                        className="incrementBtn">
                                                        -
                                                </button>
                                                    <span>{cart.quantity}</span>
                                                    <button
                                                        disabled={cart.quantity > 50}
                                                        onClick={() => {
                                                            if (cart['quantity'] < 50) {
                                                                this.updateCartQuantity(++cart.quantity, cart.id)
                                                            }
                                                        }}
                                                        className="incrementBtn">
                                                        +
                                                </button>
                                                </div>

                                                <div>
                                                    <Link
                                                        hidden={cart.side || cart.extra || cart.curated}
                                                        to={{
                                                            pathname: '/editpasta',
                                                            state: cart
                                                        }}>
                                                        <button className="editBtn">Edit pasta</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>)
                                }

                                <br />
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
                                            <img alt='choco' src={extra.picture} />
                                            <p>{extra.name}</p>
                                            <div className="drinkCardFooter">
                                                <GreenPin />
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
                                                onClick={() => this.setState({ addressChange: true })}
                                                to='/address'>
                                                <p>Change</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p>{selectedAddress}</p>
                                        </div>
                                    </div>

                                    <br />
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
                    open={false}
                    onClose={() => this.setState({ addressChange: false })}>
                    <div className="addressHeader">
                        <h3>Select Adress</h3>
                        {/* <ul> */}
                        {address.map((addres, index) => <div key={index} className="row" onClick={() => this.addAddress(addres)}>
                            <input type="radio" name="address" />
                            <label>{this.formatAddress(addres)}</label>
                            <br />
                        </div>)
                        }
                    </div>
                </Popup>

                <Popup className="access" position="right center" open={guestPopup} onClose={() => this.setState({ guestPopup: false })}>
                    <div className="addressHeader">
                        <h3 style={{ padding: '2%' }}>How would you like to proceed?</h3>
                        <hr />
                        <div style={{ paddingTop: '1%' }}>
                            <button className="credBtn" onClick={() => this.props.history.push('/login')}>Login</button>
                            <button className="credBtn" onClick={() => this.props.history.push('/register')}>Register</button>
                            <button className="credBtn" onClick={() => this.props.history.push('/addaddress')}>As Guest</button>
                        </div>
                    </div>
                </Popup>
                <div className="appContainer">

                    <Popup className="access" position="right center" open={addressChange} onClose={() => this.setState({ addressChange: false })}>

                        <div className='addressHeader modalContent'>
                            <div className="modal-header" style={{ display: 'flex' }}>
                                <Link onClick={() => localStorage.setItem('URL', '/cart')} to="/addaddress"
                                    style={{ color: '#67023f', marginTop: '1.5%', position: 'relative', width: '23%', left: '1px' }}>+ Address</Link>
                                <h2 style={{ fontSize: '1.6rem' }}>Select Address</h2>
                                <span onClick={() => this.setState({ addressChange: false })} className="close">&#x2714;</span> {/*&times; 	*/}
                            </div>
                            <div className='modal-body'>
                                <ul className="addressHead" >
                                    {address.map((addres, index) =>
                                        <li key={index} className="row" style={{ alignItems: 'baseline' }} onClick={() => this.addAddress(addres)}>
                                            <input type="radio" id="f-option" name="selector"
                                                onChange={() => { }} checked={this.state.selectedAddress === this.formatAddress(addres)} />
                                            <label htmlFor="f-option">{this.formatAddress(addres)}</label>
                                            <div className="check"></div>

                                        </li>
                                    )
                                    }
                                </ul>
                            </div>
                        </div>
                    </Popup>
                    <Popup className="itemCart otp" position="right center" open={this.state.showPopup} onClose={() => this.setState({ showPopup: false })}>

                        <div className='editPastaPopup modalContent'>
                            <div className="modal-header" style={{ padding: '10px' }}>
                                <span onClick={() => this.setState({ showPopup: false })} className="close">&times;</span>
                                <h2>Select Bowl</h2>
                            </div>
                            <div className='modal-body'>
                                <div className='cntr' style={{ textAlign: 'center' }}>
                                    <p>Your previous customisation</p>
                                    <span style={{ color: '#67023f' }}>{this.state.popupData.bowl && this.state.popupData.bowl.name}</span><br />
                                    <button className="bownBtn" onClick={() => this.updateCartItem(1)}>Mini bowl</button>
                                    <button className="bownBtn" onClick={() => this.updateCartItem(2)}>Regular bowl</button>
                                </div>
                            </div>
                        </div>
                    </Popup>
                </div>
            </div>

        )
    }
}

export default connect(Cart)