const customerReducer = (state = null, action) => {
    switch(action.type){
        case "SAVE_CUSTOMER":{
            const customer = action.payload;
            return customer;
        }

        case "CLEAR_CUSTOMER":{
            return null
        }

        default: return state;
    }
}

export default customerReducer