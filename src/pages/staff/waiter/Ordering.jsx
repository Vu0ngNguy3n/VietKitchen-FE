import NavBarStaff from "../../../components/staffComponent/NavBarStaff";
import SidebarStaff from "../../../components/staffComponent/SidebarStaff";
import { FaPlusCircle, FaMinusCircle, FaTimes } from "react-icons/fa";
import { formatVND } from "../../../utils/format";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useUser } from "../../../utils/constant";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import {addToCart, clearCart, reduceDish, removeDish} from "../../../actions/cartActions"
import {saveCustomer} from "../../../actions/customerActions"
import {saveOrderId} from "../../../actions/orderActions"
import {saveTable} from "../../../actions/tableActions"
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router";


function Ordering() {
  const orderIdRedux = useSelector(state => state.orderId);
  const dispatch = useDispatch();
   const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [oldCart, setOldCart] = useState();
  const [totalMoney, setTotalMoney] = useState();
  const user = useUser();
  const table = useSelector(state => state.table);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/websocket");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");
        setConnected(true);
        stompClient.subscribe(`/topic/table/${table?.tableId}`, (message) => {
          const data = JSON.parse(message.body);
          setOldCart((prevMessages) => 
          prevMessages.map(m => (m?.id === data?.id ? data : m))
        );
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
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

  useEffect(() => {
     axiosInstance
    .get(`/api/dish-order/${orderIdRedux}`)
    .then(res => {
      const data = res.data.result;
      console.log(orderIdRedux);
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
  },[orderIdRedux])

  useEffect(() => {
    let requireMoney = 0;
    oldCart?.forEach(d => {
      if(d?.status !== "DECLINE"){
        requireMoney+=(d?.dish?.price * d?.quantity)
      }
    })
    console.log(requireMoney);
    setTotalMoney(requireMoney)
  },[oldCart])

  const handleNavigatePayment = () => {
    
  }
 


  return (
    <div className="flex h-screen relative">
      <div className="w-full flex justify-center absolute mt-6 bottom-6" onClick={() => navigate("/waiter/payment")}>
          <button className="ml-[12%] px-4 py-3 border-none rounded-md bg-primary text-white uppercase font-semibold transition-all duration-300 hover:opacity-[60%]">Thanh toán</button>
        </div>
         <div className="absolute left-[60%] top-4 w-[13%] flex justify-between p-2 rounded-md bg-primary/[0.8] text-white font-semibold">
                <span>Tổng tiền:</span>
                <span>{formatVND(totalMoney)}</span>
            </div>  
      <div className="basis-[12%]">
        <SidebarStaff />
      </div>
      <div className="basis-[88%] border overflow-scroll ">
        <NavBarStaff />
        

        <div className="flex h-full w-full bg-slate-300 ">
           
          
            
              <div class=" overflow-x-auto  sm:rounded-lg w-full ">
                  
                                                            
                  <div className="w-full  flex flex-wrap justify-around ">
                    
                                {oldCart?.map((d,index) => {
                                  return (                                                        
                                    <a href="#" class="w-[40%] mt-8 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <img class="object-cover ml-2 w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={d?.dish.imageUrl} alt=""/>
                                        <div class="flex flex-col p-4 leading-normal">

                                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{d?.dish.name}</h5>
                                            <p class=" mb-3 font-normal text-gray-700 dark:text-gray-400">Số lượng: {d?.quantity} {d?.dish.unit.name}</p>
                                            <p class={`mb-3 font-normal text-gray-700 dark:text-gray-400`}>
                                              {/* Trạng thái: {d?.status}  */}
                                                {d?.status === "WAITING" && <span class="flex items-center bg-[#F6FB7A]  px-2 py-1 rounded-lg">
                                                  <GoDotFill className="text-[#73BBA3]"/>
                                                  <p className="text-[#73BBA3]">Chờ xác nhận</p>
                                                </span> }
                                                {d?.status === "CONFIRM" && <span class="flex items-center bg-[#A4CE95]  px-2 py-1 rounded-lg">
                                                  <GoDotFill className="text-[#0A6847]"/>
                                                  <p className="text-[#0A6847]">Đã phục vụ</p>
                                                </span>}
                                                {d?.status === "DECLINE" && <span class="flex items-center bg-[#E68369]  px-2 py-1 rounded-lg">
                                                  <GoDotFill className="text-[#973131]"/>
                                                  <p className="text-[#973131]">Bị từ chối</p>
                                                </span>}
                                                {d?.status === "PREPARE" && <span class="flex items-center bg-[#91DDCF]  px-2 py-1 rounded-lg">
                                                  <GoDotFill className="text-[#088395]"/>
                                                  <p className="text-[#088395]">Đang chế biến</p>
                                                </span>}
                                            </p>
                                        </div>
                                    </a>
                                  )
                                })}
                                 {messages?.map((d, index) =>  {
                                    return (
                                      <a key={index} class="w-[40%] mt-8 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <img class="object-cover ml-2 w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={d?.dish?.imageUrl} alt=""/>
                                        <div class="flex flex-col p-4 leading-normal">
                                            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{d?.dish?.name}</h5>
                                            <p class=" mb-3 font-normal text-gray-700 dark:text-gray-400">Số lượng: {d?.quantity} {d?.dish?.unit.name}</p>
                                            <p class=" mb-3 font-normal dark:text-gray-400 text-green">Trạng thái: {d?.status} </p>
                                        </div>
                                    </a>
                                    )
                                  })}
                                  <div class="w-[40%] "></div>
                                  <div class="w-[40%] "></div>
                                    
                  </div>               
                      
             </div>
        </div>
      </div>
    </div>
  );
}

export default Ordering;

