
const TOKEN_KEY = "token"
const USER_KEY = 'user'


const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

const getUser = () => {
    const storedUser = localStorage.getItem(USER_KEY);
    return (storedUser ? JSON.parse(storedUser) : null)

}


export {getToken, getUser}