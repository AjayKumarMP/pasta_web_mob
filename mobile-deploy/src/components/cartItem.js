import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Popuprp from './rpPasta';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
import { ComponentHelpers, connect } from '../utils/componentHelper';


class Crtitem extends ComponentHelpers {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            numChanged: false,
            cartItem:  Object.assign({}, this.props.cartData)
        };
    }

    componentDidMount(){
    }

    handler = () => {
        if (this.state.showPopup) {
            this.setState({ showPopup: false });
        } else {
            this.setState({ showPopup: true });
        }
    };

    updateCartQuantity = async (quantity, cart_id) => {
        console.log(cart_id, quantity)
        this.setState({ loading: true })

        try {
            this.source = httpClient.getSource()
            await httpClient.ApiCall('post', APIEndPoints.updateCartItemQuantity, {
                cart_id,
                quantity
            }, this.source.token)
            this.setState({ loading: false })
        } catch (error) {
            if (error.message !== "unMounted") {
                this.setState({ loading: false })
            }
            console.log(error)
        }
    }

    updateCartItem = async (id)=>{
        const cartItems = this.props.cartData
        cartItems['name'] = id === 1? "Mini": 'Regular'
                this.setState({
                    loading: true,
                    showPopup: false,
                    cartItem: cartItems
                })
        await this.addProductToCart({bowl: {id}})
        this.setState({loading: false})
    }

    render() {
        const cartItem = this.state.cartItem
        return (
            <div>
                <Loading data={this.state.loading} /> 
                {this.state.showPopup
                    ? <Popuprp handler={this.updateCartItem()} />
                    : null}

                <div className='crtItemWrap'>
                    <div className='infoSect'>
                        <h4>{cartItem.name}</h4>
                        <p>{this.props.details.names}</p>
                        <div className='tmpWrap'>
                            <span>&#8377; {this.props.details.price}</span>{
                                cartItem['bowl'] ?
                                    <div onClick={this.handler} className='plType'>
                                        {cartItem['bowl']
                                            ? cartItem['bowl']
                                                .name
                                                .split(" ")[0]
                                            : 'None'}
                                    </div> : ""
                            }
                            {
                                !cartItem['extra'] ?
                                    <div className='changeBtn'>
                                        <span
                                            onClick={() => {
                                                if (cartItem['quantity'] > 1) {
                                                    cartItem['quantity']--;
                                                    this.updateCartQuantity(cartItem.quantity, cartItem.id)
                                                }
                                            }}>
                                            -
                                        </span>
                                        <div>{cartItem['quantity']}</div>
                                        <span
                                            onClick={() => {
                                                if (cartItem['quantity'] < 50) {
                                                    cartItem['quantity']++;
                                                    this.updateCartQuantity(cartItem.quantity, cartItem.id)
                                                }
                                            }}>
                                            +
                                </span>
                                    </div>
                                    : ''
                            }
                        </div>
                    </div>
                    <div className='imgSect'>
                        <img
                            alt=""
                            className='cartImg'
                            src={cartItem.bowl !== null
                                ? cartItem.bowl.picture
                                : (cartItem.side
                                    ? cartItem.side.picture
                                    : (cartItem.extra
                                        ? cartItem.extra.picture
                                        : (cartItem.curated ? cartItem.curated.picture : './images/miniBowl.png')))} />

                        <Link
                            to={{
                                pathname: '/editpasta',
                                state: cartItem
                            }}>
                            <button className='edtPastaBtn'>Edit pasta</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(Crtitem);
//payment,yourcollection