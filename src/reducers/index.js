import { combineReducers } from "redux";
import cartReducer from "./cart";
import customerReducer from "./customer";
import orderReducer from "./order";
import tableReducers from "./table";


const rootReducer = combineReducers({
    cart: cartReducer,
    customer: customerReducer,
    orderId: orderReducer,
    table: tableReducers
})

export default rootReducer