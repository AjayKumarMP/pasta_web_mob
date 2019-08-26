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
            animationMiniStyle: { opacity: 0.4, left: '42%', top: '-9.5%' },
            bowlSize: { reg: '69%', mini: '55%' },
            animationRegularStyle: { opacity: 0.4, left: '41%', top: '61%' },
            bowls: [],
        };
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })
            this.source = httpClient.getSource()
            httpClient.ApiCall('post', APIEndPoints.getBowls, {
                kitchen_id: this.state.kitchen_id
            }, this.source.token).then(response => {
                this.props.addBowls(response.data)
                response.data.forEach(bowl => {
                    if (bowl.name === 'Mini Bowl') {
                        this.setState({
                            animationMiniStyle: {
                                opacity: 1,
                                left: '42%',
                                top: '-9.5%'
                            },
                            bowls: response.data,
                            loading: false,
                        })
                    } else {
                        this.setState({
                            animationRegularStyle: {
                                opacity: 1,
                                left: '41%',
                                top: '61%',

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
                this.setState({
                    sauces: response.data,
                })
            })

            this.sourcePastas = httpClient.getSource()
            httpClient.ApiCall('post', APIEndPoints.getPastas, {
                kitchen_id: this.props.data.kitchen_id
            }, this.sourcePastas.token).then(response => {
                this.setState({
                    pastas: response.data,
                })
            })

            this.sourceVeggies = httpClient.getSource()
            httpClient.ApiCall('post', APIEndPoints.getVeggies, {
                kitchen_id: this.props.data.kitchen_id
            }, this.sourceVeggies.token).then(response => {
                this.setState({
                    veggiesList: response.data,
                })
            })

            this.sourceGarnishes = httpClient.getSource()
            httpClient.ApiCall('post', APIEndPoints.getGarnishes, {
                kitchen_id: this.props.data.kitchen_id
            }, this.sourceGarnishes.token).then(response => {
                this.setState({
                    garnishes: response.data,
                })
            })
            this.sourceMeats = httpClient.getSource()
            httpClient.ApiCall('post', APIEndPoints.getMeats, {
                kitchen_id: this.props.data.kitchen_id
            }, this.sourceMeats.token).then(response => {
                this.setState({
                    meats: response.data,
                })
            })
            this.sourceSides = httpClient.getSource()
            httpClient.ApiCall('post', APIEndPoints.getSides, {
                kitchen_id: this.props.data.kitchen_id
            }, this.sourceSides.token).then(response => {
                this.setState({
                    sides: response.data,
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
        this.source.cancel("unMounted")
        this.sourceSauces.cancel("unMounted")
        this.sourcePastas.cancel("unMounted")
        this.sourceVeggies.cancel("unMounted")
        this.sourceGarnishes.cancel("unMounted")
        this.sourceMeats.cancel("unMounted")
        this.sourceSides.cancel("unMounted")
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
            const select = this.state.bowls.filter(val => val.name.toLowerCase() === "mini bowl")
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
        const { veggies, meat, garnish, side, selection, totalPrice } = this.state
        console.log(selection)
        let price = totalPrice
        switch (type) {
            case 'veggies':
                {
                    const index = veggies.indexOf(item)
                    index > -1 ? veggies.splice(index, 1) && (price -= parseInt(item.price)) : veggies.push(item) && (price += parseInt(item.price))
                    this.setState({ veggies: veggies, totalPrice: price })
                    break
                }
            case 'meat':
                {
                    const index = meat.indexOf(item)
                    index > -1 ? meat.splice(index, 1) && (price -= parseInt(item.price)) : meat.push(item) && (price += parseInt(item.price))
                    this.setState({ meat: meat, totalPrice: price })
                    break
                }
            case 'garnish':
                {
                    const index = garnish.indexOf(item)
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
            default:
                break
        }
    }

    nextBtnDisabled() {
        return this.state.loading || (this.state.selection === 0 && Object.keys(this.state.bowl).length === 0)
    }

    addItemToCart = async(path) => {
        this.setState({ loading: true })
        if (this.state.side.length > 0) {
            localStorage.setItem('sides', JSON.stringify(this.state.side))
        }
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
			<div className="pastaContainer">
				<Loading data={loading} />
				<title>Pasta</title>
				<main className="background">
					<div className="wrapper">
						<div className="leftSide">
							<div className="sideImage">
								<img alt='Side background' src={sideImage} />
							</div>

							<div className="backLogo">
								<BackLogo onClick={() => selection === 0 ? this.props.history.push('/') : this.setState({ selection: selection - 1 })} />
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
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.picture} />)}
										{veggies.map((veg, index) => {
											return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={veg.picture} />)
										})}
										{garnish.map((gar, index) => {
											return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={gar.picture} />)
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.picture} />)
										})}
									</div>
									{
										sauces.map((sauc, index) =>
											<div key={index} className={`sauce${this.indexes[index]}`} onClick={() => sauce.name === sauc.name ?
												this.setState({ sauce: {}, totalPrice: totalPrice - parseInt(sauc.price) }) :
												this.setState({ sauce: sauc, totalPrice: totalPrice + parseInt(sauc.price) })}>
												<img alt='sauce' className={sauce.name === sauc.name ? 'activeBorder' : ''} src={sauc.picture} />
												<p className={sauce.name === sauc.name ? 'textSelected' : ''}>{sauc.name}</p>
											</div>
										)
									}
								</section>
							)}

							{selection === 2 && (
								<section>
									<div className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.picture} />)}
										{veggies.map((el, index) => {
											return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={el.picture} />)
										})}
										{garnish.map((el, index) => {
											return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={el.picture} />)
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.picture} />)
										})}
									</div>
									{
										pastas.map((past, index) =>

											<div key={index} className={`sauce${this.indexes[index]}`} onClick={() => pasta.name === past.name ?
												this.setState({ pasta: {}, totalPrice: totalPrice - parseInt(past.price) }) :
												this.setState({ pasta: past, totalPrice: totalPrice + parseInt(past.price) })}>
												<img alt='sauce' className={pasta.name === past.name ? 'activeBorder' : ''} src={past.picture} />
												<p className={past.name === pasta.name ? 'textSelected' : ''}>{past.name}</p>
											</div>
										)
									}
								</section>
							)}

							{selection === 3 && (
								<section>
									<div className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.picture} />)}
										{veggies.length > 0 && veggies.map((el, index) => {
											return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={el.picture} />)
										})}
										{garnish.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={el.picture} />)
											}
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.picture} />)
										})}
										{/* {Object.keys(meat).length > 0 && (<img className="sauceInbowlMeat" alt='meat' src={meat.picture} />)} */}
									</div>
									{
										veggiesList.map((vegg, index) =>
											<div key={index}
												className={`sauce${this.indexes[index]}`} key={index}
												onClick={() => this.addItem(vegg, "veggies")}
											>
												<img alt='sauce' className={veggies.length > 0 && veggies.indexOf(vegg) > -1 ? 'activeBorder' : ''} src={vegg.picture} />
												<p className={veggies.length > 0 && veggies.indexOf(vegg) > -1 ? 'textSelected' : ''}>{vegg.name}</p>
											</div>
										)
									}
								</section>
							)}

							{selection === 4 && (
								<section>
									<div className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.picture} />)}
										{veggies.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={el.picture} />)
											}
										})}
										{garnish.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={el.picture} />)
											}
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.picture} />)
										})}
									</div>
									{
										garnishes.map((garn, index) =>
											<div key={index}
												className={`sauce${this.indexes[index]}`}
												onClick={() => this.addItem(garn, 'garnish')}
											>
												<img alt='sauce' className={garnish.indexOf(garn) > -1 ? 'activeBorder' : ''} src={garn.picture} />
												<p className={garnish.indexOf(garn) > -1 ? 'textSelected' : ''}>{garn.name}</p>
											</div>
										)
									}
								</section>
							)}

							{selection === 5 && (
								<section>
									<div className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.picture} />)}
										{veggies.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={el.picture} />)
											}
										})}
										{garnish.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={el.picture} />)
											}
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.picture} />)
										})}
									</div>
									{
										meats.map((data, index) =>
											<div key={index}
												className={`sauce${this.indexes[index]}`}
												onClick={() => this.addItem(data, "meat")}
											>
												<img alt='sauce' className={meat.indexOf(data) > -1 ? 'activeBorder' : ''} src={data.picture} />
												<p className={meat.indexOf(data) > -1 ? 'textSelected' : ''}>{data.name}</p>
											</div>
										)
									}
								</section>
							)}

							{selection === 6 && (
								<section className="sideSection">
									<div className="sauceBowl">
										<img alt='sauce' src={bowlImage} />
										{Object.keys(sauce).length > 0 && (<img className="sauceInbowlSauce" alt='sauce' src={sauce.picture} />)}
										{Object.keys(pasta).length > 0 && (<img className="sauceInbowlPasta" alt='pasta' src={pasta.picture} />)}
										{veggies.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlVeggie${index}`} alt={`veggie${index}`} src={el.picture} />)
											}
										})}
										{garnish.map((el, index) => {
											if (el !== "") {
												return (<img key={index} className={`sauceInbowlGarnish${index}`} alt={`garnish${index}`} src={el.picture} />)
											}
										})}
										{meat.map((data, index) => {
											return (<img key={index} className={`sauceInbowlMeat`} alt={`meat${index}`} src={data.picture} />)
										})}
									</div>

									<h5>
										Select your <span>sides</span>
									</h5>
									<div style={{ maxHeight: '37%', overflow: 'scroll' }}>
										{
											sides.map((data, index) =>
												<div key={index}
													style={{ background: index % 2 !== 0 ? '#f7efcb' : '#e6d7b1', border: side.indexOf(data) > -1 ? '2px dashed #67023f' : '' }}
													className={['sidesCard', side.name === data.name ? 'sidesCardSelected' : ''].join(' ')}
													onClick={() => this.addItem(data, "side")}
												>
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
								{selection === 6 && <p> You have made your pasta</p>}
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
								<button onClick={() => this.addItemToCart('/cart')} hidden={selection === 0}>Your Cart</button>
								<button disabled={this.nextBtnDisabled()}
									className="ml20"
									onClick={() => selection < 6 ? this.setState({ selection: selection + 1 }) : this.addItemToCart('/congratulations')}
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
