const userReducers = (state = null, action) => {
    switch(action.type){
        case "SAVE_USER":{
            const saveUser = action.payload;
            return saveUser;
        }

        case "CLEAR_USER": {
            return null
        }

        default: return state
    }
}

export default userReducers