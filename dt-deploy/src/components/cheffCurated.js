import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import httpClient from '../utils/httpClient';
import APIEndPoints from '../utils/APIEndPoints';
import Loading from './loader'

import '../shared.scss';
import { ReactComponent as BackLogo } from '../assets/icons/back2.svg';
import curatedImage from '../assets/images/curated-item-pic.png';
import { ReactComponent as GreenPin } from  '../assets/icons/pin.svg';
import { ComponentHelpers, connect } from '../utils/componentHelper';


class CheffCurated extends ComponentHelpers
 {
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
                CheffCurated: response.data,
                loading: false
            })
        } catch (error) {
            this.setState({ loading: false })
            console.log(error)
        }
    }

    addToCart = ()=>{
            localStorage.setItem('curated', JSON.stringify(this.state.itemsInCart))
            this.props.history.push('/cart')
    }
    
    selectItems = (data)=>{
        const index = this.state.itemsInCart.indexOf(data.id)
        const cartItems = this.state.itemsInCart
        if(index > -1){
            cartItems.splice(index, 1)
        } else {
            cartItems.push(data.id)
        }
        this.setState({itemsInCart: cartItems})
    }

    componentWillUnmount(){
        this.source && this.source.cancel("unMounted")
    }

    render() {
        const {loading, CheffCurated, itemsInCart} = this.state
        return (
            <div className='container'>
            <Loading data={loading}/>
              <div className='wrapper'>
                <div className='header'>
                  <Link to='/'>
                    <BackLogo />
                  </Link>
                  Chef curated
                
                </div>
                <div className='curatedItemsContainer'>

                {CheffCurated.map((data, index)=>
                    <div key={index} className='curatedItem'>
                        <img src={data.picture} alt="Potato cheese dish"/>
                        <div className='curatedItemContent'>
                            <h5>{data.name}</h5>
                            <GreenPin />
                            <p>{data.description}</p>
                            <span>&#x20B9; {parseInt(data.price)}</span>
                            <button onClick={()=>this.selectItems(data)}>&#43; {itemsInCart.indexOf(data.id) > -1?"Added":"Add To Cart"}</button>
                        </div>
                    </div>
                )}
                </div>
                <div hidden={itemsInCart.length <= 0} onClick={()=>this.addToCart()} style={{alignContent: 'baseline',marginLeft: '40%'}}>
                  <p style={{width: '22%', paddingTop:'2%', background: 'black'}} className="couponBtn">Checkout</p>
                </div>
             </div>
            </div>
          );
    }

}
export default connect(CheffCurated);
