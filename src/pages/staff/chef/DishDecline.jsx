import { toast } from "react-toastify";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import axiosInstance from "../../../utils/axiosInstance";
import { useUser } from "../../../utils/constant";
import { FaClockRotateLeft } from "react-icons/fa6";
import { RiProgress6Line } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import SidebarChef from "../../../components/staffComponent/chefComponent/SideBarChef";
import NavBarChef from "../../../components/staffComponent/chefComponent/NavBarChef";

function DishDecline(){
  const [oldCart, setOldCart] = useState();
  const user = useUser();
  const decline = "DECLINE";


  useEffect(() => {
    axiosInstance
    .get(`/api/dish-order/restaurant/${user?.restaurantId}/state/${decline}`)
    .then(res => {
      const data = res.data.result;
      console.log(data);
      setOldCart(data);
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

  }, []);

    return(
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarChef/>
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <NavBarChef />
                    {/* <div className="flex flex-wrap mt-4">
                         {messages.map((msg, index) => (
                            <li key={index}>{msg.result.length}</li>
                            ))}
                    </div> */}
                    <div className="w-full flex justify-center">
                      <div className="flex justify-between w-[90%] items-center">
                        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                          Danh sách món ăn đã từ chối
                          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Danh sách các món ăn từ chối vì hết nguyên liệu hoặc các lí do khác gọi trong ngày.</p>
                        </caption>

                        
                      </div>
                    </div>
                     <div className="relative overflow-x-auto  sm:rounded-lg flex justify-center ">
                          <table className="w-[90%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-md ">
                              
                              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                  <tr>
                                      <th scope="col" className="px-6 py-3">
                                          Tên món ăn
                                      </th>
                                      <th scope="col" className="px-6 py-3">
                                          Tên bàn
                                      </th>
                                      <th scope="col" className="px-6 py-3">
                                          Số lượng
                                      </th>
                                      <th scope="col" className="px-6 py-3">
                                          Đơn vị
                                      </th>
                                      <th scope="col" className="px-6 py-3">
                                          <span className="sr-only">Edit</span>
                                      </th>
                                      <th scope="col" className="px-6 py-3">
                                          <span ></span>
                                      </th>
                                  </tr>
                              </thead>
                              <tbody>
                                {oldCart?.map((d,index) => {
                                  return (
                                    <tr className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700`} key={index}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {d?.dish?.name || d?.combo?.name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {d?.order?.tableRestaurant?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {d?.quantity}
                                            </td>
                                            <td className="px-6 py-4">
                                                {d?.dish?.unit?.name}
                                            </td>
                                            <td className={`px-6 py-4 `} >
                                                <div 
                                                  className={` p-2 transition-all duration-300 flex justify-center items-center cursor-pointer hover:opacity-75 rounded-sm w-[80%] `} 
                                                >
                                                  <span className="font-semibold text-white px-4 py-2 bg-red-500 rounded-lg">
                                                    Đã từ chối
                                                  </span>
                                                </div>
                                            </td>
                                            
                                        </tr>
                                  )
                                })}
                                 
                                 {oldCart?.length === 0 && (
                                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="px-6 py-4 text-red-500">
                                        Không có món ăn nào đã từ chối
                                    </td>
                                    <td className="px-6 py-4"></td>
                                    <td className="px-6 p-4"></td>
                                    <td className="px-6 p-4"></td>
                                    <td className="px-6 p-4"></td>
                                </tr>
                                )}
                                  
                                  
                              </tbody>
                          </table>
                      </div>
                </div>
            </div>
        </div>


    )
}

export default DishDecline