const orderReducer = (state = "", action) => {
    switch(action.type){
        case "SAVE_ORDER_ID": {
            const orderId = action.payload;
            return orderId;
        }

        default: return state;
    }
}

export default orderReducer