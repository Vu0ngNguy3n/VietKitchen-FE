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
            // const index = dishes.findIndex((dish) => (dish.dishId === action.payload));
            const data = action.payload;
            const index = dishes.findIndex(dish => {
                return dish.dishId === data.dishId && dish.comboId === data.comboId
            })
            if (index !== -1) {
                dishes[index].quantity += 1;
            }

            return dishes;
        }
        
        case "REDUCE_DISH_QUANTITY": {
            const dishes = [...state];
            const data = action.payload;
            const index = dishes.findIndex(dish => {
                return dish.dishId === data.dishId && dish.comboId === data.comboId
            })

            if (index !== -1 && dishes[index].quantity > 1) {
                dishes[index].quantity -= 1;
            }

            return dishes;
        }

         case "REMOVE_DISH": {
            const data = action.payload;
             return state.filter((dish) => {
                 return dish.dishId === data.dishId && dish.comboId === data.comboId
             });
        }

        case "CLEAR_CART": {
            return action.payload
        }
        default:
            return state
    }
}

export default cartReducer