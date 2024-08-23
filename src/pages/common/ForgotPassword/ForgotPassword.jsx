import { useNavigate } from "react-router";
import GOOGLE_ICON from "../../../assests/Google__G__logo.png"
import LOGO from "../../../assests/VIET.png"
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import validator from "validator";
import axios from "axios";
import GREEN_CHECK from "../../../assests/greenCheck.png"
import Loading from "../Loading/Loading";


function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isOpenPop, setIsOpenPop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

  }

  const handleChangePhoneNumber = (e) => {
    const inputPhone = e.target.value;
    if(!isNaN(inputPhone) && inputPhone.length <= 10){
        setPhoneNumber(inputPhone);
    }

  }

  const handleForgotPassword = () => {
    const isValidEmailSpan = validator.isEmail(email);
    setIsValidEmail(isValidEmailSpan)
    const isValidPhoneSpan = validator.isMobilePhone(phoneNumber, 'vi-VN');
    setIsValidPhone(isValidPhoneSpan)
    if(!isValidEmailSpan || !isValidPhoneSpan){
        toast.warn("Email hoặc số điện thoại không đúng định dạng")
    }else{
      setIsLoading(true);
      const data = {
        email: email,
        phoneNumber: phoneNumber
      }
      axios
      .post(`/api/account/forgot-password`, data)
      .then(res => {
        toast.success("Bạn đã đổi lại mật khẩu thành công.")
        setIsOpenPop(true);
        setIsLoading(false);
      })
      .catch(err => {
        if (err.response) {
            setIsLoading(false);
            const errorRes = err.response.data;
            toast.error(errorRes.message);
        } else if (err.request) {
            setIsLoading(false);
            toast.error("Yêu cầu không thành công");
        } else {
            setIsLoading(false);
            toast.error(err.message);
        }
    })
    }
  }
  const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
          event.preventDefault();
          if(isOpenPop){
            navigate('/login')
            return
          }
          handleForgotPassword();
      } 
  };

  useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);

      return () => {
          document.removeEventListener('keydown', handleKeyDown);
      };
  }, [handleKeyDown]);



  return (
    <div className="w-full h-screen flex items-start">

      <div className="w-1/2  h-full bg-[#f5f5f5] flex flex-col p-20 justify-between items-center">
        <h1 className=" text-xl text-[#060606] font-semibold ">
          <img src={LOGO} alt="" className="w-20 max-w-[500px] rounded-full cursor-pointer" onClick={() => navigate('/')} />
        </h1>

        <div className="w-full flex flex-col ">
          <div className="w-full flex flex-col mb-2">
            <h3 className="text-2xl font-semibold mb-2">Đổi mật khẩu</h3>
            <p className="text-base mb-2">Xin chào! Bạn vui lòng điền thông tin để có thể được cấp lại mật khẩu.</p>
          </div>


          <div className="w-full flex flex-col mt-4">
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black  transition duration-500 ease-in-out outline-none  focus:outline-none focus:border-blue-700"
            />
            {!isValidEmail && (
              <p className="mt-2 text-sm text-red-500" id="email-error">
                Email sai định dạng.
              </p>
            )}
            <input
              type="text"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={handleChangePhoneNumber}
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black  transition duration-500 ease-in-out outline-none focus:outline-none focus:border-blue-700"
            />
            {!isValidPhone && (
              <p className="mt-2 text-sm text-red-500" id="phone-error">
                Số điện thoại sai định dạng
              </p>
            )}
            
          </div>



          <div className="w-full flex flex-col my-4">
            <button
              className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
              onClick={() => handleForgotPassword()}>
              Quên mật khẩu
            </button>

          </div>

        {
            isOpenPop && (
                 <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                    <div className="relative pt-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                        <div className="w-full flex justify-center mb-4 border-b-2 pb-2">
                            <h2 className="font-semibold text-lg">Cấp lại mật khẩu thành công</h2>
                        </div>
                        <div className="flex-row">
                            <div className="flex justify-center">
                                <div className="p-4 md:p-5 text-center w-[80%]">
                                    <div className="w-full flex justify-center mb-3">
                                        <img src={GREEN_CHECK} alt="" className="w-[12%] " />
                                    </div>
                                    <h3 className="mb-5 text-lg font-semibold text-black dark:text-black">Cấp lại mật khẩu thành công</h3>
                                    <span>Bạn hãy dùng mật khẩu được gửi về mail để đăng nhập và đổi mật khẩu mới.</span>
                                </div>
                            </div>
                            <div className="border-t-2 flex justify-center py-2 items-center bg-blue-400 cursor-pointer rounded-b-md" onClick={() => navigate("/login")}>
                                <p className="text-white font-medium">Đăng nhập</p>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            )
        }
          {/* <div className="w-full flex items-center justify-center relative py-2">
            <div className="w-full h-[1px] bg-black/40"></div>
            <p className="text-lg absolute text-black/80 bg-[#f5f5f5]">or</p>
          </div> */}
          {/* <div className="w-full text-[#060606] my-2 font-semibold bg-white border-2 border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer">
            <img className="h-6 mr-2" src={GOOGLE_ICON} alt="" />
            Đăng ký bằng Google
          </div> */}
        </div>

        <div className="w-full flex  items-center justify-center">
          <p className="text-sm font-normal text-[#060606]">Đã có tài khoản? <span className="font-semibold underline underline-offset-2 cursor-pointer" onClick={() => navigate('/login')}> Đăng nhập</span></p>
        </div>
      </div>

      <div className="relative w-1/2 h-full flex flex-col">
        <div className="absolute top-[20%] left-[10%] flex flex-col">
          <h1 className="text-lg text-white font-extrabold my-4">VietKitchen</h1>
          <p className="text-xl text-white font-normal">Một nền tảng, mọi kênh bán hàng <br />
            Bạn muốn bán ở đâu, VietKitchen sẽ giúp bạn tăng trưởng doanh thu và mở rộng không giới hạn</p>
        </div>
        <img className="w-full h-full object-cover" src="https://i.pinimg.com/736x/8e/9f/5c/8e9f5c1d7ef1fbeac183f4ee6622d5f9.jpg" alt="" />
      </div>
      {isLoading && (
        <Loading/>
      )}
      

      <style jsx>{`
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes slideIn {
            from {
                transform: translateY(-20%);
            }
            to {
                transform: translateY(0);
            }
        }

        .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideIn {
            animation: slideIn 0.3s ease-in-out;
        }
    `}</style>
    </div>
  )
}

export default ForgotPassword