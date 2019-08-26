import React from 'react';
import { connect } from 'react-redux';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Crtitem from './cartItem';
let mapStateToProps = state => {
	return { data: state };
};

class Rppasta extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		document.addEventListener('mousedown', this.handleClick, false);
	}
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick, false);
	}

	handleClick = e => {
		if (this.wrapper.contains(e.target)) {
			this.props.handler();
			return;
		}
	};

	render() {
		return (
			<div className='pastaRepeatWrap'>
				<div className='backgroundClickable' ref={wrapper => (this.wrapper = wrapper)} />
				<div className='cntr'>
					<h5>Repeat pasta</h5>
					<p>Your previous customisation</p>
					<span>{this.props.data['bow'] === '' ? 'None' : this.props.data['bow']}</span>
					<button>Mini bowl</button>
					<button>Regular bowl</button>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps)(Rppasta);
