import React from 'react';
import httpClient from '../../utils/httpClient'
import APIEndPoints from '../../utils/APIEndPoints'
import Loading from '../loader'
import { ComponentHelpers, connect } from '../../utils/componentHelper'
import sideImage from '../../assets/images/side.png';
import bowlImage from '../../assets/images/bowl.png';
import miniBowl from '../../assets/images/mini-bowl.png';
import regularBowl from '../../assets/images/regular-bowl.png';
import { ReactComponent as BackLogo } from '../../assets/icons/back2.svg';
import { ReactComponent as PastoLogo } from '../../assets/icons/pastalogo.svg';
import IndicatorItem from '../IndicatorItem';
import '../../styles/pasta.scss';

class Bowlselect extends ComponentHelpers {
	indexes = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
	constructor(props) {
		super(props);
		this.state = {
			bowl: {},
			loading: true,
			selection: 0,
			sauces: [],
			pastas: [],
			garnishes: [],
			sides: [],
			meats: [],
			veggiesList: [],
			totalPrice: 0,
			sauce: {},
			pasta: {},
			veggies: [],
			garnish: [],
			meat: [],
			side: [],
			kitchen_id: 2,
			animationMiniStyle: { opacity: 0.4, left: '42%', top: '-10.5%' },
			bowlSize: { reg: '67%', mini: '56%' },
			animationRegularStyle: { opacity: 0.4, left: '41%', top: '57%' },
			bowls: [],
			fromChefCurated: false,
			sauceBaseValue: '',
			pastaBaseValue: '',
			veggieBaseValue: '',
			garnishBaseValue: '',
			meatBaseValue: '',
			sideBaseValue:''
		};
	}

	async componentDidMount() {
		try {
			this.setState({
				loading: true,
				fromChefCurated: localStorage.getItem('chefCurated') !== null,
				selection: localStorage.getItem('chefCurated') !== null ? 6 : 0
			})
			this.source = httpClient.getSource()
			httpClient.ApiCall('post', APIEndPoints.getBowls, {
				kitchen_id: this.props.data.kitchen_id
			}, this.source.token).then(response => {
				this.props.addBowls(response.data)
				response.data.forEach(bowl => {
					if (bowl.name === 'Mini Bowl') {
						this.setState({
							animationMiniStyle: {
								opacity: 1,
								left: '42%',
								top: '-10.5%'
							},
							bowls: response.data,
							loading: false,
						})
					} else {
						this.setState({
							animationRegularStyle: {
								opacity: 1,
								left: '41%',
								top: '57%',

							},
							bowls: response.data,
							loading: false,
						})
					}
				})
			})
			this.sourceSauces = httpClient.getSource()
			httpClient.ApiCall('post', APIEndPoints.getSauces, {
				kitchen_id: this.props.data.kitchen_id
			}, this.sourceSauces.token).then(response => {
				const sauceBaseValue= response.data.reduce((prev, curr) =>{
					return parseInt(prev.price) < parseInt(curr.price) ? prev : curr;
				})
				this.setState({
					sauces: response.data,
					sauceBaseValue
				})
			})
			
			this.sourcePastas = httpClient.getSource()
			httpClient.ApiCall('post', APIEndPoints.getPastas, {
				kitchen_id: this.props.data.kitchen_id
			}, this.sourcePastas.token).then(response => {
				const pastaBaseValue= response.data.reduce((prev, curr) =>{
					return parseInt(prev.price) < parseInt(curr.price) ? prev : curr;
				})
				this.setState({
					pastas: response.data,
					pastaBaseValue
				})
			})
			
			this.sourceVeggies = httpClient.getSource()
			httpClient.ApiCall('post', APIEndPoints.getVeggies, {
				kitchen_id: this.props.data.kitchen_id
			}, this.sourceVeggies.token).then(response => {
				const veggieBaseValue= response.data.reduce((prev, curr) =>{
					return parseInt(prev.price) < parseInt(curr.price) ? prev : curr;
				})
				this.setState({
					veggiesList: response.data,
					veggieBaseValue
				})
			})
			
			this.sourceGarnishes = httpClient.getSource()
			httpClient.ApiCall('post', APIEndPoints.getGarnishes, {
				kitchen_id: this.props.data.kitchen_id
			}, this.sourceGarnishes.token).then(response => {
				const garnishBaseValue= response.data.reduce((prev, curr) =>{
					return parseInt(prev.price) < parseInt(curr.price) ? prev : curr;
				})
				this.setState({
					garnishes: response.data,
					garnishBaseValue
				})
			})
			this.sourceMeats = httpClient.getSource()
			httpClient.ApiCall('post', APIEndPoints.getMeats, {
				kitchen_id: this.props.data.kitchen_id
			}, this.sourceMeats.token).then(response => {
				const meatBaseValue= response.data.reduce((prev, curr) =>{
					return parseInt(prev.price) < parseInt(curr.price) ? prev : curr;
				})
				this.setState({
					meats: response.data,
					meatBaseValue
				})
			})
			this.sourceSides = httpClient.getSource()
			httpClient.ApiCall('post', APIEndPoints.getSides, {
				kitchen_id: this.props.data.kitchen_id
			}, this.sourceSides.token).then(response => {
				const sideBaseValue= response.data.reduce((prev, curr) =>{
					return parseInt(prev.price) < parseInt(curr.price) ? prev : curr;
				})
				this.setState({
					sides: response.data,
					sideBaseValue
				})
			})

		} catch (error) {
			if (error.message !== "unMounted") {
				this.setState({ loading: false })
			}
			console.log(error)
		}
	}

	componentWillUnmount() {
		this.source && this.source.cancel("unMounted")
		this.sourceSauces && this.sourceSauces.cancel("unMounted")
		this.sourcePastas && this.sourcePastas.cancel("unMounted")
		this.sourceVeggies && this.sourceVeggies.cancel("unMounted")
		this.sourceGarnishes && this.sourceGarnishes.cancel("unMounted")
		this.sourceMeats && this.sourceMeats.cancel("unMounted")
		this.sourceSides && this.sourceSides.cancel("unMounted")
	}

	selectBowl(isDisabled, type) {
		if (isDisabled) {
			return
		}
		if (type === "mini") {
			const select = this.state.bowls.filter(val => val.name.toLowerCase() === "mini bowl")
			this.setState({
				animationRegularStyle: {
					opacity: this.state.animationRegularStyle.opacity,
					left: '67%',
					top: '56%',
				},
				animationMiniStyle: {
					opacity: this.state.animationMiniStyle.opacity,
					left: '8%',
					top: '30%',
				},
				bowlSize: {
					mini: '70%',
					reg: '64%'
				},
				bowl: select.length > 0 ? select[0] : {},
				totalPrice: select[0] && parseInt(select[0].price),
				selectedBowl: type
			})
		} else {
			const select = this.state.bowls.filter(val => val.name.toLowerCase() === "regular bowl")
			this.setState({
				animationRegularStyle: {
					opacity: this.state.animationRegularStyle.opacity,
					left: '6%',
					top: '11%',
				},
				animationMiniStyle: {
					opacity: this.state.animationMiniStyle.opacity,
					left: '52%',
					top: '0.5%',
				},
				selectedBowl: type,
				bowl: select.length > 0 ? select[0] : {},
				bowlSize: {
					mini: '30%',
					reg: '64%'
				},
				totalPrice: select[0] && parseInt(select[0].price),
			})
		}
	}

	addItem(item, type) {
		const { veggies, meat, garnish, side, selection, totalPrice, sauce, pasta } = this.state
		let price = totalPrice
		switch (type) {
			case 'veggies':
				{
					const index = veggies.indexOf(item)
					if (index === -1 && veggies.length >= 3) {
						return
					}
					index > -1 ? veggies.splice(index, 1) && (price -= parseInt(item.price)) : veggies.push(item) && (price += parseInt(item.price))
					this.setState({ veggies: veggies, totalPrice: price })
					break
				}
			case 'meat':
				{
					const index = meat.indexOf(item)
					if (index === -1 && meat.length >= 2) {
						return
					}
					index > -1 ? meat.splice(index, 1) && (price -= parseInt(item.price)) : meat.push(item) && (price += parseInt(item.price))
					this.setState({ meat: meat, totalPrice: price })
					break
				}
			case 'garnish':
				{
					const index = garnish.indexOf(item)
					if (index === -1 && garnish.length >= 2) {
						return
					}
					index > -1 ? garnish.splice(index, 1) && (price -= parseInt(item.price)) : garnish.push(item) && (price += parseInt(item.price))
					this.setState({ garnish: garnish, totalPrice: price })
					break
				}
			case 'side':
				{
					const index = side.indexOf(item)
					index > -1 ? side.splice(index, 1) && (price -= parseInt(item.price)) : side.push(item) && (price += parseInt(item.price))
					this.setState({ side: side, totalPrice: price })
					break
				}
			case 'sauce': {
				const Price = totalPrice + parseInt(item.price) - (parseInt(sauce.price) ? parseInt(sauce.price) : 0)
				sauce.id === item.id ?
					this.setState({ sauce: {}, totalPrice: totalPrice - parseInt(item.price) }) :
					this.setState({ sauce: item, totalPrice: Price })
				break
			}
			case 'pasta': {
				const Price = totalPrice + parseInt(item.price) - (parseInt(pasta.price) ? parseInt(pasta.price) : 0)
				pasta.id === item.id ?
					this.setState({ pasta: {}, totalPrice: totalPrice - parseInt(item.price) }) :
					this.setState({ pasta: item, totalPrice: Price })
				break
			}
			default:
				break
		}
	}

	nextBtnDisabled() {
		if (this.state.selection === 1 && this.state.sauce && Object.keys(this.state.sauce).length <= 0) {
			this.NotificationManager.warning('Please select at-least one sauce', 'Warning', 1500)
			return true
		}
		if (this.state.selection === 2 && this.state.pasta && Object.keys(this.state.pasta).length <= 0) {
			this.NotificationManager.warning('Please select at-least one pasta', 'Warning', 1500)
			return true
		}
		return this.state.loading || (this.state.selection === 0 && Object.keys(this.state.bowl).length === 0)
	}

	addItemToCart = async (path) => {
		this.setState({ loading: true })
		if (this.state.side.length > 0) {
			localStorage.setItem('sides', JSON.stringify(this.state.side))
		}
		if (!this.state.fromChefCurated)
		localStorage.setItem('cartItem', JSON.stringify({
			bowl: this.state.bowl,
			meat: this.state.meat,
			sauce: this.state.sauce,
			pasta: this.state.pasta,
			garnish: this.state.garnish,
			veggies: this.state.veggies
		}))
		// await Promise.all([
		// 	this.addProductToCart(this.state),
		// 	this.state.side.length > 0 ? this.addProductToCart({}, this.state.side[0].id) : Promise.resolve()
		// ]
		// )
		this.setState({ loading: false })
		this.props.history.push(path)
	}

	render() {
		const selections = ['bowl', 'sauce', 'pasta', 'veggies', 'garnish', 'meat', 'side'];
		const { selection, loading, animationMiniStyle, animationRegularStyle, bowlSize, sauce, bowl, pasta, veggies, garnish, meat, side, sauces, garnishes,
			sides, pastas, meats, veggiesList, totalPrice } = this.state
		return (
			<div className="pastaContainer appContainer">
				<Loading data={loading} />
				<title>Pasta</title>
				<main className="background">
					<div className="wrapper">
						<div className="leftSide">
							<div className="sideImage">
								<img alt='Side background' src={sideImage} />
							</div>

							<div className="backLogo">
								<BackLogo onClick={() => selection === 0 ? this.props.history.push('/') :
									(this.state.fromChefCurated ? this.props.history.push('/cheff') : this.setState({ selection: selection - 1 }))} />
								<PastoLogo />
							</div>
							{selection === 0 && (
								<section>
									<div
										className="bowl bowlOne"
										style={animationMiniStyle}
										onClick={(e) => this.selectBowl((animationMiniStyle.opacity === 0.4), 'mini')}
									>
										<img style={{ width: bowlSize.mini }} alt='bowl' src={miniBowl} />
										<p>
											Mini bowl <span>350 ml</span>
										</p>
									</div>
									<div
										className="bowl bowlTwo"
										style={animationRegularStyle}
										onClick={(e) => this.selectBowl((animationRegularStyle.opacity === 0.4), 'reg')}
									>
										<p>
											Regular bowl <span>650 ml</span>
										</p>
										<img style={{ width: bowlSize.reg }} alt='bowl' src={regularBowl} />
									</div>
								</section>
							)}
							{selection === 1 && (
								<section>
									<div className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.inbowl_picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.inbowl_picture} />)}
										{veggies.map((veg, index) => {
											return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={veg.inbowl_picture} />)
										})}
										{garnish.map((gar, index) => {
											return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={gar.inbowl_picture} />)
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.inbowl_picture} />)
										})}
									</div>
									{
										sauces.map((sauc, index) =>
											<div key={index} className={[`sauce${this.indexes[index]} ${sauce.id === sauc.id ? 'activeBorder' : ""} `].join(" ")} onClick={() => this.addItem(sauc, 'sauce')}>
												<img className="chefRecIcon" hidden={parseInt(sauc.chef_recommended) === 0} src="./images/chef_recommended.png" alt="" />
												<img alt='sauce' src={sauc.picture} />
												<p className={sauce.id === sauc.id ? 'textSelected' : ''}>{sauc.name}</p>
												<span className={sauce.id === sauc.id ? 'textSelected' : ''} hidden={this.state.sauceBaseValue.price === sauc.price}>+ ₹ { sauc.price  - this.state.sauceBaseValue.price }</span>
											</div>
										)
									}
								</section>
							)}

							{selection === 2 && (
								<section>
									<div className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.inbowl_picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.inbowl_picture} />)}
										{veggies.map((el, index) => {
											return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={el.inbowl_picture} />)
										})}
										{garnish.map((el, index) => {
											return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={el.inbowl_picture} />)
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.inbowl_picture} />)
										})}
									</div>
									{
										pastas.map((past, index) =>

											<div key={index} className={[`sauce${this.indexes[index]} ${pasta.id === past.id ? 'activeBorder' : ""} `].join(" ")} onClick={() => this.addItem(past, 'pasta')}>
												<img className="chefRecIcon" hidden={parseInt(past.chef_recommended) === 0} src="./images/chef_recommended.png" alt="" />
												<img alt='sauce' src={past.picture} />
												<p className={past.id === pasta.id ? 'textSelected' : ''}>{past.name}</p>
												<span className={past.id === pasta.id ? 'textSelected' : ''} hidden={this.state.pastaBaseValue.price === past.price}>+ ₹ { past.price  - this.state.pastaBaseValue.price }</span>
											</div>
										)
									}
								</section>
							)}

							{selection === 3 && (
								<section>
									<div className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.inbowl_picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.inbowl_picture} />)}
										{veggies.length > 0 && veggies.map((el, index) => {
											return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={el.inbowl_picture} />)
										})}
										{garnish.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={el.inbowl_picture} />)
											}
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.inbowl_picture} />)
										})}
										{/* {Object.keys(meat).length > 0 && (<img className="sauceInbowlMeat" alt='meat' src={meat.picture} />)} */}
									</div>
									{
										veggiesList.map((vegg, index) =>
											<div key={index}
												className={[`sauce${this.indexes[index]} ${veggies.length > 0 && veggies.indexOf(vegg) > -1 ? 'activeBorder' : ""} `].join(" ")} key={index}
												onClick={() => this.addItem(vegg, "veggies")}
											>
												<img className="chefRecIcon" hidden={parseInt(vegg.chef_recommended) === 0} src="./images/chef_recommended.png" alt="" />
												<img alt='sauce' src={vegg.picture} />
												<p className={veggies.length > 0 && veggies.indexOf(vegg) > -1 ? 'textSelected' : ''}>{vegg.name}</p>
												<span className={veggies.length > 0 && veggies.indexOf(vegg) > -1 ? 'textSelected' : ''}
												 hidden={this.state.veggieBaseValue.price === vegg.price}>+ ₹ { vegg.price  - this.state.veggieBaseValue.price }</span>
											</div>
										)
									}
								</section>
							)}

							{selection === 4 && (
								<section>
									<div className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.inbowl_picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.inbowl_picture} />)}
										{veggies.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={el.inbowl_picture} />)
											}
										})}
										{garnish.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={el.inbowl_picture} />)
											}
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.inbowl_picture} />)
										})}
									</div>
									{
										garnishes.map((garn, index) =>
											<div key={index}
												className={[`sauce${this.indexes[index]} ${garnish.length > 0 && garnish.indexOf(garn) > -1 ? 'activeBorder' : ""} `].join(" ")}
												onClick={() => this.addItem(garn, 'garnish')}
											>
												<img className="chefRecIcon" hidden={parseInt(garn.chef_recommended) === 0} src="./images/chef_recommended.png" alt="" />
												<img alt='sauce' src={garn.picture} />
												<p className={garnish.indexOf(garn) > -1 ? 'textSelected' : ''}>{garn.name}</p>
												<span className={garnish.indexOf(garn) > -1 ? 'textSelected' : ''} hidden={this.state.garnishBaseValue.price === garn.price}>+ ₹ { garn.price  - this.state.garnishBaseValue.price }</span>
											</div>
										)
									}
								</section>
							)}

							{selection === 5 && (
								<section>
									<div className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.inbowl_picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.inbowl_picture} />)}
										{veggies.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={el.inbowl_picture} />)
											}
										})}
										{garnish.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={el.inbowl_picture} />)
											}
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.inbowl_picture} />)
										})}
									</div>
									{
										meats.map((data, index) =>
											<div key={index}
												className={[`sauce${this.indexes[index]} ${meat.length > 0 && meat.indexOf(data) > -1 ? 'activeBorder' : ""} `].join(" ")}
												onClick={() => this.addItem(data, "meat")}
											>
												<img className="chefRecIcon" hidden={parseInt(data.chef_recommended) === 0} src="./images/chef_recommended.png" alt="" />
												<img alt='sauce' src={data.picture} />
												<p className={meat.indexOf(data) > -1 ? 'textSelected' : ''}>{data.name}</p>
												<span className={meat.indexOf(data) > -1 ? 'textSelected' : ''} hidden={this.state.meatBaseValue.price === data.price}>+ ₹ { data.price  - this.state.meatBaseValue.price }</span>
											</div>
										)
									}
								</section>
							)}

							{selection === 6 && (
								<section className="sideSection">
									<div hidden={this.state.fromChefCurated} className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.inbowl_picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.inbowl_picture} />)}
										{veggies.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={el.inbowl_picture} />)
											}
										})}
										{garnish.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={el.inbowl_picture} />)
											}
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.inbowl_picture} />)
										})}
									</div>

									<h5>
										Select your <span>sides</span>
									</h5>
									<div style={{ maxHeight: '70%', overflow: 'scroll' }}>
										{
											sides.map((data, index) =>
												<div key={index}
													style={{ background: index % 2 !== 0 ? '#f7efcb' : '#e6d7b1', border: side.indexOf(data) > -1 ? '2px dashed #67023f' : '' }}
													className={['sidesCard', side.name === data.name ? 'sidesCardSelected' : ''].join(' ')}
													onClick={() => this.addItem(data, "side")}
												>
													<img style={{ bottom: '79%', right: '27%' }} className="chefRecIcon" hidden={parseInt(data.chef_recommended) === 0}
														src="./images/chef_recommended.png" alt="" />
													<img alt='French fries' src={data.picture} />
													<p>{data.name}</p>
												</div>
											)
										}
									</div>
								</section>
							)}
						</div>
						<section className="selectSection">
							<div style={{ width: '78%' }}>
								<div className='IndicatorContainer'>
									<IndicatorItem selection={selection} index={0} />
									<IndicatorItem selection={selection} index={1} />
									<IndicatorItem selection={selection} index={2} />
									<IndicatorItem selection={selection} index={3} />
									<IndicatorItem selection={selection} index={4} />
									<IndicatorItem selection={selection} index={5} />
									<IndicatorItem selection={selection} index={6} />
								</div>
								<h2>
									{selection < 6 ? 'Select your ' : ''}
									<span className="selectionText">
										{selection < 6 ? selections[selection] : 'Congratulation!'}
									</span>
								</h2>
								{selection === 3 && <p>(choose any 3)</p>}
								{selection === 4 && <p>(choose any 2)</p>}
								{selection === 5 && <p>(choose any 2)</p>}
								{selection === 6 && !this.state.fromChefCurated && <p> 'Yay! Your pasta is ready to cook</p>}
							</div>
							<div>
								{selection > 0 && (
									<div className="detailCard">

										<div className="insideCard">
											<ul>
												{bowl && (
													<>
														<li className="cardDetailHeading">Bowl</li>
														<li>{bowl.name}</li>
													</>
												)}

											</ul>
											<ul>
												{selection > 0 && (
													<li className="price cardDetailHeading"> &#8377; <span>{totalPrice}</span>
													</li>
												)}
											</ul>
											<ul>
												{Object.keys(sauce).length > 0 && (
													<>
														<li className="cardDetailHeading">Sauces</li>
														<li>{sauce.name}</li>
													</>
												)}
												<br />
												{veggies.length > 0 && (
													<>
														<li className="cardDetailHeading">Veggies</li>
														<li>{JSON.parse(JSON.stringify(veggies.flatMap(_ => _.name).toString()))}</li>
													</>
												)}
												<br />
												{meat.length > 0 && (
													<>
														<li className="cardDetailHeading">Meat</li>
														<li>{JSON.parse(JSON.stringify(meat.flatMap(_ => _.name).toString()))}</li>
													</>
												)}
											</ul>
											<ul>

												{Object.keys(pasta).length > 0 && (
													<>
														<li className="cardDetailHeading">Pasta</li>
														<li>{pasta.name}</li>
													</>
												)}

												<br />

												{garnish.length > 0 && (
													<>
														<li className="cardDetailHeading">Garnish</li>
														<li>{JSON.parse(JSON.stringify(garnish.flatMap(_ => _.name).toString()))}</li>
													</>
												)}
											</ul>
										</div>
									</div>
								)}
							</div>

							<div className="bottomButton">
								<button onClick={() => this.addItemToCart('/cart')}>Your Cart</button>
								<button
									className="ml20"
									onClick={() => selection < 6 ? (!this.nextBtnDisabled() ? this.setState({ selection: selection + 1 }) : "") : this.addItemToCart(this.state.fromChefCurated ? '/cart' : '/congratulations')}
								>
									Next
					  </button>
							</div>
						</section>
					</div>
				</main>
			</div>
		);
	}
}
export default connect(Bowlselect);
