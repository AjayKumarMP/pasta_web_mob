import React from 'react';
import { connect } from 'react-redux';
import thanks from './thanks';

let mapStateToProps = state => {
	return { data: state };
};

class Plcomponent extends React.Component {
	constructor(props) {
		super(props);

		if(this.props.id > 4){
			this.state = { y: -130, x: this.props.id * 70 };
			this.animationClass = '';
		}else {
			this.state = { y: -90, x: 480 };
			this.animationClass = `choosePl${this.props.id+1}`;
		}

		// if (this.props.id === 0) {
		// 	this.state = { y: -90, x: 480 };
		// 	this.animationClass = 'choosePl1';
		// } else if (this.props.id == 1) {
		// 	this.state = { y: -90, x: 480 };
		// 	this.animationClass = 'choosePl2';
		// } else if (this.props.id == 2) {
		// 	this.state = { y: -90, x: 480 };
		// 	this.animationClass = 'choosePl3';
		// } else if (this.props.id == 3) {
		// 	this.state = { y: -90, x: 480 };
		// 	this.animationClass = 'choosePl4';
		// } else if (this.props.id == 4) {
		// 	this.state = { y: -90, x: 480 };
		// 	this.animationClass = 'choosePl5';
		// } else {
		// 	this.state = { y: -130, x: this.props.id * 70 };
		// 	this.animationClass = '';
		// }

		if (this.props.type === 'pasta' || this.props.type === 'sauce' || this.props.type === 'meet') {
			this.state.selected = this.props.data[this.props.type] === this.props.info.name;
		} else {
			this.state.selected = this.props.data[this.props.type].includes(this.props.info.name);
		}
	}

	handler = e => {
		let tmp = document.querySelectorAll('.myborder');

		if (e.target.classList.contains('myborder')) {
			if (this.props.type === 'pasta' || this.props.type === 'sauce') {
				tmp.forEach(el => el.classList.remove('activeborder'));
				this.props.data[this.props.type] = this.props.info.name;
				e.target.classList.add('activeborder');
			} else if (this.props.type === 'veggies') {
				if (this.props.data[this.props.type].includes(this.props.info.name)) {
					this.props.data[this.props.type] = this.props.data[this.props.type].replace(
						`${this.props.info.name}, `,
						''
					);
					e.target.classList.remove('activeborder');
				} else {
					if (this.props.data[this.props.type].split(', ').length < 4) {
						this.props.data[this.props.type] += this.props.info.name + ', ';
						e.target.classList.add('activeborder');
					}
				}
			} else if (this.props.type === 'garnish') {
				if (!this.props.data[this.props.type].includes(this.props.info.name)) {
					if (this.props.data[this.props.type].split(', ').length < 3) {
						this.props.data[this.props.type] += this.props.info.name + ', ';
						e.target.classList.add('activeborder');
					}
				} else {
					this.props.data[this.props.type] = this.props.data[this.props.type].replace(
						`${this.props.info.name}, `,
						''
					);
					e.target.classList.remove('activeborder');
				}
			}else if (this.props.type === 'meet') {
				if (!this.props.data[this.props.type].includes(this.props.info.name)) {
					if (this.props.data[this.props.type].split(', ').length < 3) {
						this.props.data[this.props.type] += this.props.info.name + ', ';
						e.target.classList.add('activeborder');
					}
				} else {
					this.props.data[this.props.type] = this.props.data[this.props.type].replace(
						`${this.props.info.name}, `,
						''
					);
					e.target.classList.remove('activeborder');
				}
			}
		}
	};

	render() {
		const borderStyle = {
			border: '2px dashed #67023F',
		};

		return (
			<div
				onClick={(e)=>{this.handler(e);this.props.handler({name:this.props.info.name, id:this.props.info.id, price: parseInt(this.props.info.price) })}}
				style={{ transform: `translate(${this.state.x}px, ${this.state.y}px) scale(0)`, marginLeft: 10 }}
				className='choosePl'
				id={this.props.id}
			>
				<div className={this.state.selected ? 'myborder' + ' activeborder' : 'myborder'} />
				{this.props.info.kk ? <img className='decForPl' src={this.props.info.kk} /> : null}
				<img src={this.props.info.src} />
				<div className='nameSection'>
					<p>{this.props.info.name}</p>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps)(Plcomponent);
