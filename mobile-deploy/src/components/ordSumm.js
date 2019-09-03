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
			<div className='mainSummaryWrap forOrd' style={{margin: '1%'}}>
				<div className='leftSideb'>
					<div className='fBowl'>
						<h5>Bowl</h5>
						<p>{this.props.details.bowl ? this.props.details.bowl.name : 'not selected'}</p>
					</div>
					<div className='fPasta'>
						<h5>Pasta</h5>
						<p>{this.props.details.pastas ? this.props.details.pastas.map(_=>_.name).join(', ') : 'not selected'} </p>
					</div>
					<div className='fGarnish'>
						<h5>Garnish</h5>
						<p>{this.props.details.garnishes ? this.props.details.garnishes.map(_=>_.name).join(', ') : 'not selected'}</p>
					</div>
					<div className='fMeet'>
						<h5>Meat</h5>
						<p>{this.props.details.meats ? this.props.details.meats.map(_=>_.name).join(', ') : 'not selected'}</p>
					</div>
				</div>
				<div className='rightSideb'>
					<div className='fSauce'>
						<h5>Sauce</h5>
						<p>{this.props.details.sauces ? this.props.details.sauces.map(_=>_.name).join(', ') : 'not selected'}</p>
					</div>
					<div className='fVeggies'>
						<h5>Veggies</h5>
						<p style={{width: '35%'}}>{this.props.details.vegetables ? this.props.details.vegetables.map(_=>_.name).join(', ') : 'not selected'}</p>
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
