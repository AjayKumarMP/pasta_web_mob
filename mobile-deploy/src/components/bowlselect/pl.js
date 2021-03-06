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

		if (this.props.type === 'pasta' || this.props.type === 'sauce') {
			this.state.selected = this.props.data.placeOrder[this.props.type] && this.props.data.placeOrder[this.props.type].name === this.props.info.name;
		} else {
			this.state.selected = this.props.data.placeOrder[this.props.type] && this.props.data.placeOrder[this.props.type].filter(_=>_.name === this.props.info.name).length > 0
		}
	}

	handler = e => {
		let tmp = document.querySelectorAll('.myborder');

		if (e.target.classList.contains('myborder')) {
			if (this.props.type === 'pasta' || this.props.type === 'sauce') {
				if(e.target.classList.contains('activeborder')){
					e.target.classList.remove('activeborder')
				} else{
					tmp.forEach(el => el.classList.remove('activeborder'));
					this.props.data[this.props.type] = this.props.info.name;
					e.target.classList.add('activeborder');
				}
			} else if (this.props.type === 'vegetable') {
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
			}else if (this.props.type === 'meat') {
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
				style={{ transform: `translate(${this.state.x}px, ${this.state.y}px) scale(0)`, marginLeft: 10 }}
				className='choosePl'
				id={this.props.id}
			>
				<img className="chefRecIcon" hidden={parseInt(this.props.info.chef_recommended) === 0} src="./images/chef_recommended.png" alt="" />
				<div onClick={(e)=>{this.handler(e);this.props.handler({name:this.props.info.name, id:this.props.info.id, 
					price: parseInt(this.props.info.price), src: this.props.info.inbowl_src })}}
				 className={this.state.selected ? 'myborder' + ' activeborder' : 'myborder'} />
				{this.props.info.kk ? <img className='decForPl' src={this.props.info.kk} /> : null}
				<img src={this.props.info.src} />
				<div className='nameSection'>
					<p style={{marginBottom: '0px'}}>{this.props.info.name}</p>
					<span hidden={this.props.baseValue.price === this.props.info.price}>
						+ ₹ { this.props.info.price  - this.props.baseValue.price }</span>
				</div>
			</div>
		);
	}
}
export default connect(mapStateToProps)(Plcomponent);
