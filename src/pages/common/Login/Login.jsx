import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import GOOGLE_ICON from '../../../assests/Google__G__logo.png';
import LOGO from '../../../assests/VIET.png';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';

function SignInSide() {
  const navigate = useNavigate();
  const [typeLogin, setTypeLogin] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('') ;
  const [staffUsername, setStaffUsername] = useState('');

  const handleChangeTypeLogin = (type) => {
    setTypeLogin(type);
    setPassword('');
    setEmail('');
    setPhoneNumber('');
    setStaffUsername('');
  };

  const handleLogin = async () => {
    if (email.trim() !== '' && password.trim() !== '') {
      const userLogin = {
        email: email.trim(),
        password: password.trim(),
      };
      axios
        .post('/api/account/login', userLogin)
        .then((res) => {
          const data = res.data;
          if (data.code === 200) {
            const token = data.result.token;
            const user = jwtDecode(token);
            localStorage.setItem('token', token);
            console.log(user)
            const userStorage = {
              username: user.sub,
              email: user.email,
            };
            localStorage.setItem('user', JSON.stringify(userStorage));
            toast.success('Đăng nhập thành công');
            navigate('/');
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

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-start">
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col">
        <div className="absolute top-[20%] left-[10%] flex flex-col">
          <h1 className="text-lg text-white font-extrabold my-4">VietKitchen</h1>
          <p className="text-xl text-white font-normal">
            Một nền tảng, mọi kênh bán hàng <br />
            Bạn muốn bán ở đâu, Sapo sẽ giúp bạn tăng trưởng doanh thu và mở rộng không giới hạn
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
            className="w-20 max-w-[500px] cursor-pointer rounded-full"
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
              className={`w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none  focus:outline-none ${typeLogin===2?'hidden':''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder={'Số điện thoại nhà hàng'}
              className={`w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none  focus:outline-none ${typeLogin===1?'hidden':''}`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder={'Tên đăng nhập'}
              className={`w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none  focus:outline-none ${typeLogin===1?'hidden':''}`}
              value={staffUsername}
              onChange={(e) => setStaffUsername(e.target.value)}
            />
            
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="w-full flex">
              <input type="checkbox" className="w-4 h-4 mr-2" />
              <p className="text-sm">Nhớ mật khẩu</p>
            </div>
            <p className="text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2">
              Quên mật khẩu?
            </p>
          </div>

          <div className="w-full flex flex-col my-4">
            <button
              className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
              onClick={() => handleLogin()}
            >
              Đăng nhập
            </button>
            <button
              className="w-full text-[#060606] my-2 font-semibold bg-white border-2 border-black-2 rounded-md p-4 text-center flex items-center justify-center"
              onClick={() => navigate('/signUp')}
            >
              Đăng ký
            </button>
          </div>

          <div className="w-full flex items-center justify-center relative py-2">
            <div className="w-full h-[1px] bg-black/40"></div>
            <p className="text-lg absolute text-black/80 bg-[#f5f5f5]">or</p>
          </div>
          <div className="w-full text-[#060606] my-2 font-semibold bg-white border-2 border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer">
            <img className="h-6 mr-2" src={GOOGLE_ICON} alt="" />
            Đăng nhập bằng Google
          </div>
        </div>

        <div className="w-full flex  items-center justify-center">
          <p className="text-sm font-normal text-[#060606]">
            Không có tài khoản?{' '}
            <span className="font-semibold underline underline-offset-2 cursor-pointer" onClick={() => navigate('/signUp')}>
              Đăng ký
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInSide;