import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'

import '../shared.scss';
import { ReactComponent as BackLogo } from '../assets/icons/back2.svg';
import curatedImage from '../assets/images/curated-item-pic.png';
import { ReactComponent as GreenPin } from '../assets/icons/pin.svg';
import { ComponentHelpers, connect } from '../utils/componentHelper';


class CheffCurated extends ComponentHelpers {
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
            localStorage.getItem('chefCurated')
            this.setState({ loading: true })
            const response = await httpClient.ApiCall('post', APIEndPoints.getChefCurated, {
                kitchen_id: this.state.kitchen_id
            })
            this.setState({CheffCurated: response.data})
            const data = await httpClient.ApiCall('post', APIEndPoints.getCartItems)
            data.data && data.data.items && data.data.items.filter(_ => _.curated !== null).forEach(_ => this.selectItems(_.curated))
            this.setState({
                loading: false
            })
        } catch (error) {
            this.setState({ loading: false })
        }
    }

    addToCart = async () => {
        this.setState({ loading: true })
        if (this.props.data.isUserLoggedIn()) {
            if (this.state.itemsInCart.length > 0) {
                await Promise.all(
                    this.state.itemsInCart.map(data => this.addProductToCart({}, 0, 0, 1, data))
                )
            }
        } else {
            localStorage.setItem('curated', JSON.stringify(this.state.itemsInCart))
        }
        localStorage.setItem('chefCurated', '/cheff')
        this.props.history.push('/bowlselect1')
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
        const { loading, CheffCurated, itemsInCart } = this.state
        return (
            <div className='container' style={{ width: '90%' }}>
                <Loading data={loading} />
                <div className='wrapper'>
                    <div className='header'>
                        <Link to='/'>
                            <BackLogo />
                        </Link>
                        Chef curated
                  <div hidden={itemsInCart.length <= 0} onClick={() => this.addToCart()} style={{ marginLeft: '52%' }}>
                            <p style={{ width: '130%', paddingTop: '7%', height: '52px', borderRadius: '21px' }} className="couponBtn">Checkout</p>
                        </div>
                    </div>
                    <div className='curatedItemsContainer'>

                        {CheffCurated.map((data, index) =>
                            <div key={index} className='curatedItem'>
                                <img src={data.picture} alt="Potato cheese dish" />
                                <div className='curatedItemContent'>
                                    <h5>{data.name}</h5>
                                    <GreenPin />
                                    <p>{data.description}</p>
                                    <span>&#x20B9; {parseInt(data.price)}</span>
                                    <button onClick={() => this.selectItems(data)}> {itemsInCart.indexOf(data.id) > -1 ? "Added" : "Add to cart"}</button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        );
    }

}
export default connect(CheffCurated);
