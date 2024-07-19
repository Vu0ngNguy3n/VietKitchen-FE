export const addToCart = (dish) => {
    return{
        type: "ADD_DISH",
        payload: dish
    }
}

export const removeDish = (dishId) => ({
  type: "REMOVE_DISH",
  payload: dishId,
});

export const reduceDish = (dish) => {
    return{
        type: "REDUCE_DISH_QUANTITY",
        payload: dish,
    }
}

export const increaseDishQuantity = (dishId) => {
  return {
    type: 'INCREASE_DISH_QUANTITY',
    payload: dishId,
  };
};

export const clearCart = () => {
    return{
        type: "CLEAR_CART",
        payload: []
    }
}

