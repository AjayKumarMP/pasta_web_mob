import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import LogoutComponent from './logout';

let mapStateToProps = state => {
	return { data: state };
};

class Hamburger extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checkLogout: false,
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

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick, false);
	}

	handleClick = e => {
		if (this.side.contains(e.target)) {
			this.props.handle();
			return;
		}
	};

	render() {
		return (
			<div className='mainWrap'>
				{this.state.checkLogout ? <LogoutComponent handlFun={this.handlerCheckLogout} /> : null}
				<div className='hambMenu'>
					<div className='hambHeader'>
						<div className='userArea'>
							<div className='circle' />
							<div className='userInfo'>
								<h3>{this.props.userInfo[0].name}</h3>
								<p>{this.props.userInfo[0].email}</p>
								<p>{this.props.userInfo[0].phone}</p>
							</div>
						</div>
					</div>
					<div className='hambMain'>
						<ul>
							<li>
								<img src='/images/shopping-bag.png' alt='my orders' />
								<Link to='/myorders'>My orders</Link>
							</li>
							<li>
								<img src='/images/placeholder.png' alt='address' />
								<Link to='/manageaddress'>Manage Addresses</Link>
							</li>
							<li>
								<img src='/images/information.png' alt='about' />
								<Link to='/aboutus'>About pasta project</Link>
							</li>
							<li onClick={this.handlerCheckLogout}>
								<img src='/images/logout.png' alt='logout' />
								<p>Log out</p>
							</li>
							<li>
								<img src='/images/phone-call.png' alt='contact us' />
								<Link to='/contactus'>Contact us</Link>
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
