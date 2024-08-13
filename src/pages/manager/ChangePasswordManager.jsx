import axios from "axios";
import { useEffect, useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { useNavigate } from "react-router";
import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { IoIosArrowBack } from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useUser } from "../../utils/constant";

function ChangePassword() {

    const navigate = useNavigate();
    const user = useUser();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmitChange = () => {
        if(oldPassword === '' || newPassword === '' || confirmPassword === ''){
            toast.warn("Có thông tin đang để trống")
            return
        }
        if(newPassword!==confirmPassword){
            toast.warn("Xác nhận mật khẩu không trùng khớp")
            return
        }
        if(oldPassword === newPassword){
            toast.warn("Mật khẩu mới không được trùng với mật khẩu cũ")
            return
        }
        const request = {
            email: user?.email,
            password: oldPassword
        }
        axiosInstance
        .post(`/api/account/change-password/${newPassword}`, request)
        .then(res => {
            toast.success("Đổi mật khẩu thành công");
            navigate("/manager/setting")
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
   
   
    return (
        <div>
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border h-[100vh] overflow-scroll">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-primary/[0.1] p-16 shadow min-h-[90vh]  mt-2 flex-row ">
    
                        <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[40vh] mt-2 relative">
                            <div className="absolute top-2 left-2 cursor-pointer flex text-gray-500" onClick={() => navigate("/manager/setting")}><IoIosArrowBack className="size-6"/> <span className="font-medium">Thiết lập nhà hàng</span></div>
                            <h1 className="font-black text-3xl mb-8">Đổi mật khẩu</h1>

                            <div className="grid gap-4 mb-4 grid-cols-2 w-full">
                                <div className="w-[60%]">
                                    <span className="font-normal w-full">Thay đổi mật khẩu nhằm tránh việc bị rò rỉ thông tin của nhà hàng của bạn</span>
                                </div>
                                <div className="w-[100%] bg-gray-300 p-4">
                                    <div className="border-b-2 py-3 w-full flex">
                                        <span className="flex w-full font-semibold text-base">
                                            Đổi mật khẩu
                                        </span>
                                    </div>
                                       
                                        <div className="py-4">
                                            <div className="grid gap-4 mb-4 grid-cols-1 animate-fadeIn">
                                                <div className="grid grid-cols-1 gap-4 ">
                                                    <div className="col-span-1">
                                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu cũ
                                                            <span className="text-red-600">{` (*)`}</span>
                                                        </label>
                                                        <input
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        value={oldPassword}
                                                        onChange={e => setOldPassword(e.target.value)}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                        focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                        dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Mật khẩu cũ"
                                                        required=""
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu mới
                                                            <span className="text-red-600">{` (*)`}</span>
                                                        </label>
                                                        <input
                                                        type="password"
                                                        name="newPassword"
                                                        id="newPassword"
                                                        value={newPassword}
                                                        onChange={e => setNewPassword(e.target.value)}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                        focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                        dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Mật khẩu mới"
                                                        required=""
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Xác nhận mật khẩu
                                                            <span className="text-red-600">{` (*)`}</span>
                                                        </label>
                                                        <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        value={confirmPassword}
                                                        onChange={e => setConfirmPassword(e.target.value)}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                        focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                        dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Xác nhận mật khẩu"
                                                        required=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>

                            {/* <form class="p-4 md:p-5"> */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        onClick={() => handleSubmitChange()}
                                        className="text-white transition ease-in-out duration-300 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        <GrUpdate className="mr-2" />
                                        Cập nhật
                                    </button>
                                </div>
                            {/* </form> */}
                        </div>
                    </div>
                </div>
            </div>
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

export default ChangePassword
