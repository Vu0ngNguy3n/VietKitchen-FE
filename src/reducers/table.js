const tableReducers = (state = null, action) => {
    switch(action.type){
        case "SAVE_TABLE":{
            const saveTable = action.payload;
            return saveTable;
        }

        default: return state
    }
}

export default tableReducers