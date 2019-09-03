import { ADD_USER_DETAILS, ADD_TO_CART, PLACE_ORDER, ADD_BOWLS, ADD_MY_ADDRESSES, ADD_MY_FAVOURITES } from '../constants/action-types'
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
    kitchen_id: 2,
    getOrderPrice: () => {},
    placeOrder: { bowl: {}, sauce: {}, pasta: {}, garnish: {}, meat: {}, vegetable: {}, side: {} },
    isUserLoggedIn: () => {
        const user = localStorage.getItem('user')
        const userDetails = user !== 'undefined' && user !== undefined && user !== null && user !== 'null' ? JSON.parse(user) : ''
        return (userDetails !== '' && userDetails.access_token !== undefined)
    },
    bowls: [],
    myFavourites: [],
    contactUsInfo: [{ email: 'about_us@pastaproject.in', link: '#' }],
    saucesTypes: [
        { name: 'Alfredo', price: 100, src: './images/sauce3.png' },
        { name: 'Agilo olio', price: 120, src: './images/sauce2.png' },
        { name: 'Arrabiata', price: 130, src: './images/sauce1.png' },
        { name: 'Pesto', price: 140, src: './images/sauce4.png' },
        { name: 'Mushroom', price: 150, src: './images/sauce5.png' },
        { name: 'egg', price: 150, src: './images/sauce5.png' },

    ],
    pastaTypes: [
        { name: 'Penne', src: './images/pasta1.png' },
        { name: 'Spaghetti', src: './images/pasta2.png' },
        { name: 'Elbow Macaroni', src: './images/pasta3.png', kk: './images/krown.png' },
        { name: 'Quinoa Penne', src: './images/pasta4.png' },
        { name: 'Whole wheat Spaghetti', src: './images/pasta5.png' },
        { name: 'Whole wheat Spaghetti222', src: './images/pasta5.png' },
        { name: 'Quinoa Penne', src: './images/pasta4.png' },
    ],
    veggiesTypes: [
        { name: 'Zucchini', src: './images/vegg4.png' },
        { name: 'Cherry Tomatoes', src: './images/vegg5.png' },
        { name: 'Broccoli', src: './images/vegg1.png' },
        { name: 'Bell Pepper', src: './images/vegg2.png' },
        { name: 'Mushroom', src: './images/vegg3.png' },
        { name: 'Zucchini', src: './images/vegg4.png' },
        { name: 'Cherry Tomatoes', src: './images/vegg5.png' },
    ],
    garnishTypes: [
        { name: 'Parsley', src: './images/garn4.png', kk: './images/kk2.png' },
        { name: 'Parmesan cheese', src: './images/garn5.png' },
        { name: 'Black olives', src: './images/garn1.png' },
        { name: 'Sundried tomato', src: './images/garn2.png' },
        { name: 'Basil', src: './images/garn3.png', kk: './images/krown.png' },
        { name: 'Parsley', src: './images/garn4.png', kk: './images/kk2.png' },
        { name: 'Parmesan cheese', src: './images/garn5.png' },
    ],
    meatTypes: [
        { name: 'Chicken sausage', src: './images/meat4.png' },
        { name: 'Meatballs', src: './images/meat5.png' },
        { name: 'Grilled chicken', src: './images/meat1.png' },
        { name: 'Shrimp', src: './images/meat2.png' },
        { name: 'Bacon', src: './images/meat3.png', kk: './images/krown.png' },
        { name: 'Chicken sausage', src: './images/meat4.png' },
        { name: 'Meatballs', src: './images/meat5.png' },
    ],
    sidesTypes: [
        { name: 'Garlic bread', src: './images/side1.png' },
        { name: 'Farm fresh salad', src: './images/side2.png' },
        { name: 'Cheese potatoes' },
        { name: 'French fries', src: './images/side3.png' },
    ],
    addresessHome: [{
            name: 'Mayan Sachan',
            phone: '9415 730 069',
            email: 'mayansach@gmail.com',
            street: '1912, Block A, Sector 45, Gurugram, Haryana, India 122003',
        },
        {
            name: 'Mayan Sachan',
            phone: '9415 730 069',
            email: 'mayansach@gmail.com',
            street: '1912, Block A, Sector 45, Gurugram, Haryana, India 122003',
        },
        {
            name: 'Mayan Sachan',
            phone: '9415 730 069',
            email: 'mayansach@gmail.com',
            street: '1912, Block A, Sector 45, Gurugram, Haryana, India 122003',
        },
        {
            name: 'Mayan Sachan',
            phone: '9415 730 069',
            email: 'mayansach@gmail.com',
            street: '1912, Block A, Sector 45, Gurugram, Haryana, India 122003',
        },
    ],
    cartItems: [{
        name: 'Alfredo Spagetti',
        ingr: 'Broccoli, Bell pepper, Mushroom  Chicken sausage, Black olives,   Parsley, Farm fresh salad.',
        plate: 'regular',
        price: 250,
    }, ],
    cheffCurated: [{
            name: 'Alfredo penne olives',
            ingr: 'White sauce, penne, olives, broccoli, black pepper and extra cheese',
            price: 250,
            src: './images/chf1.png',
        },
        {
            name: 'Alfredo penne olives',
            ingr: 'White sauce, penne, olives, broccoli, black pepper and extra cheese',
            price: 250,
            src: './images/chf1.png',
        },
    ],
    myOrders: [{
            to: 'Mayan Sachan',
            ordNum: 'ABCDEF123456',
            tot: 100,
            status: 'delivered',
            date: '12/06/19',
            status: 'delivered',
        },
        {
            to: 'Mayan Sachan',
            ordNum: 'ABCDEF123456',
            tot: 100,
            status: 'delivered',
            date: '12/06/19',
            status: 'delivered',
        },
    ],
    yourCollection: [
        { name: 'Alfredo spaghetti', src: './images/cc.png', price: 250 },
        { name: 'Alfredo spaghetti', src: './images/cc.png', price: 250 },
        { name: 'Alfredo spaghetti', src: './images/cc.png', price: 250 },
        { name: 'Alfredo spaghetti', src: './images/cc.png', price: 250 },
    ],
    itemTotal: {
        iTot: 200.5,
        pS: 20.0,
        tax: 20.0,
        disc: 50.0,
        grandTot: 220.5,
        d: [
            { name: 'Alfredo Spagetti', cnt: 2, tot: 400 },
            { name: 'Alfredo Spagetti', cnt: 2, tot: 400 },
            { name: 'Alfredo Spagetti', cnt: 2, tot: 400 },
        ],
    },

    availableCoupons: [{
            name: 'pasta50',
            headInfo: 'Get 50% discount on your first order using the code',
            mainInfo: 'Use code pasta50 and you can get a 50% discount upto Rs. 200 and an additional value offer. ',
            src: '',
        },
        {
            name: 'PAYTM50',
            headInfo: 'Get 50% discount on your first order using the code',
            mainInfo: 'Use code pasta50 and you can get a 50% discount upto Rs. 200 and an additional value offer. ',
            src: './images/pyt.png',
        },
    ],
    paymentMethod: [
        { name: 'Paytm', src: './images/pyt.png' },
        { name: 'Google Pay', src: './images/google.png' },
        { name: 'Amazon Pay', src: './images/amazon.png' },
        { name: 'Cash on Delivery', src: '' },
        { name: 'Cash on Delivery', src: '' },
    ],
    desserts: [
        { name: 'Dark chocolate brownie', price: 250, src: './images/browni.png' },
        { name: 'Dark chocolate brownie', price: 250, src: './images/browni.png' },
        { name: 'Dark chocolate brownie', price: 250, src: './images/browni.png' },
        { name: 'Dark chocolate brownie', price: 250, src: './images/browni.png' },
    ],
    userDetails: {}
};


export default rootReducer;