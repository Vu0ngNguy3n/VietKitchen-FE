import { combineReducers } from "redux";
import cartReducer from "./cart";
import customerReducer from "./customer";
import orderReducer from "./order";
import tableReducers from "./table";
import userReducers from "./user";


const rootReducer = combineReducers({
    cart: cartReducer,
    customer: customerReducer,
    orderId: orderReducer,
    table: tableReducers,
    user: userReducers
})

export default rootReducer