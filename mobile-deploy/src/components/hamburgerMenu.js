import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import LogoutComponent from './logout';
import { FaUserAlt } from 'react-icons/fa'
import { IconContext } from 'react-icons'

let mapStateToProps = state => {
	return { data: state };
};

class Hamburger extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checkLogout: false,
			width: '0'
		};
	}

	handlerCheckLogout = () => {
		this.setState({ checkLogout: true });
		if (this.state.checkLogout === true) {
			this.setState({ checkLogout: false });
		}
	};

	componentWillMount() {
		document.addEventListener('mousedown', this.handleClick, false);
	}

	componentDidMount() {
		var element = document.querySelector('.homePage-wrapper>div')
		element.style.display = 'grid'
		element.style.gridTemplateRows = ''
		var element = document.querySelector('.homePage-wrapper')
		element.style.display = 'grid'
		element.style.gridTemplateRows = ''
	}

	componentWillUnmount() {
		var element = document.querySelector('.homePage-wrapper>div')
		element.style.display = 'contents'
		element.style.gridTemplateRows = '1fr 1fr 2fr 1fr'
		var element = document.querySelector('.homePage-wrapper')
		element.style.display = 'contents'
		element.style.gridTemplateRows = '1fr 1fr 2fr 1fr'
		document.removeEventListener('mousedown', this.handleClick, false);
	}

	handleClick = e => {
		if (this.side.contains(e.target)) {
			this.props.handle();
			return;
		}
	};

	render() {

		const userLoggedIn = this.props.data.isUserLoggedIn()
		return (
			<div className='mainWrap'>
				{this.state.checkLogout ? <LogoutComponent handlFun={this.handlerCheckLogout} /> : null}
				<div className='hambMenu' style={{ transform: this.props.translate }}>
					<div className='hambHeader'>
						<div className='userArea'>
							<div className='circle' >
								<IconContext.Provider
									value={{
										className: 'react-icons'
									}}>
									<FaUserAlt
										className=""
										style={{
											color: 'black',
											position: 'relative',
											top: '18px',
											left: '22px'
										}}
										size="4em" />
								</IconContext.Provider>
							</div>
							<div className='userInfo'>
								<h3>{userLoggedIn && this.props.userInfo && this.props.userInfo.name
									? this.props.userInfo.name
									: 'Guest User'}</h3>
								<p>{userLoggedIn ? this.props.userInfo.email : ''}</p>
								{/* <p>{this.props.userInfo[0].phone}</p> */}
							</div>
						</div>
					</div>
					<div className='hambMain'>
						<ul>
							<li hidden={!userLoggedIn}>
								<img src='/images/shopping-bag.png' alt='my orders' />
								<Link to='/myorders'>My orders</Link>
							</li>
							<li hidden={!userLoggedIn}>
								<img src='/images/placeholder.png' alt='address' />
								<Link to='/manageaddress'>Manage Addresses</Link>
							</li>
							<li>
								<img src='/images/information.png' alt='about' />
								<Link to='/aboutus'>About pasta project</Link>
							</li>
							<li hidden={!userLoggedIn} onClick={this.handlerCheckLogout}>
								<img src='/images/logout.png' alt='logout' />
								<p>Log out</p>
							</li>
							<li>
								<img src='/images/phone-call.png' alt='contact us' />
								<Link to='/contactus'>Contact us</Link>
							</li>
							<li hidden={userLoggedIn}>
								<img src='/images/logout.png' alt='contact us' />
								<Link to='/login'>Login</Link>
							</li>
							<li hidden={userLoggedIn}>
								<img src='/images/logout.png' alt='contact us' />
								<Link to='/register'>Register</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className='hambEffect' ref={side => (this.side = side)} />
			</div>
		);
	}
}
export default connect(mapStateToProps)(Hamburger);
