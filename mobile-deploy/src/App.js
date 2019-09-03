import React from 'react'
import './App.css';
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
import Popup from 'reactjs-popup'

class PastaProject extends ComponentHelpers {
	constructor(props) {
		super(props);

		this.state = {
			favorits: [

			],
			user: { name: '', email: '', phone: '' },
			showHamb: false,
			conut: 0,
			loading: false,
			translate: '',
			locationModal: false,
			locations: [],
			cities: [],
			selectedLocation: '0'
		};
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
			localStorage.setItem('kitchn_id', response.data && response.data.id)
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
			this.setState({ locationModal: true, loading: false, selectedLocation: '' })
			// this.NotificationManager.error(error.response.data.message, "Errror")
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

	async componentWillMount() {
		setTimeout(() => {
			var element = document.querySelector('.homePage-wrapper>div')
			element.style.display = 'contents'
			element.style.gridTemplateRows = '1fr 1fr 2fr 1fr'
			var element = document.querySelector('.homePage-wrapper')
			element.style.display = 'contents'
			element.style.gridTemplateRows = '1fr 1fr 2fr 1fr'
		}, 300)
		const kitche_id = localStorage.getItem('kitchn_id')
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
		// this.unRegisterApiCalls = false;
		// this.setState({loading: true})
		try {
			var favrourites = []
			const userDetails = JSON.parse(localStorage.getItem('user'))
			if (!this.props.data.isUserLoggedIn()) {
				// this.setState({loading: true})
				// return this.props.history.push('/login')
			} else {
				this.source = httpClient.getSource()
				this.setState({ loading: true, user: { name: userDetails.full_name, email: userDetails.email, phone: userDetails.phone_no } })
				const response = await httpClient.ApiCall('post', APIEndPoints.myFavourites, undefined, this.source.token)
				favrourites = response.data && response.data.flatMap((data, index) => {
					return [data.bowl, data.meat, data.pasta, data.sauce,
					data.side, data.vegetable
					].filter(_ => _)
				})
				// console.log(a)
			}
			this.setState({ loading: false, favorits: favrourites })
		} catch (error) {
			if (error.message !== "unMounted") {
				this.setState({ loading: false })
			}
			console.log(error)
		}
	}

	componentWillUnmount() {
		setTimeout(() => {
			var element = document.querySelector('.homePage-wrapper>div')
			element.style.display = 'grid'
			element.style.gridTemplateRows = ''
			var element = document.querySelector('.homePage-wrapper')
			element.style.display = 'grid'
			element.style.gridTemplateRows = ''
		}, 100)
		this.source && this.source.cancel('unMounted')
	}

	openHamburger = () => {
		if (this.state.showHamb === true) {
			this.setState({ translate: 'translateX(-300px)' })
			setTimeout(() => {
				this.setState({ showHamb: false });
			}, 500)
		} else {
			setTimeout(() => {
				this.setState({ translate: 'translateX(0)' });
			}, 1)
			this.setState({ showHamb: true })
		}
	};

	sendLocatiom = () => {
		if (this.state.selectedLocation !== '0')
			this.getKitchen({ location_id: this.state.selectedLocation })
		else
			this.NotificationManager.warning('Please select location', 'Warning!!', 1500)
	}
	render() {
		return (
			<div>
				<Loading data={this.state.loading} />
				<div className='header-section'>
					<div className='leftSide'>
						<div onClick={this.openHamburger} className='header-nav-btn'>
							<span />
							<span />
							<span />
						</div>
						{this.state.showHamb ? (
							<HambMenu translate={this.state.translate} handle={this.openHamburger} userInfo={this.state.user} />
						) : null}
						<div className='wrap-txt-area'>
							<h3>Hey {this.state.user ? this.state.user.name : ''}, </h3>
							<h5>Let`s get you a pasta </h5>
						</div>
					</div>
					<div className='rightSide'>
						<img src='/images/logo.png' />
					</div>
				</div>
				<div className='ownPastaMakeSection'>
					<h3>Make your own pasta</h3>
					<h5>
						Craft a pasta on your own, share it & <br /> enjoy with friends & family
					</h5>
					<img src='images/plate.png' />
					<Link className='linkBtn' to='/bowlselect1'>
						Start now
					</Link>
				</div>
				<div className='section3'>
					<div className='effect' />
					<div className='leftSide'>
						<h3>Chef curated pasta</h3>
						<p>
							Try our delicious, hand -crafted pasta <br />
							range curated by experienced chefs.
						</p>
						<button>
							<Link style={{ color: '#000' }} to='/cheff'>
								Order now
							</Link>
						</button>
					</div>
					<div className='rightSide' />
				</div>
				{
					this.props.data.isUserLoggedIn() ?
						<div className='section4'>
							<h3>My Favourites</h3>
							<div className='favWrapper'>
								<Slider handlerFunc={() => { }} info={this.state.favorits} />
							</div>
						</div>
						: ''
				}
				<Popup className="itemCart" position="right center" open={this.state.locationModal} onClose={() => this.setState({ locationModal: false })}>

					<div className='editPastaPopup modalContent'>
						<div className="modal-header">
							<span onClick={() => this.setState({ locationModal: false })} className="close">&times;</span>
							<h2>Your Location</h2>
						</div>
						<div className='modal-body'>
							<div style={{ display: 'grif' }}>
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
								<button className="verifyOtp" type="submit" onClick={() => this.sendLocatiom()}>Submit</button><br />
							</div>
						</div>
					</div>
				</Popup>
			</div>
		);
	}
}

export default connect(PastaProject);
