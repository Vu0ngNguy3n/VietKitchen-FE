export const saveTable = (table) => {
    return{
        type: "SAVE_TABLE",
        payload: table
    }
}

export const clearTable = () => {
    return{
        type: "CLEAR_TABLE",
        payload: null
    }
}