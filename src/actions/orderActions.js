
export const saveOrderId = (orderId)  => {
    return{
        type: "SAVE_ORDER_ID",
        payload: orderId
    }
}

export const clearOrderId = () => {
    return{
        type: "CLEAR_ORDER_ID",
        payload: null
    }
}