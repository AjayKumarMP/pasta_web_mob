import React from 'react';
import { connect } from 'react-redux'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import CheffItem from './chfPl'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'

let mapStateToProps = (state) => {
    return { data: state }
}


class CheffCurated extends React.Component {
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

    addToCart = () => {
        localStorage.setItem('curated', JSON.stringify(this.state.itemsInCart))
        this.props.history.push('/cart')
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
            <div style={{ paddingBottom: this.state.loading ? '60%' : '0%' }}>
                <Loading data={this.state.loading} />
                <div className="cheffCurMainWrap">
                    <div className="headContCheff">
                        <Link to="/"><img className="btnPr" src="./images/prevBtn.png" /></Link>
                        <h5 className="srch">Search</h5>
                        <h2 className="headH2">Chef curated</h2>
                    </div>
                    <div className="cheffCuratedMainCont">
                        {
                            this.state.CheffCurated.map((item, index) => {
                                return <CheffItem handler={this.selectItems} info={item} key={index} />
                            })
                        }
                    </div>
                    <div hidden={this.state.itemsInCart.length <= 0} onClick={()=>this.addToCart()} style={{alignContent: 'baseline',marginLeft: '33%'}}>
                  <p className="couponBtn chefCheckBtn">Checkout</p>
                </div>
                </div>
            </div>
        )
    }

}
export default connect(mapStateToProps)(CheffCurated);
