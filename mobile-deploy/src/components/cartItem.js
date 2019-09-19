import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'
import { ComponentHelpers, connect } from '../utils/componentHelper';
import Popup from 'reactjs-popup'
import { FaTrash } from 'react-icons/fa'
import { IconContext } from 'react-icons'


class Crtitem extends ComponentHelpers {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            numChanged: false,
            popupData: '',
            cartItem: {}
        };
    }

    componentDidMount() {
        this.setState({ cartItem: Object.assign({}, this.props.cartData) })
    }

    handler = () => {
        if (this.state.showPopup) {
            this.setState({ showPopup: false });
        } else {
            this.setState({ showPopup: true });
        }
    };

    updateCartQuantity = async (quantity, cart_id) => {
        // console.log(cart_id, quantity)
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

    updateCartItem = async (id) => {
        const cartItems = this.props.cartData
        cartItems['bowl'].name = id === 1 ? "Mini" : 'Regular'
        // cartItems['bowl'].quantity = 
        this.setState({
            loading: true,
            showPopup: false,
            cartItem: cartItems
        })
        await this.updateItemInCart({ bowl: { id }, name: cartItems.name  }, this.state.cartItem && this.state.cartItem.id, 0, 0, cartItems.quantity)
        this.props.handleFun()
        this.setState({ loading: false })
    }

    deleteCartItem = async (cart_id) => {
        this.setState({ loading: true })
        try {
            this.source = httpClient.getSource()
            await httpClient.ApiCall('post', APIEndPoints.deleteCartItem, {
                cart_id,
                kitchen_id: this.props.data.kitchen_id
            }, this.source.token)
            this.setState({ loading: false })
            await this.props.handleFun()
            this.NotificationManager.success('Delete Item', 'Success', 1500)
        } catch (error) {
            if (error.message !== "unMounted") {
                this.NotificationManager.error(error.response.data.message, 'Error', 1500)
                this.setState({ loading: false })
            }
        }
    }

    render() {
        const { cartData: cartItem } = this.props
        var { sauces:sauce, pastas:pasta, vegetables:vegetable, garnishes:garnish, meats:meat } = this.props.cartData
        return (
            <div>
                <Loading data={this.state.loading} />
                {/* {this.state.showPopup
                    ? <Popuprp handler={this.updateCartItem()} />
                    : null} */}

                <div className='crtItemWrap'>
                    <div className='infoSect'>
                        <h4>{cartItem.name}</h4>
                        <p>{this.props.details.names}</p>
                        <div className='tmpWrap'>
                            <span>&#8377; {parseInt(this.props.details.price) * parseInt(cartItem.quantity)}</span>
                                {cartItem['bowl'] ?
                                    <div onClick={() => this.setState({ popupData: cartItem['bowl'], showPopup: true })} className='plType'>
                                        {cartItem['bowl']
                                            ? cartItem['bowl']
                                                .name
                                                .split(" ")[0]
                                            : 'None'}
                                    </div> : ""
                            }

                            <div className="deleteIcon" onClick={() => this.deleteCartItem(cartItem.id)}>
                                <IconContext.Provider value={{ className: 'react-icons' }}>
                                    <FaTrash style={{ marginTop: '-23%', cursor: 'pointer', marginLeft: '2%' }} size="1.5em" />
                                </IconContext.Provider>
                                </div>
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
                        </div>
                    </div>
                    <div className='imgSect'>
                        {
                            cartItem.side || cartItem.extra || cartItem.curated?
                            <img
                            alt=""
                            className='cartImg'
                            src={cartItem.side
                                    ? cartItem.side.picture
                                    : (cartItem.extra
                                        ? cartItem.extra.picture
                                        : (cartItem.curated ? cartItem.curated.picture : './images/miniBowl.png'))} />
                                        :
                                        <div>
                                            <img alt='sauce' className="cartImg" src="./images/miniBowl.png" />
                                            {sauce[0] && sauce.length > 0 && (<img className="sauceInbowlSauceCart" alt='sauce' src={sauce[0].inbowl_picture} />)}
                                            {pasta[0] && pasta.length > 0 && (<img className="sauceInbowlPastaCart" alt='pasta' src={pasta[0].inbowl_picture} />)}
                                            {vegetable && vegetable.map((el, index) => {
                                                return (<img key={index} className={`sauceInbowlVeggie${index}Cart`} alt={`veggie${index}`} src={el.inbowl_picture} />)
                                            })}
                                            {garnish && garnish.map((el, index) => {
                                                return (<img key={index} className={`sauceInbowlGarnish${index}Cart`} alt={`garnish${index}`} src={el.inbowl_picture} />)
                                            })}
                                            {meat && meat.map((data, index) => {
                                                return (<img key={index} className={`sauceInbowlMeat${index}Cart`} alt={`meat${index}`} src={data.inbowl_picture} />)
                                            })}
                                        </div>
                        }

                        <Link
                            hidden={cartItem.side || cartItem.extra || cartItem.curated}
                            to={{
                                pathname: '/editpasta',
                                state: cartItem
                            }}>
                            <button className='edtPastaBtn'>Edit pasta</button>
                        </Link>
                    </div>
                </div>
                <Popup className="itemCartIterator itemCart" open={this.state.showPopup} onClose={() => this.setState({ showPopup: false })}>
                    <div className='pastaRepeatWrap modalContent'>
                        {/* <div className='backgroundClickable' ref={wrapper => (this.wrapper = wrapper)} /> */}
                        <div className='cntr'>
                            <h5>Select Bowl</h5>
                            <p>Your previous customisation</p>
                            <span>{this.state.popupData === '' ? 'None' : this.state.popupData.name}</span>
                            <button onClick={() => this.updateCartItem(1)}>Mini bowl</button>
                            <button onClick={() => this.updateCartItem(2)}>Regular bowl</button>
                        </div>
                    </div>
                </Popup>
            </div>
        );
    }
}
export default connect(Crtitem);
//payment,yourcollection