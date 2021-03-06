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
				localStorage.removeItem('chefCurated')
				localStorage.removeItem('curated')
			}
			this.setState({ loading: true })
			this.source = httpClient.getSource()
			this.getMyCartItems()
			httpClient
				.ApiCall('post', APIEndPoints.myAddressList, undefined, this.source.token)
				.then(response => {
					if (response.data) {
						this.setState({
							address: response.data,
							selectedAddress: this.formatAddress(response.data[0])
						})
						localStorage.setItem('address',response.data[0] && response.data[0].id)
					}
				}, err => {
					console.log(err)
				})
			const extras = await httpClient.ApiCall('post', APIEndPoints.getExtras, {
				kitchen_id: this.props.data.kitchen_id
			}, this.source.token)
			if (extras.data)
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
			this.setState({ loading: false, cartItems: [] })
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
		await this.getMyCartItems()
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
			// this.setState({ loading: false })
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

	proceedNext=()=>{
        if(this.state.selectedAddress === ''){
            return this.NotificationManager.warning('Please add/select Address', 'No delivery Address selected')
        }
        if(this.state.cartItems && Object.keys(this.state.cartItems).length === 0){
            return this.NotificationManager.warning('Cannot proceed without cart items', 'No Items in your Cart')
        }
        return this.props.history.push('/payment')
    }

	render() {
		const { guestPopup, prices } = this.state
		return (
			<div className='contactUsWrapp' style={{ overflowY: 'scroll', height: '82%', paddingBottom: this.state.loading ? '70%' : '0%', display: 'block' }}>
				<Loading data={this.state.loading} />
				<div className='cnt-nav'>
					<Link to='/'>
						<img className='prevBtn' src='./images/prevBtn.png' />
					</Link>
					<h4>Your Cart</h4>
				</div>
				<Link to='/bowlselect1' className='proccedLinkCrt' style={{ marginLeft: '63%', position: 'relative', width: '34%', borderRadius: '7px', padding: '9px 20px 9px 20px' }}>
					Add pasta
				</Link>
				<div className='mainWrappForCart'>
					{this.state.cartItems.items && this.state.cartItems.items.map((cart, index) =>
						<div key={index}>
							<Crtitem
								handleFun={async() => await this.getMyCartItems()}
								details={prices[index]}
								key={index}
								cartData={cart}
							/>
		
						</div>
					)
					}

					<div className='addDesertSect'>
						<h4>Add drinks &amp; desserts</h4>
						<Slider handlerFunc={this.selectExtras} info={this.state.extras} />
					</div>
					<div className='delivAddrChange'>
						<h5>ENTER DELIVERY ADDRESS
						<span onClick={() => this.setState({ addressModal: true })} className='changeAddrBtn'>Change</span>
						</h5>
						<p>{this.state.selectedAddress}</p>
					</div>
					<button style={{ zIndex: '998' }}
						onClick={() => this.proceedNext()} className='proccedLinkCrt'>PROCEED</button>
				</div>

				<Popup className="itemCart" position="right center" open={this.state.addressModal} onClose={() => this.setState({ addressModal: false })}>

					<div className='editPastaPopup modalContent'>
						<div className="modal-header" style={{ display: 'flex' }}>
							<Link onClick={() => localStorage.setItem('URL', '/cart')} to="/addaddress" style={{ color: '#67023f', marginTop: '1.5%', position: 'relative', width: '23%', left: '-10px' }}>+ Address</Link>
							<h2 style={{ fontSize: '1.6rem' }}>Select Address</h2>
							<span onClick={() => this.setState({ addressModal: false })} className="close">&#x2714;</span> {/*&times; 	*/}
						</div>
						<div className='modal-body'>
							<ul className="addressHead" >
								{this.state.address.map((addres, index) =>
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

				<Popup className="itemCart cartPop" open={guestPopup} onClose={() => this.setState({ guestPopup: false })}>
					<div className="addressHeader" >
						<a className="close" onClick={() => this.setState({ guestPopup: false })}>
							&times;
        				</a>
						<h3>How you like to proceed?</h3>

						<hr />
						<div style={{ padding: '1%' }}>
							<button className="credBtn" onClick={() => this.props.history.push('/login')}>Login</button>
							<button className="credBtn" onClick={() => this.props.history.push('/register')}>Register</button>
							<button className="credBtn" onClick={() => this.props.history.push('/addaddress')}>As Guest</button>
						</div>
					</div>
				</Popup>
			</div>
		);
	}
}
export default connect(Cart);
