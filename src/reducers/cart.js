const cartReducer = (state = [], action) => {
    switch(action.type){
        case "ADD_DISH":{
            const dishes = [...state];
            const index = dishes.findIndex((dish) => dish.dishId === action.payload.dishId);

            if (index !== -1) {
                dishes[index].quantity += 1;
            } else {
                dishes.push({ ...action.payload, quantity: 1 });
            }

            return dishes;
        }

        case "INCREASE_DISH_QUANTITY": {
            const dishes = [...state];
            const index = dishes.findIndex((dish) => dish.dishId === action.payload);

            if (index !== -1) {
                dishes[index].quantity += 1;
            }

            return dishes;
        }
        
        case "REDUCE_DISH_QUANTITY": {
            const dishes = [...state];
            const index = dishes.findIndex((dish) => dish.dishId === action.payload.dishId);

            if (index !== -1 && dishes[index].quantity > 1) {
                dishes[index].quantity -= 1;
            }

            return dishes;
        }

         case "REMOVE_DISH": {
             return state.filter((dish) => dish.dishId !== action.payload);
        }

        case "CLEAR_CART": {
            return action.payload
        }
        default:
            return state
    }
}

export default cartReducer