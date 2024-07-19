
export const saveCustomer = (customer) => {
    return{
        type: "SAVE_CUSTOMER",
        payload: customer
    }
}

export const clearCustomer = () => {
    return{
        type: "CLEAR_CUSTOMER",
        payload: {}
    }
}

