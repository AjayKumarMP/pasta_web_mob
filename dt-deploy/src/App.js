import React from 'react'
// import './App.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Swiper from 'react-id-swiper';
import Favorite from './components/favComp';
import Slider from './components/swiper';
import HambMenu from './components/hamburgerMenu';
import $ from 'jquery';
import BowlSelect1 from './components/bowlselect/bowlSelect1';
import LogoutComponent from './components/logout';
import httpClient from './utils/httpClient'
import APIEndPoints from './utils/APIEndPoints'
import Loading from './components/loader'
import { ComponentHelpers, connect } from './utils/componentHelper'

import './shared.scss';
import './styles/chefCurated.scss';
import miniBowl from './assets/images/mini-bowl.png';
import pastoLogo from './assets/images/pasta-logo.png';
import alfredoSpaghetti from './assets/images/favourites-pic.png'
import { ReactComponent as GreenPin } from './assets/icons/pin.svg';
import Popup from 'reactjs-popup'

import hamburger from './assets/images/hamburger.png';


class PastaProject extends ComponentHelpers {
	constructor(props) {
		super(props);
		this.state = {
			favorits: [],
			user: [{ name: '', email: '', phone: '' }],
			showHamb: false,
			conut: 0,
			translate: '',
			loading: false,
			locationModal: false,
			selectedLocation: '0',
			locations: [],
			cities: []
		};
	}

	async componentWillMount() {
		localStorage.removeItem('sides')
		localStorage.removeItem('cartItem')
		localStorage.getItem('chefCurated')
		const kitche_id = localStorage.getItem('kitchen_id')
		if (kitche_id !== null) {
			this.setState({ kitche_id })
		} else {
			const location = JSON.parse(localStorage.getItem('location'))
			if (location !== null) {
				this.getKitchen(location)
			} else {
				navigator.geolocation.getCurrentPosition(async (data) => {
					localStorage.setItem("location", JSON.stringify({
						lat: data.coords.latitude,
						long: data.coords.longitude
					}))
					this.getKitchen({
						lat: data.coords.latitude,
						long: data.coords.longitude
					})
				}, err => {
					this.setState({ locationModal: true })
					this.getCities()
				}
				)
			}
		}
		localStorage.removeItem('order_id')
		try {
			var favrourites = []
			const userDetails = JSON.parse(localStorage.getItem('user'))
			if (this.props.data.isUserLoggedIn()) {
				this.source = httpClient.getSource()
				this.setState({loading: true, user: { name: userDetails.full_name, email: userDetails.email, phone: userDetails.phone_no } })
				const response = await httpClient.ApiCall('post', APIEndPoints.myFavourites, undefined, this.source.token)
				favrourites = response.data && response.data.flatMap((data, index)=>{
					return [data.bowl, data.meat, data.pasta, data.sauce,
						data.side, data.vegetable
					].filter(_ => _)
				})
			}
			favrourites.length = 6
			this.setState({loading: false, favorits: favrourites })
		} catch (error) {
			if (error.message !== "unMounted") {
				this.setState({ loading: false })
			}
		}
	}

	getKitchen = async (payload) => {
		try {
			this.setState({ loading: true })
			const response = await httpClient.ApiCall('post', APIEndPoints.getKitchen, payload)
			if (!response.data) {
				this.setState({ locationModal: true, loading: false })
				return this.getCities()
				// return this.NotificationManager.error(response.message, "Errror")
			}
			localStorage.setItem('kitchen_id', response.data && response.data.id)
			this.props.addKitchenId(response.data.id)
			this.setState({ locationModal: false, loading: false })
		} catch (error) {
			this.getCities()
			this.setState({ locationModal: true, loading: false })
			// this.NotificationManager.error(error.response.data.message, "Errror")
		}
	}

	getLocation = async (payload) => {
		try {
			this.setState({ loading: true })
			const response = await httpClient.ApiCall('post', APIEndPoints.getLocations, {
				city_id: payload
			})
			if (!response.data) {
				// this.setState({locationModal: true, loading: false})
				// return this.NotificationManager.error(response.message, "Errror")
			}
			this.setState({ locations: response.data, loading: false, selectedLocation: '0' })
		} catch (error) {
			this.setState({ locationModal: true, loading: false })
		}
	}

	getCities = async () => {
		try {
			this.setState({ loading: true })
			const response = await httpClient.ApiCall('post', APIEndPoints.getCities)
			this.setState({ cities: response.data, loading: false })
		} catch (error) {
			this.setState({ locationModal: true, loading: false })
		}
	}

openHamburger = () => {
	if (this.state.showHamb === true) {
		this.setState({ translate: 'translateX(-400px)' })
		setTimeout(() => {
			this.setState({ showHamb: false });
		}, 500)
	} else {
		setTimeout(() => {
			this.setState({ translate: 'translateX(0)' });
		}, 1)
		this.setState({ showHamb: true })
	}
}

sendLocatiom = () => {
	if (this.state.selectedLocation !== '0')
		this.getKitchen({ location_id: this.state.selectedLocation })
	else
	this.NotificationManager.warning('Please select location', 'Warning!!', 1500)
}
render() {
	return (
		<div className="container">
			<Loading data={this.state.loading} />
			<div className="wrapper">
				<div className="header header-section">
					<div className="leftSide">

						<img src={hamburger} alt="img" onClick={() => this.openHamburger()} className="hamburger" />
						{this.state.showHamb ? (
							<HambMenu translate={this.state.translate} handle={this.openHamburger} userInfo={this.state.user} />
						) : null}
					</div>
				</div>
				<img src={pastoLogo} alt="loading" className="logo"></img>

				<div className="rowsContainer">
					<div className="greeting">
						<h4>Hey {this.state.user ? this.state.user.name : ''},</h4>
						<h5>Let's get you a pasta</h5>
					</div>
					<div className="makeCuratedWrapper">
						<div className="makePastaContainer">
							<h5>Make your own pasta</h5>
							<p>Craft a pasta on your own, share it &amp; enjoy with friends &amp; family</p>
							<img src={miniBowl} alt="Bowl image" />
							<Link to='/bowlselect1'>
								<button>Start now</button>
							</Link>
						</div>
						<div className="chefCuratedContainer">
							<h5>Chef curated pasta</h5>
							<p>Try our delicious, hand-crafted pasta range curated by experienced chefs</p>
							<Link to='cheff'>
								<button>Order now</button>

							</Link>
						</div>
					</div>

					{this.props.data.isUserLoggedIn() ?
						<div className="favouritesSection">
							<h5>My favourites</h5>
							<div className="favoritesItemsContainer">{
								this.state.favorits.map((val, index) =>

									<div key={index} className="favouritesItem">
										<img alt='alfredo spaghetti' src={val.picture} />
										<div className="myDiv">

											<p>{val.name}</p>
											<div className="favouritesitemFooter">
												<GreenPin />
												<span>&#x20B9; {val.price}</span>
											</div>
										</div>
									</div>
								)
							}

							</div>
						</div>
						: ""}
				</div>
			</div>
			<div className="appContainer">
			<Popup className="itemCart loc" position="right center" open={this.state.locationModal} onClose={() => this.setState({ locationModal: false })}>

					<div className='editPastaPopup modalContent'>
						<div className="modal-header" style={{padding: '10px'}}>
							<span onClick={() => this.setState({ locationModal: false })} className="close">&times;</span>
							<h2>Your Location</h2>
						</div>
						<div className='modal-body'>
							<div style={{ display: 'grid' }}>
								<select className="selectCities" value={this.state.value} onChange={(e) => this.getLocation(e.target.value)}>
									<option defaultValue value="0">Select City</option>
									{
										this.state.cities.map((city, index) =>
											<option key={index} value={city.id}>{city.name}</option>
										)
									}
								</select>

								<select disabled={this.state.locations.length === 0} className="selectLocation"
									value={this.state.selectedLocation} onChange={(e) => this.setState({ selectedLocation: e.target.value })}>
									<option defaultValue value="0">Select Location</option>
									{
										this.state.locations.map((location, index) =>
											<option key={index} value={location.id}>{location.name}</option>
										)
									}
								</select>
								<button className="LogindoneBtn" style={{ marginLeft: '12%', position: 'relative' }} type="submit" onClick={() => this.sendLocatiom()}>Submit</button><br />
							</div>
						</div>
					</div>
				</Popup>
				</div>
		</div>
	);
}
}

export default connect(PastaProject);
