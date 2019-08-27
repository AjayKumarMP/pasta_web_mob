import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Crtitem from './cartItem';
import Slider from './swiper';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
import { ComponentHelpers, connect } from '../utils/componentHelper';
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
			addressModal: false,
			selectedAddress: '',
			guestPopup: false,
			prices: []
		};
	}

	async componentDidMount() {
		try {
			if (!this.props.data.isUserLoggedIn()) {
				localStorage.setItem('URL', '/cart')
				return this.setState({ guestPopup: true, loading: false });
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
			this.setState({ loading: true })
			this.source = httpClient.getSource()

			httpClient
				.ApiCall('post', APIEndPoints.getCartItems, {
					coupon_id: parseInt(localStorage.getItem('coupon_id')) ? parseInt(localStorage.getItem('coupon_id')) : null
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
								.push({ names: this.names, price: this.price })
							this.names = ""
							this.price = 0
						})
					this.setState({ cartItems: data.data, prices: this.cartPrices })
				}, err => {
					console.log(err)
				})
			httpClient
				.ApiCall('post', APIEndPoints.myAddressList, undefined, this.source.token)
				.then(response => {
					this.setState({
						address: response.data,
						selectedAddress: this.formatAddress(response.data[0])
					})
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

	componentWillUnmount() {
		this.source && this
			.source
			.cancel('unMounted')
	}

	selectExtras = async ({ id, name }) => {
		// console.log(id,name)
		this.setState({ loading: true })
		await this.addProductToCart({}, 0, id)
		this.setState({ loading: false })
		// this.props.placeOrder(Object.assign(this.props.data.placeOrder,{extra: {id, name}}))
	}

	updateCart = async (quantity, cart_id) => {
		this.setState({ loading: true })
		try {
			this.source = httpClient.getSource()
			await httpClient.ApiCall('post', APIEndPoints.updateCartItemQuantity, {
				cart_id,
				quantity,
				kitchen_id: this.props.data.kitchen_id
			}, this.source.token)
			this.setState({ loading: false })
		} catch (error) {
			if (error.message !== "unMounted") {
				this.setState({ loading: false })
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
		const { guestPopup } = this.state
		return (
			<div className='contactUsWrapp' style={{ paddingBottom: this.state.loading ? '70%' : '0%' }}>
				<Loading data={this.state.loading} />
				<div className='cnt-nav'>
					<Link to='/'>
						<img className='prevBtn' src='./images/prevBtn.png' />
					</Link>
					<h4>Cart</h4>
				</div>
				<Link to='/bowlselect1' className='btCartS'>
					Add pasta
				</Link>
				<div className='mainWrappForCart'>{
					this.state.cartItems.items && this.state.cartItems.items.map((cart, index) =>
						<div key={index}>
							<Crtitem
								details = {this.state.prices[index]}
								key={index}
								cartData={cart}
							/>
							{/* <div className='sideWrappf' hidden={!cart && cart["side"]&&cart["side"].name}>
								<h4>{cart["side"]&&cart["side"].name}</h4>
								<span>&#8377; {cart["side"]&&cart["side"].price}</span>
								<div className='changeBtn upChangeBtn'>
									<span
										onClick={() => {
											if (cart.quantity > 1) {
												cart.quantity--;
												this.updateCart(cart.quantity, cart.id)
											}
										}}
									>
										-
							</span>
									<div>{cart.quantity}</div>
									<span
										onClick={() => {
											if (cart.quantity < 50) {

												cart.quantity++;
												this.updateCart(cart.quantity, cart.id)
											}

										}}
									>
										+
							</span>
								</div>
							</div> */}
						</div>
					)
				}

					<div className='addDesertSect'>
						<h4>Add drinks &amp; desserts</h4>
						<Slider handlerFunc={this.selectExtras} info={this.state.extras} />
					</div>
					<div className='delivAddrChange'>
						<h5>ENTER DELIVERY ADDRESS</h5>
						<span onClick={() => this.setState({ addressModal: true })} className='changeAddrBtn'>Change</span>
						<p>{this.state.selectedAddress}</p>
					</div>
					<button disabled={this.state.selectedAddress === ''} onClick={() => this.props.history.push('/payment')} className='proccedLinkCrt'>PROCEED</button>
				</div>
				<Popup
					open={this.state.addressModal}
					onClose={() => this.setState({ addressModal: false })}>
					<div className="addressHeader" style={{ padding: '5%' }}>
						<h3>Select Adress</h3><hr />
						{/* <ul> */}
						{this.state.address.map((addres, index) => <div key={index} className="row" onClick={() => this.addAddress(addres)}>
							<input type="radio" name="address" />
							<label>{this.formatAddress(addres)}</label>
							<br />
						</div>)
						}
					</div>
				</Popup>
				<Popup position="right center" open={guestPopup} onClose={() => this.setState({ guestPopup: false })}>
					<div className="addressHeader" >
						<a className="close" onClick={()=>this.setState({ guestPopup: false })}>
							&times;
        				</a>
						<h3>How you like to proceed?</h3>

						<hr />
						<div style={{ padding: '1%' }}>
							<button className="credBtn" style={{ background: '#1565C0' }} onClick={() => this.props.history.push('/login')}>Login</button>
							<button className="credBtn" style={{ background: '#80CBC4' }} onClick={() => this.props.history.push('/register')}>Register</button>
							<button className="credBtn" onClick={() => this.props.history.push('/addaddress')}>As Guest</button>
						</div>
					</div>
				</Popup>
			</div>
		);
	}
}
export default connect(Cart);
