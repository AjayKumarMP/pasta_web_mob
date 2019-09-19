import {
    ADD_USER_DETAILS, ADD_TO_CART, PLACE_ORDER, ADD_BOWLS, ADD_MY_ADDRESSES,
    ADD_MY_FAVOURITES, ADD_CURATED, ADD_KITCHEN_ID
} from '../constants/action-types'

export function addUserDetails(payload) {
    return { type: ADD_USER_DETAILS, payload }
}

export function addToCart(payload) {
    return { typ: ADD_TO_CART, payload }
}

export function placeOrder(payload) {
    return { type: PLACE_ORDER, payload }
}

export function addBowls(payload) {
    return { type: ADD_BOWLS, payload }
}

export function addMyAddress(payload) {
    return { type: ADD_MY_ADDRESSES, payload }
}

export function addMyfavourites(payload) {
    return { type: ADD_MY_FAVOURITES, payload }
}
export function addCurated(payload) {
    return { type: ADD_CURATED, payload }
}

export function addKitchen_id(payload) {
    return { type: ADD_KITCHEN_ID, payload }
}