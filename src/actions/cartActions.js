export const addToCart = (dish) => {
    return{
        type: "ADD_DISH",
        payload: dish
    }
}

export const clearCart = () => {
    return{
        type: "CLEAR_CART",
        payload: []
    }
}

