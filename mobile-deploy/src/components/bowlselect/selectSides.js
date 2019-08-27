import React from 'react'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import Summary from './summary'
import Side from './SdPl'
import APIEndPoints from '../../utils/APIEndPoints';
import { ComponentHelpers, connect } from '../../utils/componentHelper'
import httpClient from '../../utils/httpClient';
import Loading from '../loader'

class Bowlselect extends ComponentHelpers {
    constructor() {
        super();
        this.clicked = false;
        this.side = []
        this.state = {
            sides: [],
        }
    }
    cl = (e) => {
        e.target.style.transition = "all 0.5s linear"
        if (this.clicked == false) {
            document.querySelector('.forSumm').style.transform = 'translateY(190px)'
            this.clicked = true;
            e.target.style.transform = 'translateY(-145px)'
            e.target.src = './images/summ1.png'
        } else {
            document.querySelector('.forSumm').style.transform = 'translateY(0px)'
            this.clicked = false;
            e.target.style.transform = 'translateY(0px)'
            e.target.src = './images/ordsm.png'
        }
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })
            this.source = httpClient.getSource()
            const response = await httpClient.ApiCall('post', APIEndPoints.getSides, {
                kitchen_id: this.props.data.kitchen_id
            }, this.source.token)
            this.setState({
                sides: JSON.parse(JSON.stringify(response.data).replace(/picture/g, 'src')),
                loading: false
            })
        } catch (error) {
            if (error.message !== "unMounted") {
                this.setState({ loading: false })
            }
            console.log(error)
        }
    }
    componentWillUnmount() {
        this.source.cancel('unMounted')
    }

    // addSideToProduct = async () => {
    //     this.setState({loading: true})
    //     this.props.placeOrder(Object.assign(this.props.data.placeOrder, { side: this.side }))
    //     this.props.history.push('/congratulations')
    // }

    addItemToCart = async(path) => {
        this.setState({ loading: true })
        if (this.side.length > 0) {
            localStorage.setItem('sides', JSON.stringify(this.side))
        }
        localStorage.setItem('cartItem', JSON.stringify(this.props.data.placeOrder))
        this.setState({ loading: false })
        this.props.history.push(path)
    }
    
    myCart = async()=>{
        await this.addProductToCart(this.props.data.placeOrder);
        this.props.history.push('/cart')
    }

    addSide = (side) => {
        const index = this.side.indexOf(side)
        if (index > -1) {
          this.side.splice(index, 1)
        } else {
          this.side.push(side)
        }
      }

    render() {
        const cost = this.props.data.getOrderPrice()
        return (
            <div className="mainWrapForSect">
                <Loading data={this.state.loading} />
                <div className="bowlSelectContainer updatet forSumm">
                    <div className="circle updatetCircle">
                        <Summary />
                        <Link to="/bowlselect4"><img className="prevBtn" src="./images/prevBtn.png" /></Link>
                        <p hidden={!cost} className="orderTotal">&#8377; {cost}</p>
                        <img onClick={this.cl.bind(this)} className="ordsm" src="./images/ordsm.png"></img>
                        <img className="regMainBowl" src="./images/regularBowl.png" />
                        <div className="slectSideSect">
                            <h5>Congratulations!</h5>
                            <p>You have made your pasta</p>
                        </div>
                    </div>
                    <div className="under-section">
                        <p>Select yor <span>sides</span> </p>
                    </div>
                    <div className='selectSide'>
                        {
                            this.state.sides.map((item, index) => {
                                let style = ''
                                if (index % 2 == 0) {
                                    style = '#FFF0CA'
                                } else {
                                    style = "#E6D7B1"
                                }
                                return < Side handler={(data) => this.addSide(data)} type={'side'} key={index} info={item} style={style} />
                            })
                        }
                    </div>
                    <button onClick={() => this.addItemToCart('/congratulations')} className="nextBtn wtCart">Next</button>
                    <button onClick={()=>this.addItemToCart('/cart')} className="cartBtn">Your cart</button>
                </div>
            </div>
        )
    }
}
export default connect(Bowlselect);