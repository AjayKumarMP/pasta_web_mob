import {
    ADD_USER_DETAILS, ADD_TO_CART, PLACE_ORDER, ADD_BOWLS,
    ADD_MY_ADDRESSES, ADD_MY_FAVOURITES, ADD_KITCHEN_ID
} from '../constants/action-types'
import { isNumber } from 'util';



function rootReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_USER_DETAILS:
            return Object.assign({}, state, {
                userDetails: action.payload
            });
        case ADD_TO_CART:
            return Object.assign({}, state, {
                cartItems: state.cartItems.concat(action.payload)
            })
        case PLACE_ORDER:
            return Object.assign({}, state, {
                placeOrder: action.payload,
                getOrderPrice: () => {
                    var sum = 0
                    Object.keys(action.payload).forEach(key => {
                        if (isNumber(action.payload[key].price)) {
                            sum += action.payload[key].price
                        }
                    })
                    return sum
                }

            })
        case ADD_BOWLS:
            return Object.assign({}, state, {
                bowls: action.payload
            })
        case ADD_MY_ADDRESSES:
            return Object.assign({}, state, {
                addresessHome: state.addresessHome.concat(action.payload)
            })
        case ADD_MY_FAVOURITES:
            return Object.assign({}, state, {
                myFavourites: state.myFavourites.concat(action.payload)
            })
        case ADD_KITCHEN_ID:
            return Object.assign({}, state, {
                kitchen_id: action.payload
            })
        default:
            return state
    }
}

const initialState = {
    bow: '',
    pasta: '',
    garnish: '',
    meet: '',
    sauce: '',
    veggies: '',
    bowlsNum: 1,
    potatoesNum: 1,
    price: 0,
    pastaName: '',
    checkLogout: false,
    kitchen_id: localStorage.getItem('kitchen_id'),
    getOrderPrice: () => { },
    placeOrder: { bowl: {}, sauce: {}, pasta: {}, garnish: {}, meat: {}, vegetable: {}, side: {} },
    isUserLoggedIn: () => {
        const user = localStorage.getItem('user')
        const userDetails = user !== 'undefined' && user !== undefined && user !== null && user !== 'null' ? JSON.parse(user) : ''
        return (userDetails !== '' && userDetails.access_token !== undefined)
    },
    bowls: [],
    myFavourites: [],
    contactUsInfo: [{ email: 'about_us@pastaproject.in', link: '#' }],
    paymentMethod: [
        { name: 'Paytm', src: './images/pyt.png' },
        { name: 'Google Pay', src: './images/google.png' },
        { name: 'Amazon Pay', src: './images/amazon.png' },
        { name: 'Cash on Delivery', src: '' },
        { name: 'Cash on Delivery', src: '' },
    ],
    userDetails: {}
};


export default rootReducer;