import { useNavigate } from "react-router";
import GOOGLE_ICON from "../../../assests/Google__G__logo.png"
import LOGO from "../../../assests/VIET.png"
import { useState } from "react";

function SignUp() {
  const navigate = useNavigate()
  const [codeVerify, setCodeVerify] = useState();
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmCode, setConfirmCode] = useState('')

  const handleSignUp = () => {
    navigate("/login")
  }

  return (
    <div className="w-full h-screen flex items-start">

      <div className="w-1/2  h-full bg-[#f5f5f5] flex flex-col p-20 justify-between items-center">
        <h1 className=" text-xl text-[#060606] font-semibold ">
          <img src={LOGO} alt="" className="w-20 max-w-[500px] rounded-full cursor-pointer" onClick={() => navigate('/')} />
        </h1>

        <div className="w-full flex flex-col ">
          <div className="w-full flex flex-col mb-2">
            <h3 className="text-2xl font-semibold mb-2">Đăng ký</h3>
            <p className="text-base mb-2">Xin chào! Bạn vui lòng điền thông tin để đăng ký.</p>
          </div>


          <div className="w-full flex flex-col mt-4">
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none  transition duration-500 ease-in-out  focus:outline-none focus:border-blue-700"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black  transition duration-500 ease-in-out outline-none  focus:outline-none focus:border-blue-700"
            />
            <input
              type="number"
              placeholder="Số điện thoại"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black  transition duration-500 ease-in-out outline-none focus:outline-none focus:border-blue-700"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black  transition duration-500 ease-in-out outline-none focus:outline-none focus:border-blue-700"
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black  transition duration-500 ease-in-out outline-none focus:outline-none focus:border-blue-700"
            />
          </div>



          <div className="w-full flex flex-col my-4">
            <button className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer" onClick={() => handleSignUp()}>
              Đăng ký
            </button>

          </div>

          <div className="w-full flex items-center justify-center relative py-2">
            <div className="w-full h-[1px] bg-black/40"></div>
            <p className="text-lg absolute text-black/80 bg-[#f5f5f5]">or</p>
          </div>
          <div className="w-full text-[#060606] my-2 font-semibold bg-white border-2 border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer">
            <img className="h-6 mr-2" src={GOOGLE_ICON} alt="" />
            Đăng ký bằng Google
          </div>
        </div>

        <div className="w-full flex  items-center justify-center">
          <p className="text-sm font-normal text-[#060606]">Đã có tài khoản? <span className="font-semibold underline underline-offset-2 cursor-pointer" onClick={() => navigate('/login')}> Đăng nhập</span></p>
        </div>
      </div>

      <div className="relative w-1/2 h-full flex flex-col">
        <div className="absolute top-[20%] left-[10%] flex flex-col">
          <h1 className="text-lg text-white font-extrabold my-4">VietKitchen</h1>
          <p className="text-xl text-white font-normal">Một nền tảng, mọi kênh bán hàng <br />
            Bạn muốn bán ở đâu, Sapo sẽ giúp bạn tăng trưởng doanh thu và mở rộng không giới hạn</p>
        </div>
        <img className="w-full h-full object-cover" src="https://i.pinimg.com/736x/68/9c/b4/689cb4f26da487574a61e9af60e889a0.jpg" alt="" />
      </div>

    </div>
  )
}

export default SignUp