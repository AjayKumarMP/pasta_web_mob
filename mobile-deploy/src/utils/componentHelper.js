import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { addBowls, addMyAddress, addMyfavourites, placeOrder } from '../actions/actions'
import httpClient from './httpClient';
import APIEndPoints from './APIEndPoints';

let mapStateToProps = (state) => {
    return { data: state }
}

let mapDispatchToProps = (dispatch) => {
    return {
        addBowls: bowls => dispatch(addBowls(bowls)),
        addMyAddAddress: addresses => dispatch(addMyAddress(addresses)),
        addMyFavourites: favourites => dispatch(addMyfavourites(favourites)),
        placeOrder: order => dispatch(placeOrder(order))
    }
}

export class ComponentHelpers extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }
    }

    async init() {
        try {
            var response = await httpClient.ApiCall('post', APIEndPoints.myAddressList)
            this.props.addMyAddAddress(response.data)
            const res = await httpClient.ApiCall('post', APIEndPoints.myFavourites)
            response = JSON.parse(JSON.stringify(res.data[0]).replace(/picture/g, "src"))
            var favorits = [response.bowl, response.meat, response.pasta, response.sauce,
                response.side, response.vegetable
            ]
            favorits = favorits.filter(_ => _)
            this.props.addMyFavourites(favorits)
        } catch (error) {
            console.log(error)
        }
    }

    addProductToCart = async(order, side_id = 0, extra_id = 0, quantity = 1, curated_id = 0) => {
        try {
            const requestObject = {
                kitchen_id: this.props.data.kitchen_id,
                name: order.name ? order.name : '',
                bowl_id: order.bowl ? order.bowl.id : 0,
                sauce_id: order.sauce ? order.sauce.id : 0,
                pasta_id: order.pasta ? order.pasta.id : 0,
                garnish_id: order.garnish && order.garnish.length > 0 ? order.garnish.flatMap(_ => _.id).toString() : 0,
                meat_id: order.meat && order.meat.length > 0 ? order.meat.flatMap(_ => _.id).toString() : 0,
                vegetable_id: order.veggies && order.veggies.length > 0 ? order.veggies.flatMap(_ => _.id).toString() : 0,
                side_id,
                extra_id,
                quantity,
                curated_id
            }
            this.source = httpClient.getSource()
            await httpClient.ApiCall('post', APIEndPoints.addToCart, requestObject, this.source.token)
        } catch (error) {
            console.log(error)
        }
    }

    getMyAddresses = () => {
        return this.props.data.addresessHome
    }

    verifyOtp = async(confirmation_code, otp) => {
        const response = await httpClient.ApiCall('post', APIEndPoints.verifyOtp, {
            confirmation_code,
            otp
        })
        localStorage.setItem('user', JSON.stringify(response.data))
        httpClient.setDefaultHeader('access-token', response.data ? response.data.access_token : "")
        const url = localStorage.getItem('URL')
        if (url) {
            localStorage.removeItem('URL')
            this.props.history.push(url)
        }
    }
}

export function connect(Component) {
    return reduxConnect(
        mapStateToProps, mapDispatchToProps
    )(Component);
}

export default connect(ComponentHelpers)

// export default connect(mapStateToProps, mapDispatchToProps)(ComponentHelpers)(Component);