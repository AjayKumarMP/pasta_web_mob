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
import {ComponentHelpers, connect} from './utils/componentHelper'

import './shared.scss';
import './styles/chefCurated.scss';
import miniBowl from './assets/images/mini-bowl.png';
import pastoLogo from './assets/images/pasta-logo.png';
import alfredoSpaghetti from './assets/images/favourites-pic.png'
import { ReactComponent as GreenPin } from './assets/icons/pin.svg';

import hamburger from './assets/images/hamburger.png';


class PastaProject extends ComponentHelpers {
	constructor(props) {
		super(props);

		this.state = {
			favorits: [
				
			],
			user: [{ name: '', email: '', phone: '' }],
			showHamb: false,
			conut: 0,
			loading:false
		};
	}

	async componentWillMount() {
		// this.unRegisterApiCalls = false;
		// this.setState({loading: true})
		try {
			const userDetails = JSON.parse(localStorage.getItem('user'))
			if (!this.props.data.isUserLoggedIn()) {
				// this.setState({loading: true})
				// return this.props.history.push('/login')
			} else {
				this.setState({ user: { name: userDetails.full_name, email: userDetails.email, phone: userDetails.phone_no } })
				// this.source = httpClient.getSource()
				// const res = await httpClient.ApiCall('post', APIEndPoints.myFavourites,undefined,this.source.token)
				// const response = JSON.parse(JSON.stringify(res.data[0]).replace(/picture/g, "src"))
				// var favorits = [response.bowl, response.meat, response.pasta, response.sauce,
				// response.side, response.vegetable
				// ]
				// favorits = favorits.filter(_=>_)
				// 	this.setState({ favorits, loading: false })
				// }
					this.setState({ loading: false })

			}
		} catch (error) {
			if(error.message !== "unMounted"){
			this.setState({loading: false})
			}
			console.log(error)
		}
	}

	componentWillUnmount(){
		// this.	 = true;
		// this.source.cancel('unMounted')
	}

	openHamburger = () => {
		this.setState({ showHamb: true });
		if (this.state.showHamb == true) {
			this.setState({ showHamb: false });
		}
	};
	render() {
		return (
		  <div className="container">
			  <Loading data={this.state.loading}/>
			<div className="wrapper">
			  <div className="header header-section">
				  <div className="leftSide">

				<img src={hamburger} alt="img" onClick={()=>this.openHamburger()} className="hamburger" />
			  {this.state.showHamb ? (
				  <HambMenu handle={this.openHamburger} userInfo={this.state.user} />
				  ) : null}
				  </div>
				  </div>
			  <img src={pastoLogo} alt="loading" className="logo"></img>
	
			  <div className="rowsContainer">
				<div className="greeting">
				  <h4>Hey {this.state.user ?this.state.user.name: ''},</h4>
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
	
				{/* <div className="favouritesSection">
				  <h5>My favourites</h5>
				  <div className="favoritesItemsContainer">{
					this.state.favorits.map((val, index)=>
					  
					<div key={index} className="favouritesItem">
					  <img alt='alfredo spaghetti' src={val.src} />
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
				</div> */}
			  </div>
			</div>
		  </div>
		);
	  }
}

export default connect(PastaProject);
