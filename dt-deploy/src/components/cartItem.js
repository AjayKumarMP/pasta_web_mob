import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import Popuprp from './rpPasta';

let mapStateToProps = state => {
	return { data: state };
};

class Crtitem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showPopup: false,
			numChanged: false,
		};
	}
	handler = () => {
		if (this.state.showPopup) {
			this.setState({ showPopup: false });
		} else {
			this.setState({ showPopup: true });
		}
	};
	render() {
		const cartItem = this.props.cartData
		this.names = ""
		this.price = 0
		Object.keys(cartItem).forEach((key, index)=>{
			this.names += cartItem[key] && cartItem[key].name?cartItem[key].name: ''
			this.price +=cartItem[key] && cartItem[key].price? parseInt(cartItem[key].price) : 0
			if(index+1 !== Object.keys(cartItem).length && cartItem[key] && cartItem[key].name){
				this.names += ", "
			}
		})
		return (
			<div>
				{this.state.showPopup ? <Popuprp handler={this.handler} /> : null}

				<div className='crtItemWrap'>
					<div className='infoSect'>
						<h4>{cartItem.name}</h4>
						<p>{this.names}.</p>
						<div className='tmpWrap'>
							<span>&#8377; {this.price}</span>
							<div onClick={this.handler} className='plType'>
								{cartItem['bowl'] ? cartItem['bowl'].name.split(" ")[0] : 'None'}
							</div>
							<div className='changeBtn'>
								<span
									onClick={() => {
										if (cartItem['quantity'] > 1) {
											cartItem['quantity']--;
										}
										this.setState({ numChanged: !this.state.numChanged });
									}}
								>
									-
								</span>
								<div>{cartItem['quantity']}</div>
								<span
									onClick={() => {
										if (cartItem['quantity'] < 50) {
											cartItem['quantity']++;
										}
										this.setState({ numChanged: !this.state.numChanged });
									}}
								>
									+
								</span>
							</div>
						</div>
					</div>
					<div className='imgSect'>
						<img className='cartImg' src='./images/miniBowl.png' />
						<Link to={{pathname: '/editpasta', state: cartItem}} >
							<button className='edtPastaBtn'>Edit pasta</button>
						</Link>
					</div>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps)(Crtitem);
//payment,yourcollection
