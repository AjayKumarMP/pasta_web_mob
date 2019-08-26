import React from 'react';
import { connect } from 'react-redux';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
let mapStateToProps = state => {
	return { data: state };
};

class AddAdr extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='contactUsWrapp'>
				<div className='cnt-nav'>
					<Link to='/'>
						<img className='prevBtn' src='./images/prevBtn.png' />
					</Link>
					<h4>Add address</h4>
				</div>
				<div className='mainFormWrap'>
					<form>
						<div className='inpCont'>
							<p>Flat no./ Building no.</p>
							<input />
						</div>
						<div className='inpCont'>
							<p>Street</p>
							<input />
						</div>
						<div className='inpCont'>
							<p>Locality</p>
							<input />
						</div>
						<div className='inpCont'>
							<p>City</p>
							<input />
						</div>
						<div className='inpCont'>
							<p>Address nickname</p>
						</div>
					</form>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps)(AddAdr);
