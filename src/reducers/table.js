const tableReducers = (state = null, action) => {
    switch(action.type){
        case "SAVE_TABLE":{
            const saveTable = action.payload;
            return saveTable;
        }

        case "CLEAR_TABLE": {
            return null
        }

        default: return state
    }
}

export default tableReducers