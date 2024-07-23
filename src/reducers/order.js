const orderReducer = (state = "", action) => {
    switch(action.type){
        case "SAVE_ORDER_ID": {
            const orderId = action.payload;
            return orderId;
        }

        case "CLEAR_ORDER_ID":{
            return action.payload
        }

        default: return state;
    }
}

export default orderReducer