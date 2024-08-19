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
            let newState = [];

            console.log(state);
            console.log(data);

            // Xác định điều kiện lọc
            if (data?.comboId) {
                // Nếu có comboId, lọc theo comboId
                newState = state.filter(s => s?.comboId !== data?.comboId);
            } else if (data?.dishId) {
                // Nếu có dishId, lọc theo dishId
                newState = state.filter(s => s?.dishId !== data?.dishId);
            } else {
                // Nếu không có cả comboId và dishId, giữ nguyên trạng thái
                newState = state;
            }

            // Trả về trạng thái mới
            return newState;
        }

        case "CLEAR_CART": {
            return action.payload
        }
        default:
            return state
    }
}

export default cartReducer