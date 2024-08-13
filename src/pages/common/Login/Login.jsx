import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import GOOGLE_ICON from '../../../assests/Google__G__logo.png';
import LOGO from '../../../assests/VIET.png';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axiosInstance';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { clearUser, saveUser } from '../../../actions/userActions';
import validator from 'validator';

function SignInSide() {
  const navigate = useNavigate();
  const [typeLogin, setTypeLogin] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('') ;
  const [staffUsername, setStaffUsername] = useState('');
  const [isOpenPop, setIsOpenPop] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputs = useRef([]);
  const initialTime = 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const dispatch = useDispatch();

  useEffect(()=> {
    localStorage.removeItem('token');
    // localStorage.removeItem('user');
    const action = clearUser()
    dispatch(action);

  },[])

  const handleChangeTypeLogin = (type) => {
    setTypeLogin(type);
    if(type === 1){
      setEmail('');
    }
    setPassword('');
  };

  const handleOpenPop = () =>{
    if( typeLogin === 3){
      if(email.trim() === '' || password.trim() === ''){
        toast.warn("Email hoặc mật khẩu không dược để trống")
        return
      }else{
        const userLogin = {
          email: email.trim(),
          password: password.trim(),
        };
        axios
        .post(`/api/account/login`, userLogin)
        .then(res => {
          const data = res.data;
          const token = data.result.token;
          const user = jwtDecode(token);
          localStorage.setItem('token', token);
          const userStorage = {
            username: user.sub,
            email: user.email,
            role: user.scope,
            accountId: user.accountId,
            restaurantId: user.restaurantId,
            packName: user.packName
          };
          // localStorage.setItem('user', JSON.stringify(userStorage));
          const action = saveUser(userStorage);
          dispatch(action);
          toast.success('Đăng nhập thành công');
          if(user.scope.includes("ROLE_ADMIN")){
            navigate("/admin/dashboard");
          }else if(user.scope.includes("ROLE_MANAGER")){
            
            axiosInstance
            .get(`/api/restaurant/account/${user.accountId}`)
            .then(res => {
              if(res.data.result === null){
                navigate('/manager/restaurantInformation')
              }else{
                navigate("/manager/dashboard")
              }
            })
            .catch((err) => {
              if (err.response) {
                const errorRes = err.response.data;
                toast.error(errorRes.message);
              } else if (err.request) {
                toast.error(err.request);
              } else {
                toast.error(err.message);
              }
            })
          }
        })
        .catch((err) => {
          if (err.response) {
            const errorRes = err.response.data;
            toast.error(errorRes.message);
          } else if (err.request) {
            toast.error(err.request);
          } else {
            toast.error(err.message);
          }
        });
      }
    }

    if(typeLogin === 1){
      if(email.trim() === ''  ){
        toast.warn("Email không dược để trống")
        return
      }else{
        axios
        .post(`/api/account/${email}/login`)
        .then(res => { 
          const data = res.data.result;
          if(data.authenticated === true){
            setIsOpenPop(true);
            setTimeLeft(60)
            axios
            .post(`/api/account/${email}/send-otp`)
            .then(res => {
              
            })
            .catch((err) => {
              if (err.response) {
                const errorRes = err.response.data;
                toast.error(errorRes.message);
              } else if (err.request) {
                toast.error(err.request);
              } else {
                toast.error(err.message);
              }
            });
          }
        })
        .catch((err) => {
          if (err.response) {
            const errorRes = err.response.data;
            toast.error(errorRes.message);
          } else if (err.request) {
            toast.error(err.request);
          } else {
            toast.error(err.message);
          }
        });
      }
    }
   
    
   
  }

  useEffect(() => {
    if(typeLogin === 2){
      const restaurantPhoneCookies = Cookies.get(`restaurantPhone`);
      setPhoneNumber(restaurantPhoneCookies || '');
      const staffUsernameCookies = Cookies.get(`staffUsername`);
      setStaffUsername(staffUsernameCookies || '');
    }
  },[typeLogin])

  const handleLogin = async () => {
    if(typeLogin === 2){
      if(phoneNumber === '' || staffUsername.trim() === '' || password.trim() === ''){
        toast.warn("Thông tin không dược để trống")
        return
      }
      if(!validator.isMobilePhone(phoneNumber, 'vi-VN')){
        toast.warn("Số điện thoại nhà hàng không đúng dịnh dạng")
        return
      }
        const employee = {
          phoneNumberOfRestaurant: phoneNumber,
          username:staffUsername,
          password: password
        }
        axios
        .post('/api/identify/employee/login', employee)
        .then((res) => {
          const data = res.data;
            const token = data.result.token;
            const user1 = jwtDecode(token);
            localStorage.setItem('token', token);
            const userStorage1 = {
              restaurantId: user1.restaurantId,
              role: user1.scope,
              employeeId: user1.employeeId,
              accountId: user1.accountId
            };
            // console.log(userStorage1);
            const action = saveUser(userStorage1);
            dispatch(action);
            Cookies.set("restaurantPhone", phoneNumber, {expires: 7});
            Cookies.set("staffUsername", staffUsername, {expires: 7});
            // localStorage.setItem('user', JSON.stringify(userStorage1));
            toast.success('Đăng nhập thành công');
            if(user1.scope.includes("CHEF")){
              navigate('/chef/dishPreparation')
            }else{
              if(user1.scope.includes("WAITER")){
                navigate('/waiter/map')  
              }else{
                if(user1.scope.includes("HOSTESS")){
                  navigate('/hostess/map')
                }
              }
            }
        })
        .catch((err) => {
          if (err.response) {
            const errorRes = err.response.data;
            toast.error(errorRes.message);
          } else if (err.request) {
            toast.error(err.request);
          } else {
            toast.error(err.message);
          }
        });

        
      }
  };

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
    .post(`/api/account/regenerated-otp/${email.trim()}`)
    .then(res => {
      toast.success("Mã xác thực đã được gửi lại")
      setTimeLeft(initialTime);
    })
    .catch((err) => {
      if (err.response) {
        const errorRes = err.response.data;
        toast.error(errorRes.message);
      } else if (err.request) {
        toast.error(err.request);
      } else {
        toast.error(err.message);
      }
    });
    
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
    setOtp(new Array(6).fill(""));
  }

  const handleLoginByOTP = () => {
    let otpString = otp.join('');
    const otpRequest = {
      email: email.trim(),
      otp: otpString
    }
    axios
    .post(`/api/account/verify/otp`, otpRequest)
    .then(res => {
      const data = res.data;
      const token = data.result.token;
      const user = jwtDecode(token);
      localStorage.setItem('token', token);
      const userStorage = {
        username: user.sub,
        email: user.email,
        role: user.scope,
        accountId: user.accountId,
        restaurantId: user.restaurantId,
        packName: user.packName
      };
      // localStorage.setItem('user', JSON.stringify(userStorage));
      const action = saveUser(userStorage);
      dispatch(action);
      toast.success('Đăng nhập thành công');
      if(user.scope.includes("ROLE_ADMIN")){
        navigate("/admin/dashboard");
      }else if(user.scope.includes("ROLE_MANAGER")){
        
        axiosInstance
        .get(`/api/restaurant/account/${user.accountId}`)
        .then(res => {
          if(res.data.result === null){
            navigate('/manager/restaurantInformation')
          }else{
            navigate("/manager/dashboard")
          }
        })
        .catch((err) => {
          if (err.response) {
            const errorRes = err.response.data;
            toast.error(errorRes.message);
          } else if (err.request) {
            toast.error(err.request);
          } else {
            toast.error(err.message);
          }
        })
      }
    })
    .catch((err) => {
      if (err.response) {
        const errorRes = err.response.data;
        toast.error(errorRes.message);
      } else if (err.request) {
        toast.error(err.request);
      } else {
        toast.error(err.message);
      }
    });
  }

   const handleChangePhone = (value) => {
        if(!isNaN(value) && value.length<=10){
            setPhoneNumber(value);
        }
    }

  const handleOpenLoginWithPass = () =>{
    if(typeLogin === 1){
      setTypeLogin(3);
    }else{
      setTypeLogin(1);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-start">
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col">
        <div className="absolute top-[20%] left-[10%] flex flex-col">
          <h1 className="text-lg text-white font-extrabold my-4">VietKitchen</h1>
          <p className="text-xl text-white font-normal">
            Một nền tảng, mọi kênh bán hàng <br />
            Bạn muốn bán ở đâu, VietKitchen sẽ giúp bạn tăng trưởng doanh thu và mở rộng không giới hạn
          </p>
        </div>
        <img
          className="w-full h-full object-cover"
          src="https://i.pinimg.com/736x/17/a4/e8/17a4e8d1347f6bbaf2ff6333a9d1ce19.jpg"
          alt=""
        />
      </div>
      <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#f5f5f5] flex flex-col p-8 md:p-20 justify-between items-center">
        <h1 className="text-xl text-[#060606] font-semibold ">
          <img
            src={LOGO}
            alt=""
            className="w-28 max-w-[500px] cursor-pointer rounded-full"
            onClick={() => navigate('/')}
          />
        </h1>

        <div className="w-full flex flex-col ">
          <div className="w-full flex flex-col mb-2">
            <h3 className="text-3xl font-semibold mb-2">Đăng nhập</h3>
            <p className="text-base mb-2 text-blue-500">
              Xin chào!{' '}
              {typeLogin === 1 ? 'Đăng nhập với tư cách quản trị viên hệ thống / chủ cửa hàng' : 'Đăng nhập với tư cách nhân viên'}
            </p>
          </div>
          <div className="flex w-full justify-around ">
            <div
              className={`border-b-2 pb-1 cursor-pointer transition duration-500 ease-in-out ${
                typeLogin === 1 ? 'border-blue-700' : 'border-black'
              }`}
              onClick={() => handleChangeTypeLogin(1)}
            >
              <h3 className="font-semibold">Quản trị viên/ Quản lý nhà hàng</h3>
            </div>
            <div
              className={`border-b-2 pb-1 cursor-pointer transition duration-500 ease-in-out ${
                typeLogin === 2 ? 'border-blue-700' : 'border-black'
              }`}
              onClick={() => handleChangeTypeLogin(2)}
            >
              <h3 className='font-semibold'>Nhân viên</h3>
            </div>
          </div>

          <div className="w-full flex flex-col mt-4">
            <input
              type="email"
              placeholder={'Email'}
              className={`w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none  focus:outline-none ${typeLogin!==2?'':'hidden'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder={'Số điện thoại nhà hàng'}
              className={`w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none  focus:outline-none ${typeLogin===2?'':'hidden'}`}
              value={phoneNumber}
              onChange={(e) => handleChangePhone(e.target.value)}
            />
            <input
              type="text"
              placeholder={'Tên đăng nhập'}
              className={`w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none  focus:outline-none ${typeLogin===2?'':'hidden'}`}
              value={staffUsername}
              onChange={(e) => setStaffUsername(e.target.value)}
            />
            
            <input
              type="password"
              placeholder="Mật khẩu"
              className={`w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none ${typeLogin !== 1? '' : "hidden"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={`w-full flex items-center justify-between ${typeLogin === 2 ? "hidden": ""}`}>
            <div className="w-full flex cursor-pointer" onClick={() => handleOpenLoginWithPass()}>
              <p className="text-sm font-medium whitespace-nowrap cursor-pointer underline-offset-2">{typeLogin === 1 ? "Đăng nhập bằng phương thức khác" : "Quay lại"}</p>
            </div>
            <p className="text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2" onClick={() => navigate("/forgotPassword")}>
              Quên mật khẩu?
            </p>
          </div>

          <div className="w-full flex flex-col my-4">
            {typeLogin=== 1 && (
              <button
                className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                onClick={() => handleOpenPop()}
              >
                Đăng nhập
              </button>
            )}
            
            {typeLogin === 2 && (
              <button
                className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                onClick={() => handleLogin()}
              >
                Đăng nhập
              </button>
            )}
            {typeLogin === 3 && (
              <button
                className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
                onClick={() => handleOpenPop()}
              >
                Đăng nhập
              </button>
            )}
            
            <button
              className={`w-full text-[#060606] my-2 font-semibold bg-white border-2 border-black-2 rounded-md p-4 text-center flex items-center justify-center ${typeLogin === 2 ?"hidden" : ""}`}
              onClick={() => navigate('/signUp')}
            >
              Đăng ký
            </button>
          </div>

          {/* <div className="w-full flex items-center justify-center relative py-2">
            <div className="w-full h-[1px] bg-black/40"></div>
            <p className="text-lg absolute text-black/80 bg-[#f5f5f5]">or</p>
          </div>
          <div className="w-full text-[#060606] my-2 font-semibold bg-white border-2 border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer">
            <img className="h-6 mr-2" src={GOOGLE_ICON} alt="" />
            Đăng nhập bằng Google
          </div> */}
        </div>

        <div className={`w-full flex  items-center justify-center ${typeLogin === 2 ? "hidden" : ""}`}>
          <p className="text-sm font-normal text-[#060606]">
            Không có tài khoản?{' '}
            <span className="font-semibold underline underline-offset-2 cursor-pointer" onClick={() => navigate('/signUp')}>
              Đăng ký
            </span>
          </p>
        </div>
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
                            <button className='px-3 py-2 bg-blue-700 w-[45%] rounded-full text-white font-semibold duration-300 transition-all hover:opacity-70' onClick={() => handleLoginByOTP()}>Xác nhận</button>
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
  );
}

export default SignInSide;