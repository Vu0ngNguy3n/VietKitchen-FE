import { toast } from "react-toastify";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import SidebarStaff from "../../../components/staffComponent/SidebarStaff"
import axiosInstance from "../../../utils/axiosInstance";
import { getUser } from "../../../utils/constant";
import { FaClockRotateLeft } from "react-icons/fa6";
import { RiProgress6Line } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";

function DishPreparation(){
     const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [oldCart, setOldCart] = useState();
  const [isOpenDecline, setIsOpenDecline] = useState(false);
  const [currentDish, setCurrentDish] = useState();
  const [typeDish, setTypeDish] = useState();
  const user = getUser();
  const waiting = "WAITING";
  const confirm = "CONFIRM";
  const decline = "DECLINE";
  const prepare = "PREPARE";


  useEffect(() => {
    axiosInstance
    .get(`/api/dish-order/restaurant/${user?.restaurantId}`)
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

    const socket = new SockJS('http://localhost:8080/websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        stompClient.subscribe(`/topic/order/restaurant/${user?.restaurantId}`, (message) => {
          const oldData = JSON.parse(message.body); 
          const newData = [];
          // toast.warn("Có món ăn mới được gọi")
          oldData.forEach(data => newData.push(data));
          setMessages(prevMessages => [...prevMessages, ...newData]);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  
  const changeStatusDish = (message) => {
    if (client && connected) {
      client.publish({
        destination: `/app/change-status`,
        body: JSON.stringify(message), 
      });
    } else {
      console.error("Client is not connected");
    }
  };

 const handleChangeStatusDishOldCart = (dish) => {
    let status = waiting;
    if (dish?.status === waiting) {
      status = prepare;
    } else if (dish?.status === prepare) {
      status = confirm;
    }

    const newCart = oldCart.map((c) => {
      if (c?.id === dish?.id) {
        const updatedDish = { ...c, status: status };
        changeStatusDish(updatedDish); // Send updated status via WebSocket
        return updatedDish;
      } else {
        return c;
      }
    });
    setOldCart(newCart);
  };

  const handleChangeStatusDishMessage = (dish) => {
    let status = waiting;
    if (dish?.status === waiting) {
      status = prepare;
    } else if (dish?.status === prepare) {
      status = confirm;
    }

    const newMessages = messages.map((c) => {
      if (c?.id === dish?.id) {
        const updatedDish = { ...c, status: status };
        changeStatusDish(updatedDish); // Send updated status via WebSocket
        return updatedDish;
      } else {
        return c;
      }
    });

    setMessages(newMessages);
  };

  const handleOpenDecline = (d, message) => {
    setIsOpenDecline(true);
    setCurrentDish(d);
    setTypeDish(message);
  }

  const handleCloseDecline = () =>{
    setIsOpenDecline(false);
  }

  const handleDeclineDish = () => {
    const status = decline;
    if(typeDish === "cart"){
      const newCarts = oldCart.map(c => {
        if (c?.id === currentDish?.id) {
          const updatedDish = { ...c, status: status };
          changeStatusDish(updatedDish); // Send updated status via WebSocket
          return updatedDish;
        } else {
          return c;
        }
      })
      setOldCart(newCarts)
      handleCloseDecline();
    }else{
      const newMessages = messages.map((c) => {
        if (c?.id === currentDish?.id) {
          const updatedDish = { ...c, status: status };
          changeStatusDish(updatedDish); // Send updated status via WebSocket
          return updatedDish;
        } else {
          return c;
        }
      });
      handleCloseDecline();
      setMessages(newMessages);
    }
    
  }
  


  // useEffect(() => {
  //   console.log(messages);
  //   // toast.warn("Có món ăn mới được gọi")
  // },[messages])

    return(
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarStaff/>
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <NavBarStaff />
                    {/* <div className="flex flex-wrap mt-4">
                         {messages.map((msg, index) => (
                            <li key={index}>{msg.result.length}</li>
                            ))}
                    </div> */}
                     <div className="relative overflow-x-auto  sm:rounded-lg flex justify-center ">
                          <table className="w-[90%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-md ">
                              <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                                  Danh sách món ăn chuẩn bị
                                  {/* <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p> */}
                              </caption>
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
                                    <tr className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${(d?.status === confirm || d?.status === decline) && "hidden"}`} key={index}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {d?.dish?.name}
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
                                                  className={` p-2 transition-all duration-300 flex justify-center items-center cursor-pointer hover:opacity-75 rounded-sm w-[80%] ${d?.status === waiting && "bg-yellow-400"} 
                                                  ${d?.status === confirm && "bg-green"} ${d?.status === prepare && "bg-blue-400"}`} 
                                                  onClick={() => handleChangeStatusDishOldCart(d)}
                                                >
                                                  {d?.status === waiting &&
                                                  <>
                                                    <FaClockRotateLeft className="mr-2"/> 
                                                      <span className="font-semibold ">
                                                      Đang chờ
                                                    </span>
                                                  </>}

                                                  {d?.status === prepare && 
                                                  <>
                                                    <RiProgress6Line className="mr-2"/> 
                                                    <span>
                                                      Đang chuẩn bị
                                                  </span>
                                                  </>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="cursor-pointer" onClick={() => handleOpenDecline(d, "cart")}>
                                                  <FaTrash className="text-red-500 size-6"/>
                                                </div>
                                            </td>
                                        </tr>
                                  )
                                })}
                                 {messages?.map((d, index) => {
                                      return (
                                        <tr className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${(d?.status === confirm || d?.status === decline) && "hidden"}`} key={index}>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {d?.dish?.name}
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
                                            <td className="px-6 py-4 text-right" >
                                                <div className={` p-2 transition-all duration-300 flex justify-center items-center cursor-pointer hover:opacity-75 rounded-sm w-[80%] ${d?.status === waiting && "bg-yellow-400"} 
                                                  ${d?.status === confirm && "bg-green"} ${d?.status === prepare && "bg-blue-400"}`} 
                                                onClick={() => handleChangeStatusDishMessage(d)}>
                                                  {d?.status === waiting &&
                                                  <>
                                                    <FaClockRotateLeft className="mr-2"/> 
                                                      <span className="font-semibold ">
                                                      Đang chờ
                                                    </span>
                                                  </>}

                                                  {d?.status === prepare && 
                                                  <>
                                                    <RiProgress6Line className="mr-2"/> 
                                                    <span>
                                                      Đang chuẩn bị
                                                  </span>
                                                  </>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="cursor-pointer" onClick={() => handleOpenDecline(d, "message")}>
                                                  <FaTrash className="text-red-500 size-6"/>
                                                </div>
                                            </td>
                                        </tr>
                                      )
                                    })}
                                  
                                  
                              </tbody>
                          </table>
                      </div>
                </div>
                {isOpenDecline && <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                                    <button type="button" onClick={handleCloseDecline} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-4 md:p-5 text-center">
                                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        </svg>
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Xác nhận từ chối món ăn</h3>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={() => handleDeclineDish()}
                                            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                            Có
                                        </button>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={handleCloseDecline}
                                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Không
                                        </button>
                                    </div>
                                </div>
                            </div>}
            </div>
        </div>


    )
}

export default DishPreparation