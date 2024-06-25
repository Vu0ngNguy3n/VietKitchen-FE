import { useNavigate } from "react-router";
import GOOGLE_ICON from "../../../assests/Google__G__logo.png"
import LOGO from "../../../assests/VIET.png"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import validator from "validator";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate()
  const [codeVerify, setCodeVerify] = useState();
  const [isVerifying, setIsVerifying] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDisableInput, setIsDisableInput] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [counter, setCounter] = useState(60);


  const handleSignUp = () => {
    const isValidEmailSpan = validator.isEmail(email);
    setIsValidEmail(isValidEmailSpan)
    const isValidPhoneSpan = validator.isMobilePhone(phoneNumber, 'vi-VN');
    setIsValidPhone(isValidPhoneSpan)

    if (isValidEmail && isValidPhone) {
      if (username.trim() === '') {
        toast.warn("Họ và tên đang để trống")
      } else if (email.trim() === '') {
        toast.warn("Email sai định dạng")
      } else if (phoneNumber.trim() === '') {
        toast.warn("Số điện thoại đang để trống")
      } else if (password.trim() === '' || confirmPassword === '') {
        toast.warn("Mật khẩu không được để trống")
      } else if (password.trim() !== confirmPassword.trim()) {
        toast.warn("Xác nhận mật khẩu không đúng")
      } else {

        const userRegister = {
          username: username,
          phoneNumber: phoneNumber,
          password: password,
          email: email
        }

        axios
          .post(`/api/account/register`, userRegister)
          .then(res => {
            if (res.data.code === 200) {
              setIsVerifying(true)
              toast("Đăng ký thành công vui lòng xác nhận")
            }
          })
          .catch(err => {
            if (err.response) {
              const errorRes = err.response.data
              if (errorRes.message.trim() === "User existed") {
                toast.error("Email đã được sử dụng!")
              } else if (errorRes.message.trim() === "Phone number existed") {
                toast.error("Số điện thoại đã tồn tại")
              }
            } else if (err.request) {
              console.log("xảy ra lỗi khi gửi yêu cầu");
              // Yêu cầu đã được gửi nhưng không nhận được phản hồi
              toast.error(err.request);
            } else {
              // Đã xảy ra lỗi khi thiết lập yêu cầu
              console.log('Error', err.message);
            }
          })


      }
    }
  }

  useEffect(() => {
    let timer;
    if (isSpinning && counter > 0) {
      timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    } else if (counter === 0) {
      setIsSpinning(false);
      setIsDisableInput(false);
      setCounter(60); // Reset counter
    }
    return () => clearTimeout(timer);
  }, [isSpinning, counter]);

  const handleSignUpReVerify = async () => {
    const verifyAccount = {
      email: email,
      otp: codeVerify
    }

    axios
      .post("/api/account/verify", verifyAccount)
      .then(res => {
        const data = res.data;
        if (data.code === 200) {
          toast.success("Đăng ký thành công");
          navigate("/login")
        }
      })
      .catch(err => {
        if (err.response) {
          const errorRes = err.response.data
          if (errorRes.message.trim() === 'Verify failed') {
            toast.success("Xác nhận OTP thất bại!")
          }
          toast.error(errorRes.message)
        } else if (err.request) {
          console.log("xảy ra lỗi khi gửi yêu cầu");
          // Yêu cầu đã được gửi nhưng không nhận được phản hồi
          toast.error(err.request);
        } else {
          // Đã xảy ra lỗi khi thiết lập yêu cầu
          console.log('Error', err.message);
        }
      })

  }


  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

  }

  const handleChangePhoneNumber = (e) => {
    const inputPhone = e.target.value;
    setPhoneNumber(inputPhone);


  }

  const handleVerify = async () => {
    const regeneratedAccount = {
      email: email
    }
    axios
      .post("/api/account/regenerated-otp", regeneratedAccount)
      .then(res => {
        toast.success("Gửi lại mã xác thực thành công")
        setIsSpinning(true);
        setIsDisableInput(true);
        setIsVerifying(true)

        setTimeout(() => {
          setIsSpinning(false);
          setIsDisableInput(false);
        }, 60000); // 60 giây
      })
      .catch(err => {
        if (err.response) {
          const errorRes = err.response.data
          console.log(errorRes.message);
          toast.error(errorRes.message)
        } else if (err.request) {
          console.log("xảy ra lỗi khi gửi yêu cầu");
          // Yêu cầu đã được gửi nhưng không nhận được phản hồi
          toast.error(err.request);
        } else {
          // Đã xảy ra lỗi khi thiết lập yêu cầu
          console.log('Error', err.message);
        }
      })
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none  transition duration-500 ease-in-out  focus:outline-none focus:border-blue-700"
            />
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
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black  transition duration-500 ease-in-out outline-none focus:outline-none focus:border-blue-700"
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black  transition duration-500 ease-in-out outline-none focus:outline-none focus:border-blue-700"
            />
            <div className={`w-full py-2 my-2 ${!isVerifying ? 'hidden' : ''}`}>
              <input
                type="text"
                placeholder="Mã xác thực"
                value={codeVerify}
                onChange={(e) => setCodeVerify(e.target.value)}
                className=" text-black  bg-transparent border-b border-black outline-none  transition duration-500 ease-in-out  focus:outline-none focus:border-blue-700"
              />
              <button
                disabled={isDisableInput}
                onClick={handleVerify}
                className={`bg-secondary text-white py-2 px-4 transition-all duration-300 rounded hover:text-white hover:bg-indigo-600 ml-4 ${isDisableInput ? 'opacity-50 cursor-not-allowed' : ''}`}
              > {isSpinning ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{counter}s</span>
                </span>
              ) : (
                'Gửi mã'
              )}</button>
            </div>
          </div>



          <div className="w-full flex flex-col my-4">
            <button
              className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
              onClick={isVerifying === false ? handleSignUp : handleSignUpReVerify}>
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
            Bạn muốn bán ở đâu, VietKitchen sẽ giúp bạn tăng trưởng doanh thu và mở rộng không giới hạn</p>
        </div>
        <img className="w-full h-full object-cover" src="https://i.pinimg.com/736x/68/9c/b4/689cb4f26da487574a61e9af60e889a0.jpg" alt="" />
      </div>

    </div>
  )
}

export default SignUp