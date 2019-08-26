import React from 'react';
import {Route, Link, BrowserRouter as Router} from 'react-router-dom';
import {connect} from 'react-redux';
import Popuprp from './rpPasta';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'

let mapStateToProps = state => {
    return {data: state};
};

class Crtitem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            numChanged: false
        };
    }
    handler = () => {
        if (this.state.showPopup) {
            this.setState({showPopup: false});
        } else {
            this.setState({showPopup: true});
        }
    };

    updateCart = async(quantity, cart_id) => {
        console.log(cart_id, quantity)
        this.setState({loading: true})

        try {
            this.source = httpClient.getSource()
            await httpClient.ApiCall('post', APIEndPoints.updateCartItem, {
                cart_id,
                quantity
            }, this.source.token)
            this.setState({loading: false})
        } catch (error) {
            if (error.message !== "unMounted") {
                this.setState({loading: false})
            }
            console.log(error)
        }
    }

    render() {
        const cartItem = this.props.cartData
        this.names = ""
        this.price = 0

        Object
            .keys(cartItem)
            .forEach((key, index) => {
                this.names += cartItem[key] && cartItem[key].name
                    ? cartItem[key].name
                    : ''
                this.price += cartItem[key] && cartItem[key].price
                    ? parseInt(cartItem[key].price)
                    : 0
                if (index + 1 !== Object.keys(cartItem).length && cartItem[key] && cartItem[key].name) {
                    this.names += ", "
                }
            })
        return (
            <div>
                <Loading data={this.state.loading}/> {this.state.showPopup
                    ? <Popuprp handler={this.handler}/>
                    : null}

                <div className='crtItemWrap'>
                    <div className='infoSect'>
                        <h4>{cartItem.name}</h4>
                        <p>{this.names}.</p>
                        <div className='tmpWrap'>
                            <span>&#8377; {this.price}</span>
                            <div onClick={this.handler} className='plType'>
                                {cartItem['bowl']
                                    ? cartItem['bowl']
                                        .name
                                        .split(" ")[0]
                                    : 'None'}
                            </div>
                            <div className='changeBtn'>
                                <span
                                    onClick={() => {
                                    if (cartItem['quantity'] > 1) {
                                        cartItem['quantity']--;
                                        this.updateCart(cartItem.quantity, cartItem.id)
                                    }
                                }}>
                                    -
                                </span>
                                <div>{cartItem['quantity']}</div>
                                <span
                                    onClick={() => {
                                    if (cartItem['quantity'] < 50) {
                                        cartItem['quantity']++;
                                        this.updateCart(cartItem.quantity, cartItem.id)
                                    }
                                }}>
                                    +
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='imgSect'>
                        <img
						alt=""
                            className='cartImg'
                            src={cartItem.bowl !== null
                            ? cartItem.bowl.src
                            : (cartItem.side
                                ? cartItem.side.src
                                : (cartItem.extra
                                    ? cartItem.extra.src
                                    : (cartItem.curated?cartItem.curated.src: './images/miniBowl.png')))}/>

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
export default connect(mapStateToProps)(Crtitem);
//payment,yourcollection