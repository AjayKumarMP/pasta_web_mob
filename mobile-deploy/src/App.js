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
import {ComponentHelpers, connect} from './utils/componentHelper'

class PastaProject extends ComponentHelpers {
	constructor(props) {
		super(props);

		this.state = {
			favorits: [
				
			],
			user: [{ name: '', email: '', phone: '' }],
			showHamb: false,
			conut: 0,
			loading:true
		};
	}

	async componentWillMount() {
		this.unRegisterApiCalls = false;
		this.setState({loading: true})
		try {
			const user = localStorage.getItem('user')
			const userDetails = user !== 'undefined'? JSON.parse(user): ''
			if (!this.props.data.isUserLoggedIn()) {
				localStorage.clear()
				this.setState({loading: true})
				return this.props.history.push('/login')
			} else {
				this.setState({ user: [{ name: userDetails.full_name, email: userDetails.email, phone: userDetails.phone_no }] })
				httpClient.setDefaultHeader('access-token', userDetails.access_token)
				this.source = httpClient.getSource()
				// const res = await httpClient.ApiCall('post', APIEndPoints.myFavourites,undefined,this.source.token)
				// const response = JSON.parse(JSON.stringify(res.data[0]).replace(/picture/g, "src"))
				// var favorits = [response.bowl, response.meat, response.pasta, response.sauce,
				// response.side, response.vegetable
				// ]
				// favorits = favorits.filter(_=>_)
				// if(!this.unRegisterApiCalls){
				// 	this.setState({ favorits, loading: false })
				// }
			this.setState({loading: false})
			}
		} catch (error) {
			if(error.message !== "unMounted"){
			this.setState({loading: false})
			}
			console.log(error)
		}
	}

	componentWillUnmount(){
		this.unRegisterApiCalls = true;
		this.source && this.source.cancel('unMounted')
	}

	openHamburger = () => {
		this.setState({ showHamb: true });
		if (this.state.showHamb == true) {
			this.setState({ showHamb: false });
		}
	};
	render() {
		return (
			<div className=''>
				<Loading data={this.state.loading}/>
				<div className='header-section'>
					<div className='leftSide'>
						<div onClick={this.openHamburger} className='header-nav-btn'>
							<span />
							<span />
							<span />
						</div>
						{this.state.showHamb ? (
							<HambMenu handle={this.openHamburger} userInfo={this.state.user} />
						) : null}
						<div className='wrap-txt-area'>
							<h3>Hey {this.state.user[0].name} , </h3>
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
				{/* <div className='section4'>
					<h3>My favorits</h3>
					<div className='favWrapper'>
						<Slider info={this.state.favorits} />
					</div>
				</div> */}
			</div>
		);
	}
}

export default connect(PastaProject);
