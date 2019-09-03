import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import CheffItem from './chfPl'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
import { ComponentHelpers, connect } from '../utils/componentHelper';



class CheffCurated extends ComponentHelpers{
    constructor(props) {
        super(props);
        this.state = {
            kitchen_id: 2,
            CheffCurated: [],
            loading: true,
            itemsInCart: []
        }
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })
            const response = await httpClient.ApiCall('post', APIEndPoints.getChefCurated, {
                kitchen_id: this.state.kitchen_id
            })
            this.setState({
                CheffCurated: JSON.parse(JSON.stringify(response.data).replace(/picture/g, 'src')),
                loading: false
            })
        } catch (error) {
            this.setState({ loading: false })
            console.log(error)
        }
    }

    addToCart = async () => {
        this.setState({loading: true})
        if(this.props.data.isUserLoggedIn()){
            if (this.state.itemsInCart.length > 0) {
                await Promise.all(
                    this.state.itemsInCart.map(data => this.addProductToCart({}, 0, 0, 1, data))
                )
            }
            this.props.history.push('/cart')
        } else {
            localStorage.setItem('curated', JSON.stringify(this.state.itemsInCart))
            this.props.history.push('/cart')
        }
    }

    selectItems = (data) => {
        const index = this.state.itemsInCart.indexOf(data.id)
        const cartItems = this.state.itemsInCart
        if (index > -1) {
            cartItems.splice(index, 1)
        } else {
            cartItems.push(data.id)
        }
        this.setState({ itemsInCart: cartItems })
    }

    componentWillUnmount() {
        this.source && this.source.cancel("unMounted")
    }

    render() {
        return (
            <div style={{ paddingBottom: this.state.loading ? '60%' : '0%', overflowY: 'auto'}}>
                <Loading data={this.state.loading} />
                <div className="cheffCurMainWrap">
                    <div className="headContCheff">
                        <Link to="/"><img className="btnPr" src="./images/prevBtn.png" /></Link>
                        {/* <h5 className="srch">Search</h5> */}
                        <h2 className="headH2">Chef curated</h2>
                    </div>
                    <div className="cheffCuratedMainCont" style={{textAlign: 'center'}}>
                        {
                            this.state.CheffCurated.map((item, index) => {
                                return <CheffItem handler={this.selectItems} info={item} key={index} />
                            })
                        }
                    </div>
                    <div >
                  <button hidden={this.state.itemsInCart.length <= 0} onClick={()=>this.addToCart()} className="couponBtn chefCheckBtn">Checkout</button>
                </div>
                </div>
            </div>
        )
    }

}
export default connect(CheffCurated);
