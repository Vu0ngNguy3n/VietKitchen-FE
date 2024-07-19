
export const saveOrderId = (orderId)  => {
    return{
        type: "SAVE_ORDER_ID",
        payload: orderId
    }
}