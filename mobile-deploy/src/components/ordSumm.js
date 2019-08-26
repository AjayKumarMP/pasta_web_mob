import React from 'react';
import { connect } from 'react-redux';

let mapStateToProps = state => {
	return { data: state };
};

class Summary extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='mainSummaryWrap forOrd'>
				<div className='leftSideb'>
					<div className='fBowl'>
						<h5>Bowl</h5>
						<p>{this.props.data.bow ? this.props.data.bow : 'not selected'}</p>
					</div>
					<div className='fPasta'>
						<h5>Pasta</h5>
						<p>{this.props.data.pasta ? this.props.data.pasta : 'not selected'} </p>
					</div>
					<div className='fGarnish'>
						<h5>Garnish</h5>
						<p>{this.props.data.garnish ? this.props.data.garnish : 'not selected'}</p>
					</div>
					<div className='fMeet'>
						<h5>Meat</h5>
						<p>{this.props.data.meet ? this.props.data.meet : 'not selected'}</p>
					</div>
				</div>
				<div className='rightSideb'>
					<div className='fSauce'>
						<h5>Sauce</h5>
						<p>{this.props.data.sauce ? this.props.data.sauce : 'not selected'}</p>
					</div>
					<div className='fVeggies'>
						<h5>Veggies</h5>
						<p>{this.props.data.veggies ? this.props.data.veggies : 'not selected'}</p>
					</div>
					<div className='fInfo'>
						<p>*(Parmesan and basil will always be included)</p>
					</div>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps)(Summary);
