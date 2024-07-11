const cartReducer = (state = [], action) => {
    switch(action.type){
        case "ADD_DISH":{
            const dishes = [...state];
            dishes.push(action.payload)
            return dishes
        }

        case "CLEAR_CART": {
            return action.payload
        }
        default:
            return state
    }
}

export default cartReducer