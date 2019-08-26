import React from 'react';
// import { connect } from 'react-redux'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import { pulse } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import httpClient from '../../utils/httpClient'
import APIEndPoints from '../../utils/APIEndPoints'
import Loading from '../loader'
import { addBowls } from '../../actions/actions'
import { ComponentHelpers, connect } from '../../utils/componentHelper'

const styles = {
	bounce: {
		animation: 'x 0.5s',
		animationName: Radium.keyframes(pulse, 'bounce'),
	},
};

// let mapStateToProps = (state) => {
// 	return { data: state }
//   }

//   let mapDispatchToProps = (dispatch)=>{
// 	return {
// 		addBowls: bowls => dispatch(addBowls(bowls))
// 	}
//   }

class Bowlselect extends ComponentHelpers {
	constructor(props) {
		super(props);
		this.state = {
			select: '',
			kitchen_id: 2,
			animationMiniStyle: { opacity: 0.4 },
			animationRegularStyle: { opacity: 0.4 },
			bowls: [],
			loadingBowls: true
		};
	}

	async componentDidMount() {
		try {
			this.setState({ loadingBowls: true })
			this.source = httpClient.getSource()
			const response = await httpClient.ApiCall('post', APIEndPoints.getBowls, {
				kitchen_id: this.state.kitchen_id
			}, this.source.token)
			this.props.addBowls(response.data)
			// this.props.addBowls(response.data)
			response.data.forEach(bowl => {
				if (bowl.name === 'Mini Bowl') {
					this.setState({ animationMiniStyle: Object.assign(this.state.animationMiniStyle, { opacity: 1 }) })
				} else {
					this.setState({ animationRegularStyle: Object.assign(this.state.animationRegularStyle, { opacity: 1 }) })
				}
			})
			this.setState({
				bowls: response.data,
				loadingBowls: false,

			})
		} catch (error) {
			if (error.message !== "unMounted") {
				this.setState({ loadingBowls: false })
			}
			console.log(error)
		}
	}

	componentWillUnmount() {
		this.source.cancel("unMounted")
	}

	handler = e => {
		const target = e.target;

		if(target.style.opacity === '0.4'){
			return
		}

		if (target.getAttribute('data-bowl') == 'regular') {
			this.setState({ animationRegularStyle: styles.bounce });
		} else if (e.target.getAttribute('data-bowl') == 'mini') {
			this.setState({ animationMiniStyle: styles.bounce });
		}

		setTimeout(() => {
			if (target.getAttribute('data-bowl') == 'regular') {
				this.props.history.push({ pathname: '/regularbowl',state: this.state.animationMiniStyle.opacity === 0.4 });
			} else if (target.getAttribute('data-bowl') == 'mini') {
				this.props.history.push({ pathname: '/minibowl', state: this.state.animationRegularStyle.opacity === 0.4 });
			}
		}, 300);
	};
	render() {
		return (
			<StyleRoot>
				<Loading data={this.state.loadingBowls} />
				<div className='bowlSelectContainer'>
					<div className='circle firstPageCircle'>
						<Link to='/'>
							<img className='prevBtn' src='./images/prevBtn.png' />
						</Link>
						<div className='selectCont'>
							<span className='active' />
							<span />
							<span />
							<span />
							<span />
							<span />
						</div>
						<div className='textArea'>
							<p>Select your</p> <span>bowl</span>
						</div>
					</div>

					{/* <FaSpinner size="md"/> */}
					<div className='underArea'>
						{/* {
						this.state.bowls.map((bowl, index)=>
						
						<div key={index} className={index%2 ===0?'leftSide':'rightSide'}>
							<img
								data-bowl={index%2 ===0?'mini':'regular'}
								style={index%2 ===0?this.state.animationMiniStyle: this.state.animationRegularStyle}
								onClick={this.handler.bind(this)}
								src={bowl.picture}
							/>
							<h5>{bowl.name}</h5>
							<p>{bowl.description}</p>
						</div>
						)
					} */}

						<div className='leftSide'>
							<img
								data-bowl='mini'
								style={this.state.animationMiniStyle}
								onClick={this.handler.bind(this)}
								src='/images/miniBowl.png'
							/>
							<h5>Mini bowl</h5>
							<p>350 ml</p>
						</div>
						<div className='rightSide'>
							<img
								data-bowl='regular'
								style={this.state.animationRegularStyle}

								onClick={this.handler.bind(this)}
								className='regBowlImg img1'
								src='/images/regularBowl.png'
							/>
							<h5>Regular bowl</h5>
							<p> 650 ml</p>
						</div>
					</div>
					<Link to='/bowlselect2'  className='nextBtn'>
						Next
					</Link>
				</div>
			</StyleRoot>
		);
	}
}
export default connect(Bowlselect);
