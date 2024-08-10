import { useNavigate } from "react-router";
import GOOGLE_ICON from "../../../assests/Google__G__logo.png"
import LOGO from "../../../assests/VIET.png"
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import validator from "validator";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isOpenPop, setIsOpenPop] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputs = useRef([]);
  const initialTime = 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isShow, setIsShow] = useState(false);

  const anonymizeEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const lengthToHide = Math.min(6, localPart.length);
    const visiblePart = localPart.slice(0, localPart.length - lengthToHide);
    const hiddenPart = '*'.repeat(lengthToHide);
    return visiblePart + hiddenPart + '@' + domain;
  }

  useEffect(() => {
    // Nếu thời gian còn lại là 0, không làm gì
    if (timeLeft <= 0) return;

    // Thiết lập bộ đếm ngược
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Xóa bộ đếm khi component bị unmount
    return () => clearInterval(intervalId);
  }, [timeLeft]);

   const handleChange = (element, index) => {
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };
  const handleFocus = (event) => {
    event.target.select();
  };
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleResendOTP = () => {
    
    axios
      .post(`/api/account/regenerated-otp/${email}`)
      .then(res => {
        toast.success("Gửi lại mã xác thực thành công")
        setIsOpenPop(true);
        setTimeLeft(60)
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
    
  };

   const handleBackspace = (event, index) => {
    if (event.key === "Backspace" && !otp[index]) {
      if (index !== 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  

  const handleClosePop = () =>{
    setIsOpenPop(false);
  }


  const handleSignUp = () => {
    const isValidEmailSpan = validator.isEmail(email);
    setIsValidEmail(isValidEmailSpan)
    const isValidPhoneSpan = validator.isMobilePhone(phoneNumber, 'vi-VN');
    setIsValidPhone(isValidPhoneSpan)
    setIsShow(true);
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
              setIsOpenPop(true);
              setTimeLeft(60)
              toast.success("Đăng ký thành công vui lòng xác nhận")
            }
          })
          .catch(err => {
            if (err.response) {
              const errorRes = err.response.data
              console.log(errorRes);
              toast.error(errorRes.message)
              // if (errorRes.message.trim() === "User existed") {
              //   toast.error("Email đã được sử dụng!")
              // } else if (errorRes.message.trim() === "Phone number existed") {
              //   toast.error("Số điện thoại đã tồn tại")
              // }
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


  const handleSignUpReVerify = async () => {
    let otpString = otp.join('');
    const verifyAccount = {
      email: email,
      otp: otpString
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
            {isShow && username?.length === 0 && (
              <p className="mt-2 text-sm text-red-500" id="email-error">
                Họ và tên không được để trống.
              </p>
            )}
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
            {isShow &&password?.length === 0 && (
              <p className="mt-2 text-sm text-red-500" id="email-error">
                Mật khẩu không được để trống.
              </p>
            )}
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black  transition duration-500 ease-in-out outline-none focus:outline-none focus:border-blue-700"
            />
            {(isShow && password !== confirmPassword) && (
              <p className="mt-2 text-sm text-red-500" id="email-error">
                Mật khẩu không trùng khớp.
              </p>
            )}
          </div>



          <div className="w-full flex flex-col my-4">
            <button
              className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
              onClick={() => handleSignUp()}>
              Đăng ký
            </button>

          </div>

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
        <img className="w-full h-full object-cover" src="https://i.pinimg.com/736x/68/9c/b4/689cb4f26da487574a61e9af60e889a0.jpg" alt="" />
      </div>
      {isOpenPop && (
        <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
            <div className="relative py-4 w-full max-w-xl bg-white shadow dark:bg-gray-700 animate-slideIn">
                <button type="button" onClick={handleClosePop} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
                <div className="py-2">
                    <div className='flex-row px-12'>
                        <div className="w-full flex items-center">
                          <h2 className="font-semibold text-xl">Xác thực OTP</h2>
                        </div>
                        <div className="w-full flex items-center mb-3">
                          <span className="py-2 text-sm">Vui lòng nhập mã OTP đã được gửi tới email {anonymizeEmail(email)}.</span>
                        </div>
                        <div className="w-full flex items-center my-6 otp justify-center">
                          {otp.map((data, index) => (
                            <input
                              key={index}
                              ref={(el) => (inputs.current[index] = el)}
                              type="text"
                              maxLength="1"
                              value={data}
                              onChange={(e) => handleChange(e.target, index)}
                              onKeyDown={(e) => handleBackspace(e, index)}
                              onFocus={handleFocus}
                              className="w-14 h-14 text-center border border-gray-300 rounded mx-3 outline-blue-600"
                            />
                          ))}
                        </div>
                        <div className="w-full flex items-center mb-3">
                          <span className="py-2 text-sm w-[70%]">Không nhận được mã? <label className='font-semibold underline text-blue-800 cursor-pointer' onClick={() => handleResendOTP()}>Gửi lại OTP</label></span>
                          <div className=''>
                              <span className='font-normal text-sm'>Mã sẽ hết hạn <b className='text-red-600'>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</b></span>
                          </div>
                        </div>
                        <div className='flex w-full justify-center my-6'>
                          <div className='w-[80%] flex justify-around'>
                            <button className='px-3 py-2 bg-gray-400 w-[45%] rounded-full text-black font-semibold duration-300 transition-all hover:opacity-70' onClick={() => handleClosePop()}>Huỷ</button>
                            <button className='px-3 py-2 bg-blue-700 w-[45%] rounded-full text-white font-semibold duration-300 transition-all hover:opacity-70' onClick={() => handleSignUpReVerify()}>Xác nhận</button>
                          </div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
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

export default SignUp