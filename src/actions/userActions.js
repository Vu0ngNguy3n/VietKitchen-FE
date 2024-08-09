export const saveUser = (user) => {
    return {
        type: "SAVE_USER",
        payload: user
    }
}

export const clearUser = () => {
    return {
        type: "CLEAR_USER",
        payload: null
    }
}