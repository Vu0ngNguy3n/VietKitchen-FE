import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import SidebarStaff from "../../../components/staffComponent/SidebarStaff"
import { FaPlusCircle } from "react-icons/fa";
import { formatVND } from "../../../utils/format";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getUser } from "../../../utils/constant";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";


function Ordering(){

    const cartList = useSelector(state => state.cart)
    const [areaId, setAreaId] = useState();
    const [areaList, setAreaList] = useState();
    const [tableList, setTableList] = useState();
    const [tableId, setTableId] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [customer, setCustomer]= useState();
    const [orderId, setOrderId] = useState();
    const user = getUser();

    useEffect(() => {
        axiosInstance
        .get(`/api/area/${user?.restaurantId}`)
        .then(res => {
            if(res.data.result.length >= 0 ){
                setAreaId(res.data.result[0]?.id)
            }
            setAreaList(res.data.result)
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



    },[])

    useEffect(() => {
        axiosInstance
        .get(`/api/table/area/${areaId}`)
        .then(res => {
            if(res.data.result.length >= 0){
                setTableId(res.data.result[0]?.id)
            }
            setTableList(res.data.result)
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
    },[areaId])

     const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        stompClient.subscribe('/topic/order', (message) => {
          setMessages(prevMessages => [...prevMessages, message.body]);
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

  const addDish = (message) => {
    if (client && connected) {
      client.publish({
        destination: '/app/addDishes',
        body: JSON.stringify(message),
      });
    } else {
      console.error("Client is not connected");
    }
  };

    const handleSubmitDishes = () => {
        const newCart = cartList?.map(c => {
            return {
                dishId: c.dishId,
                comboId: c.comboId,
                quantity: 1
            }
        })
        const result = {
            dishOrderRequests:newCart,
            orderId: orderId,
        }
        console.log(result);

        addDish(result);   
           
    }

    const handleAddCustomerOrder = () => {
        axiosInstance
        .get(`/api/customers/${phoneNumber}`)
        .then(res => {
            const data = res.data.result;
            console.log(data);
            if(data !== null){
                setCustomer(data);
                const requestData = {
                    tableId: tableId,
                    employeeId: user?.employeeId,
                    customerResponse: data,
                    restaurantId: user?.restaurantId
                }
                axiosInstance
                .post(`/create`, requestData)
                .then(res => {
                    const idResult =res.data.result.id;
                    setOrderId(idResult)
                })
                .catch(err => {
                            if (err.response) {
                                const errorRes = err.response.data;
                                toast.error(errorRes.message);
                            } else if (err.request) {
                                toast.error("Yêu cầu không thành công");
                            } else {
                                toast.error(err.message);
                            }
                        })
                
            }else{
                toast('User not exist')   
            }
        })
        .catch(err => {
            if (err.response) {
                const errorRes = err.response.data;
                toast.error(errorRes.message);
            } else if (err.request) {
                toast.error("Yêu cầu không thành công");
            } else {
                toast.error(err.message);
            }
        })
    }
    


    return(
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarStaff/>
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <NavBarStaff />
                    <div className="flex justify-center">
                            <select 
                                id="dish-type" 
                                value={areaId}
                                onChange={e => setAreaId(e.target.value)}
                                className="w-[20%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                                    focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {areaList?.map((area, index) => (
                                                            <option value={area?.id} selected={areaId === area?.id ? true : false} key={index}>{area?.name}</option>
                                                        ))}
                            </select>
                            <select 
                                id="dish-type" 
                                value={tableId}
                                onChange={e => setTableId(e.target.value)}
                                className="w-[20%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                                    focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {tableList?.map((table, index) => (
                                                            <option value={table?.id} selected={tableId === table?.id ? true : false} key={index}>{table?.name}</option>
                                                        ))}
                            </select>
                            <input  
                                            id="dish-name"
                                            type="text"
                                            placeholder="Số điện thoạix"
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                            <button
                                onClick={() => handleAddCustomerOrder()} 
                                className="py-2 px-3 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                <IoMdAdd />Thêm khach hang
                            </button>
                        </div>
                    <div className="flex flex-wrap mt-4"> 
                        
                        {cartList?.map((c, index) => {
                            return (<a 
                                    href="#"
                                    className="w-full md:w-1/2 flex flex-col items-center md:flex-row"
                                >
                                    <div className="flex-shrink-0 w-full md:w-1/2">
                                        <img className="object-cover h-full w-full md:h-auto" src={c?.imageUrl} alt=""/>
                                    </div>
                                    <div className="relative flex flex-col p-4 leading-normal w-full">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{c?.name}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{formatVND(c?.price)}</p>
                                        {/* <div className="absolute bottom-4 right-4 cursor-pointer" >
                                            <FaPlusCircle className="text-red-600 size-7 hover:text-secondary transition ease-in-out duration-300"/>
                                        </div> */}
                                    </div>
                                </a>)
                        })}
                        <button onClick={() => handleSubmitDishes()}>Gọi món</button>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Ordering