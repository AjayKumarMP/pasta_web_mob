import React from 'react';
import { ComponentHelpers, connect } from '../../utils/componentHelper'

class Summary extends  ComponentHelpers{
	constructor(props) {
		super(props);
	}

	render() {
		const order = this.props.data.placeOrder
		return (
			<div className='mainSummaryWrap'>
				<div className='leftSideb'>
					<div className='fBowl'>
						<h5>Bowl</h5>
						<p>{order.bowl && order.bowl.name ? order.bowl.name : 'not selected'}</p>
					</div>
					<div className='fPasta'>
						<h5>Pasta</h5>
						<p>{order.pasta && order.pasta.name ? order.pasta.name : 'not selected'} </p>
					</div>
					<div className='fGarnish'>
						<h5>Garnish</h5>
						<p>{order.garnish && order.garnish.name ? order.garnish.name : 'not selected'}</p>
					</div>
					<div className='fMeet'>
						<h5>Meat</h5>
						<p>{order.meat && order.meat.name ? order.meat.name : 'not selected'}</p>
					</div>
				</div>
				<div className='rightSideb'>
					<div className='fSauce'>
						<h5>Sauce</h5>
						<p>{order.sauce && order.sauce.name ? order.sauce.name : 'not selected'}</p>
					</div>
					<div className='fVeggies'>
						<h5>Veggies</h5>
						<p>{order.vegetable && order.vegetable.name ? order.vegetable.name : 'not selected'}</p>
					</div>
					<div className='fInfo' />
				</div>
			</div>
		);
	}
}
export default connect(Summary);
