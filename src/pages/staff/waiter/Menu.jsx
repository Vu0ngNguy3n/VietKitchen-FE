import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify";
import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import SidebarStaff from "../../../components/staffComponent/SidebarStaff"
import axiosInstance from "../../../utils/axiosInstance";
import { FaPlusCircle } from "react-icons/fa";
import { formatVND } from "../../../utils/format";
import { addToCart, clearCart, increaseDishQuantity, reduceDish, removeDish } from "../../../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { IoMdAdd, IoMdPhonePortrait } from "react-icons/io";
import {calculateCartTotal} from '../../../utils/helper'
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { GrRestaurant } from "react-icons/gr";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { useUser } from "../../../utils/constant";
import { saveCustomer } from "../../../actions/customerActions";
import { saveTable } from "../../../actions/tableActions";
import { saveOrderId } from "../../../actions/orderActions";
import validator from "validator";

function Menu(){
    const {slug} = useParams();
    const cartList = useSelector(state => state.cart);
    const table = useSelector(state => state.table);
    const totalAmount = calculateCartTotal(cartList);
    const orderId = useSelector(state => state.orderId);
    const customerDetail = useSelector(state => state.customer);
    const [dishesList, setDishesList] = useState([]);
    const [customer, setCustomer] = useState();
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
    const [isCreateCustomer, setIsCreateCustomer] = useState(false);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isExistCustomer, setIsExistCustomer] = useState(false);
  const [phoneNumber, setPhoneNumber ] = useState('');
  const [areaList, setAreaList] = useState([]);
  const [currentArea, setCurrentArea] = useState();
  const [tableList, setTableList] = useState([]);
  const [currentTable, setCurrentTable] = useState();
  const [isAddCustomer, setIsAddCustomer] = useState(false);
  const [phoneNumberAdd, setPhoneNumberAdd] = useState();
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {

    axiosInstance
      .get(`/api/area/${user?.restaurantId}`)
      .then((res) => {
        if (res.data.result.length >= 0 && !currentArea) {
          setCurrentArea(res.data.result[0]?.id);
        }
        setAreaList(res.data.result);
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

      console.log(customerDetail);

    const socket = new SockJS('http://localhost:8080/websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        stompClient.send(`/topic/order/restaurant/${user?.restaurantId}`, (message) => {
          setMessages(prevMessages => [...prevMessages, message.body]);
        });

        stompClient.send(`/topic/restaurant/${user?.restaurantId}`, (message ) => {
             console.log('Received status-table message:', message.body);
        })
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

  useEffect(() => {
    if(currentArea){
      axiosInstance
      .get(`/api/table/area/${currentArea}`)
      .then((res) => {
        if (res.data.result.length >= 0 && !currentTable) {
          setCurrentTable(res.data.result[0]?.id);
        }
        setTableList(res.data.result);
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
  }, [currentArea]);

  useEffect(() => {
    (customerDetail === null) ? setIsExistCustomer(false) : setIsExistCustomer(true);
  },[customerDetail, table])

  const addDish = (message) => {
    if (client && connected) {
      client.publish({
        destination: `/app/restaurant/${user?.restaurantId}/addDishes`,
        body: JSON.stringify(message), 
      });
    } else {
      console.error("Client is not connected");
    }
  };

  const changeStatusTable = (message) => {
     if (client && connected) {
      client.publish({
        destination: `/app/restaurant/${message?.restaurantId}/table/${message?.tableId}/status-table`,
        body: JSON.stringify(message), 
      });
    } else {
      console.error("Client is not connected");
    }
  }

  const handleSubmitDish = () => {
     const newCart = cartList?.map((c) => {
      return {
        dishId: c.dishId,
        comboId: c.comboId,
        quantity: c.quantity,
      };
    });
    const result = {
      dishOrderRequests: newCart,
      orderId: orderId,
    };

    addDish(result);
    const action = clearCart();
    dispatch(action);
  }


    useEffect(() => {
        if(slug === "combo"){
          axiosInstance
          .get(`/api/combos/restaurant/${user?.restaurantId}`)
          .then(res => {
              const data = res.data.result;
              setDishesList(data);
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
        }else{
          axiosInstance
          .get(`/api/dish/category/${slug}/restaurant/${user?.restaurantId}`)
          .then(res => {
              const data = res.data;
              setDishesList(data.result);
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



        
    },[slug])


    const handleAddDish = (dish) => {
        let dishAdd;
        console.log(dish);
        if(dish?.dishes){
            dishAdd = {
                dishId: null,
                name: dish?.name,
                code: null,
                weight: null,
                description: dish?.description,
                price: dish?.price,
                imageUrl: dish?.imageUrl,
                comboId: dish?.id
            }
        }else{
            dishAdd = {
                dishId: dish?.id,
                name: dish?.name,
                code: dish?.code,
                weight: dish?.weight,
                description: dish?.description,
                price: dish?.price,
                imageUrl: dish?.imageUrl,
                comboId: null
            }
        }

        const action = addToCart(dishAdd);
        dispatch(action);
    }

    const handleIncreaseDish = (id) => {
        const action = increaseDishQuantity(id);
        dispatch(action);
    }

    const handleDecreaseDish = (dish) => {
        const action = reduceDish(dish);
        dispatch(action);
    }

    const handleRemoveDish = (id) => {
      const action = removeDish(id);
      dispatch(action);
    }

    const handleEnterTable = () => {
      if(!validator.isMobilePhone(phoneNumber, 'vi-VN')){
        toast.warn("Số điện thoại không đúng định dạng")
        return
      }
      axiosInstance
      .get(`/api/customers/${phoneNumber}`)
      .then((res) => {
        const data = res.data.result;
        if (data !== null) {
          setCustomer(data);
          const actionCustomer = saveCustomer(data);
          dispatch(actionCustomer);
          setIsExistCustomer(true);
          const requestData =  {
                      tableId: table?.tableId,
                      employeeId: user?.employeeId,
                      customerResponse: data,
                      restaurantId: user?.restaurantId,
                    };
                    axiosInstance
                    .post(`/create`, requestData)
                    .then((res) => {
                      const idResult = res.data.result?.id;
                      const actionOrder = saveOrderId(idResult);
                      dispatch(actionOrder);
                      changeStatusTable(requestData);
                    })
                    .catch((err) => {
                      if (err.response) {
                        const errorRes = err.response.data;
                        toast.error(errorRes.message);
                      } else if (err.request) {
                        toast.error("Yêu cầu không thành công");
                      } else {
                        toast.error(err.message);
                      }
                    });
        } else {
          toast("Khách hàng không tồn tại, vui lòng tạo thông tin!");
        }
      })
      .catch((err) => {
        if (err.response) {
          const errorRes = err.response.data;
          toast.error(errorRes.message);
          setIsAddCustomer(true);
          setIsExistCustomer(true);
        } else if (err.request) {
          toast.error("Yêu cầu không thành công");
        } else {
          toast.error(err.message);
        }
      });
    }

    useEffect(() => {
      const data = {
        tableId: currentTable,
        employeeId: user?.employeeId,
        customerResponse: customer,
        restaurantId: user?.restaurantId,
      }
    },[customer])

    const handleCreateCustomer = () => {
      
      const customerAdd = {
        phoneNumber: phoneNumber,
        name: customerName,
        address: address,
        restaurantId: user?.restaurantId
      }
       axiosInstance
                .post(`/api/customers/create`, customerAdd)
                .then(res => {
                    const data = res.data.result;
                    setCustomer(data);
                    const action = saveCustomer(data);
                    dispatch(action);
                    toast.success(`Tạo thông tin khách hàng ${customerName} thành công`);
                    handleCloseCreatePop();
                    const requestData =  {
                      tableId: table?.tableId,
                      employeeId: user?.employeeId,
                      customerResponse: data,
                      restaurantId: user?.restaurantId,
                    };
                    axiosInstance
                    .post(`/create`, requestData)
                    .then((res) => {
                      const idResult = res.data.result?.id;
                      const actionOrder = saveOrderId(idResult);
                      dispatch(actionOrder);
                      changeStatusTable(requestData)
                      console.log(idResult);
                    })
                    .catch((err) => {
                      if (err.response) {
                        const errorRes = err.response.data;
                        toast.error(errorRes.message);
                      } else if (err.request) {
                        toast.error("Yêu cầu không thành công");
                      } else {
                        toast.error(err.message);
                      }
                    });
                })
                .catch(err => {
                    if(err.response){
                        const errRes = err.response.data;
                        toast.error(errRes.message);
                    }else if(err.request){
                        toast.error("Không thể gửi yêu cầu đến máy chủ!")
                    }else{
                        toast.error(err.message);
                    }
                })

      
    }

    const handleClearCart = ( ) => {
      const action = clearCart();
      dispatch(action);

    }

    const handleCloseCreatePop = () => {
      setIsAddCustomer(false);
      setIsExistCustomer(false);
    }

    const handleChangePhone = (value) => {
        if(!isNaN(value) && value.length<=10){
            setPhoneNumber(value);
        }
    }


    return(
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarStaff/>
                </div>
                <div className="basis-[88%] border overflow-scroll max-h-[100vh]">
                    <NavBarStaff />
                    <div className="flex w-full">
                      <div className="w-full border-r-2">
                        <div className={`h-11 mb-2  flex justify-between ${isExistCustomer?"":'hidden'}`}>
                            <div className="h-full flex items-center justify-between w-[49%] py-2 px-3 bg-slate-300">
                             <div className="flex items-center"> 
                                <FaUserCircle className="size-6"/>
                                <div className="ml-2 flex items-center">
                                  <span className="font-medium text-sm mr-2">Khách hàng:</span>
                                  <b className="font-medium text-sm">{customerDetail?.name}</b>
                                </div>
                              </div>
                              <div className="w-[10%]"></div>
                              {/* <PiPencilSimpleLineBold className="cursor-pointer"/> */}

                            </div>
                            <div className="h-full flex items-center justify-between w-[49%] py-2 px-3 bg-slate-300 mr-2 shadow-md rounded-sm">
                              <div className="flex items-center"> 
                                <IoMdPhonePortrait className="size-6"/>
                                <div className="ml-2 flex items-center">
                                  <span className="font-medium text-sm mr-2">Số điện thoại:</span>
                                  <b className="font-medium text-sm">{customerDetail?.phoneNumber}</b>
                                </div>
                              </div>
                              <div className="w-[10%]"></div>
                              {/* <PiPencilSimpleLineBold className="cursor-pointer"/> */}

                            </div>
                        </div>
                        <div className={`h-11 mb-2  flex justify-between ${isExistCustomer?"hidden":''}`}>
                           
                            <div className="h-full flex w-full justify-end  ">
                              <button
                                  className="py-2 px-3 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                              >
                                  <IoMdAdd /> Thêm Khách hàng
                              </button>
                            </div>
                        </div>
                        {!isExistCustomer  ?<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50 animate-slideIn">
                                    {/* <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                                    >
                                        &times;
                                    </button> */}
                                    <h2 className="text-xl font-semibold mb-4">
                                      Nhập thông tin khách hàng
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block mb-2">Số điện thoại khách hàng</label>
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={e => handleChangePhone(e.target.value)}
                                            placeholder="VD: 08888637937"
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        
                                        <button
                                          onClick={() => handleEnterTable()}
                                            className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300"
                                        >
                                          Xác nhận
                                        </button>
                                    </div>
                                </div>
                            </div>:''}

                            {isAddCustomer ?  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50 animate-slideIn">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl "
                                        onClick={handleCloseCreatePop}
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl font-semibold mb-4">
                                       Thêm khách hàng
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block mb-2">Số điện thoại</label>
                                        <input
                                            type="number"
                                            placeholder="Số điện thoại"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md `}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Tên khách hàng</label>
                                        <input
                                            type="text"
                                            placeholder="VD: Nguyen Van A"
                                            value={customerName}
                                            onChange={e => setCustomerName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Địa chỉ</label>
                                        <input
                                            type="text"
                                            placeholder="VD: Thạch thất, Hà Nội"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={handleCloseCreatePop}
                                            className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={() => handleCreateCustomer()}
                                            className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                </div>
                            </div> : ''}
                            
                        <div className=" flex flex-wrap overflow-y-auto no-scrollbar max-h-[79vh]">
                          {dishesList?.map((d, index) => {
                              return (
                                <a 
                                    className="w-full md:w-1/2 flex flex-col items-center md:flex-row"
                                    key={index}
                                    onClick={() => handleAddDish(d)}
                                >
                                    <div className="flex-shrink-0 w-full md:w-1/2">
                                        <img className="object-cover h-[180px] w-[240px] md:h-[180px]" src={d?.imageUrl} alt=""/>
                                    </div>
                                    <div className="relative flex flex-col p-4 leading-normal w-full" >
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{d?.name}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{formatVND(d?.price)}</p>
                                        <span className="mb-3 font-xs text-black dark:text-gray-400 w-[80%] line-clamp-2">
                                          {d?.description}
                                        </span>
                                        <div className="absolute bottom-2 right-4 cursor-pointer" >
                                            <FaPlusCircle className="text-red-600 size-7 hover:text-secondary transition ease-in-out duration-300"/>
                                        </div>
                                    </div>
                                </a>
                              )
                          })}
                        </div>
                      </div>
                      
                      <div className="w-[35%] bg-slate-500">
                          <div className="w-full h-14 flex justify-between">
                            <div className="bg-slate-300 flex flex-col items-center text-center w-[25%] p-2 rounded-sm ">
                              <GrRestaurant className="size-4 mb-2"/>
                              <span className="text-sm font-semibold ">Vị trí </span>
                            </div>
                            <div className="bg-slate-300 flex w-[74%] items-center p-2 rounded-sm">
                              <span className="font-semibold">{table?.areaName}: {table?.tableName}</span>
                            </div>
                          </div>
                          <div className="flex-row relative h-[91%]  ">
                            <div className="min-h-[79vh] max-h-[70vh] overflow-y-auto no-scrollbar pb-32">
                              {cartList?.map((cart, index) => {
                                return (
                                  <div className="w-full bg-secondary px-1 py-2 mt-2 shadow-sm rounded-sm " key={index}>
                                      <div className="w-full text-white flex justify-between">
                                        <b>{index <= 9 ? index+1 : index+1}. {cart?.name}</b>
                                        <div className="w-[30%] font-semibold text-right">
                                          <span>{cart?.quantity}</span>
                                        </div>
                                        <i className="font-semibold">{formatVND(cart?.price*cart?.quantity)}</i>
                                      </div>
                                      <div className="w-full">
                                        <span className="ml-4 mx-2 text-white text-[12px]">Giá thường: {formatVND(cart?.price)}</span>
                                      </div>
                                      <div className="w-full flex justify-around mt-2 items-center pb-2">
                                        <div 
                                            className="w-1/4 p-2 border-2 flex justify-center bg-white shadow-sm mb cursor-pointer"
                                            onClick={() => handleDecreaseDish({dishId: cart?.dishId, comboId: cart?.comboId})}
                                            ><FaMinus className="size-3" /></div>
                                        <div
                                            className="w-1/4 p-2 border-2 flex justify-center bg-white shadow-sm mb cursor-pointer"
                                            onClick={() => handleIncreaseDish({dishId: cart?.dishId, comboId: cart?.comboId})}
                                        ><FaPlus className="size-3"/></div>
                                        {/* <div className="w-1/6 p-2 border-2 flex justify-center bg-white shadow-sm mb cursor-pointer"><CiEdit/></div> */}
                                        <div 
                                          className="w-1/4 p-2 border-2 flex justify-center bg-white shadow-sm mb cursor-pointer"
                                          onClick={() => handleRemoveDish({dishId: cart?.dishId, comboId: cart?.comboId})}
                                          ><FaTrash className="size-3"/></div>
                                      </div>
                                    </div>
                                )
                              })}
                            </div>
                            <div className="absolute bottom-0 w-full flex flex-wrap justify-center bg-slate-400">
                              <div className="bg-white  w-full p-3 mx-1 my-2 flex justify-between ">
                                <span >Tổng tiền:</span>
                                <span className="font-semibold">{formatVND(totalAmount)}</span>
                              </div>
                              <div className="w-full flex flex-wrap justify-between">
                                <div className="w-[24%] bg-red-700 h-16 text-white ml-[2px] rounded-sm flex items-center justify-center  cursor-pointer text-center" onClick={() => handleClearCart()}>
                                  <span>Làm mới</span>
                                </div>
                                <div className="w-[24%] bg-purple-500 h-16 text-white ml-[2px] rounded-sm flex items-center justify-center cursor-pointer text-center" 
                                    onClick={() => navigate("/waiter/ordering")}
                                >
                                  <span>Trạng thái </span>
                                </div>
                                <div className="w-[24%] bg-green h-16 text-white ml-[2px] rounded-sm flex items-center justify-center  cursor-pointer text-center " onClick={() => handleSubmitDish()}>
                                  <span>Xác nhận</span>
                                </div>
                                <div className="w-[24%] bg-blue-600 h-16 text-white ml-[2px] rounded-sm flex items-center justify-center cursor-pointer text-center"
                                  onClick={() => navigate('/waiter/payment')}
                                >
                                  <span className="text-center">Thanh toán</span>
                                </div>
                              </div>
                            </div>
                          </div>
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

              /* Default styles for larger screens */
              .basis-12 {
                  flex-basis: 12%;
              }

              .basis-88 {
                  flex-basis: 88%;
              }

              .w-49 {
                  width: 49%;
              }

              .w-35 {
                  width: 35%;
              }

              .w-24 {
                  width: 24%;
              }

              /* Responsive styles for iPad screens */
              @media (max-width: 1024px) {
                  .basis-12 {
                      flex-basis: 100%;
                      height: auto;
                  }

                  .basis-88 {
                      flex-basis: 100%;
                      height: auto;
                  }

                  .w-49 {
                      width: 100%;
                  }

                  .w-35 {
                      width: 100%;
                  }

                  .w-24 {
                      width: 48%;
                      margin-bottom: 10px;
                  }

                  .h-16 {
                      height: auto;
                  }
              }
          `}</style>
        </div>


    )
}

export default Menu