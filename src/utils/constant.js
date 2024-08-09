import { useSelector } from "react-redux"

const TOKEN_KEY = "token"


const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

const useUser = () => {
    // const storedUser = localStorage.getItem(USER_KEY);
    // return (storedUser ? JSON.parse(storedUser) : null)
    return useSelector(state => state?.user);
}


export {getToken, useUser}