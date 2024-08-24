import { toast } from "react-toastify";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import axiosInstance from "../../../utils/axiosInstance";
import { useUser } from "../../../utils/constant";
import { FaClockRotateLeft } from "react-icons/fa6";
import { RiProgress6Line } from "react-icons/ri";
import { FaCheck, FaTrash } from "react-icons/fa";
import SidebarChef from "../../../components/staffComponent/chefComponent/SideBarChef";
import { useParams } from "react-router";
import NavBarChef from "../../../components/staffComponent/chefComponent/NavBarChef";

function DishTable(){
     const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [oldCart, setOldCart] = useState();
  const [isOpenDecline, setIsOpenDecline] = useState(false);
  const [currentDish, setCurrentDish] = useState();
  const [typeDish, setTypeDish] = useState();
  const [currentStatus, setCurrentStatus] = useState("WAITING");
  const [currentTable, setCurrentTable] = useState({});
  const user = useUser();
  const waiting = "WAITING";
  const confirm = "CONFIRM";
  const decline = "DECLINE";
  const prepare = "PREPARE";
  const listStatus = [waiting, confirm, decline];
  const {slug} = useParams();


  useEffect(() => {
    axiosInstance
    .get(`/api/dish-order/${slug}`, {
      size: 100
    })
    .then(res => {
        const data = res.data.result.results;
        if(data.length > 0){
            const table = data[0].order.tableRestaurant;
            setCurrentTable(table);
            setOldCart(data);
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


    const socket = new SockJS('http:/14.225.206.68:8080/websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        stompClient.subscribe(`/topic/table/${slug}`, (message) => {
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
    }else if(dish?.status === confirm || dish?.status === decline){
      return
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
                          Danh sách món ăn chuẩn bị của bàn {currentTable?.name}
                          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Danh sách các món ăn vùa được khách hàng gọi trong ngày.</p>
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
                                    <tr className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 `} key={index}>
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
                                                  className={` p-2 transition-all duration-300 flex justify-center items-center cursor-pointer hover:opacity-75 text-white rounded-sm w-[80%] ${d?.status === waiting && "bg-yellow-400"} 
                                                  ${d?.status === confirm && "bg-green"} ${d?.status === prepare && "bg-blue-400"} ${d?.status === decline && "bg-red-600"}`} 
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

                                                  {d?.status === confirm && 
                                                  <>
                                                    <RiProgress6Line className="mr-2"/> 
                                                    <span>
                                                      Đã hoàn thành
                                                  </span>
                                                  </>}
                                                  {d?.status === decline && 
                                                  <>
                                                    <RiProgress6Line className="mr-2"/> 
                                                    <span>
                                                      Đã từ chối
                                                  </span>
                                                  </>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className={`cursor-pointer ${(d?.status === confirm  || d?.status === decline) && "hidden"}`} onClick={() => handleOpenDecline(d, "cart")}>
                                                  <FaTrash className="text-red-500 size-6"/>
                                                </div>
                                            </td>
                                        </tr>
                                  )
                                })}
                                 {/* {messages?.map((d, index) => {
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
                                    })} */}
                                  
                                  
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
                                        <div className="flex justify-center mb-4">
                                          <FaCheck className="size-20 text-blue-700 border-2 p-4 rounded-full "/>
                                        </div>
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Xác nhận từ chối món ăn</h3>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={() => handleDeclineDish()}
                                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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

export default DishTable