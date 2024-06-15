import { ToastContainer } from "react-toastify";
import './CustomToastContainer.scss'

function CustomToastContainer(){
    return (
        <ToastContainer
            className={'customToastContainer'}
            autoClose={3000}
                
        />
    )
}

export default CustomToastContainer