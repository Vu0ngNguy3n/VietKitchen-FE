import { useEffect, useState } from "react";
import { BiSolidDish } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import axiosInstance from "../../../utils/axiosInstance";
import { useUser } from "../../../utils/constant";
import LOGO from "../../../assests/VIET.png"
import Table from "../../../components/managerComponent/RestaunrantMap/Table"
import { MdTableBar } from "react-icons/md";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import NavBarHostess from "../../../components/staffComponent/NavBarHostess";
import { MdLocationOn } from "react-icons/md";


function MapHostess() {

    const [areaList, setAreaList] = useState([])
    const [currentArea, setCurrentArea] = useState();
    const [board, setBoard] = useState([]);
    const [currentAreaName, setCurrentAreaName] = useState();
    const user = useUser();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const {slug} = useParams();

    useEffect(()=>{
        const socket = new SockJS("http://localhost:8080/websocket");
        const stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            console.log("Connected to WebSocket");
            setConnected(true);
            stompClient.subscribe(`/topic/restaurant/${user?.restaurantId}`, (message) => {
                const data = JSON.parse(message.body);
                setBoard((prevMessages) => 
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
    },[])

    useEffect(() => {
        if(slug){
            axiosInstance
            .get(`/api/area/${user?.restaurantId}`)
            .then(res =>{ 
                const data =res.data.result;
                // if(data.length > 0){
                //     data.map(d => {
                //         if(d?.id === slug){
                //             setCurrentArea(d?.id);
                //             setCurrentAreaName(d?.name)
                //         }
                //     })
                // }
                setAreaList(data)
                console.log(data);
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
            axiosInstance
            .get(`/api/table/area/${slug}`)
            .then(res => {
                const data = res.data.result;
                setBoard(data);
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
            axiosInstance
            .get(`/api/area/${user?.restaurantId}`)
            .then(res =>{ 
                const data =res.data.result;
                if(data.length > 0){
                    setCurrentArea(data[0].id)
                    setCurrentAreaName(data[0].name)
                }
                setAreaList(data)
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


        
    },[slug])

    useEffect(() => {
        if(currentArea){
            axiosInstance
            .get(`/api/table/area/${currentArea}`)
            .then(res => {
                const data = res.data.result;
                setBoard(data);
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
    },[currentArea])


    const handleChangeArea = (area) => {
        navigate(`/hostess/map/${area?.id}`)
    }
    

    return (
        <div className="flex">
            <div className="basis-[12%] h-[100vh]">
                    <div className='bg-primary px-[25px] h-screen relative'>
                        <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3] '>
                            <img src={LOGO} alt="" className="w-10 inline-block items-center rounded-full mr-2" />
                            <h1 className='text-white text-[20px] leading-[24px] font-extrabold cursor-pointer'> VietKitchen</h1>
                        </div>
            
                        <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                            <p className='text-[10px] font-extrabold leading-[16px] text-white/[0.4]'> Mặt hàng</p>
                            {areaList?.map((area, index) => {
                                return (
                                    <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                                        onClick={() => handleChangeArea(area)}
                                        key={index}>
                                        <div className='flex items-center gap-[10px]'>
                                            <MdLocationOn color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>{area?.name}</p>
                                        </div>
                                        {/* <FaChevronRight color='white' /> */}
                                    </div>
                                )
                            })}
                        </div>
                        <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                            <p className='text-[10px] font-extrabold leading-[16px] text-white/[0.4]'>Chức năng</p>
                            <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer transition ease-in-out duration-300 rounded pl-4 hover:bg-secondary'
                                onClick={() => navigate("/hostess/bookingTable")}
                            >
                                <div className='flex items-center gap-[10px]'>
                                    <MdTableBar color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Đặt bàn</p>
                                </div>
                                {/* <FaChevronRight color='white' /> */}
                            </div>
                        </div>
            
                    </div>
                </div>
            <div className="basis-[88%] border overflow-scroll h-[100vh]">
                <NavBarHostess />
                <div className="min-w-[40]x bg-secondary p-10 shadow min-h-[86vh] mt-2">
                        
                    <div className="w-full flex flex-wrap justify-between">
                        {board?.map((table, index) => (
                            <div 
                                className={`flex-row p-8 border-2 border-transparent ${table?.booked === true ? 'bg-lgreen' : 'bg-white'} justify-center w-[12%] mb-2 rounded-lg shadow-lg cursor-pointer hover:opacity-80 transition-all duration-300`} 
                                key={index} 
                            >
                                <div className="text-center">
                                    <b>{table?.name}</b>
                                </div>
                                <div className="text-center mt-2">
                                    <hr className="w-1/2 mx-auto border-gray-400" />
                                    <span className={`block mt-2 text-sm font-semibold ${table?.orderCurrent === null ? "text-gray-500" : "text-green"}`}>{table?.orderCurrent === null ? "Bàn trống" : "Có khách"}</span>
                                    <span className={`block mt-2 text-sm font-semibold text-blue-600`}>{table?.booked === true ? "Đã được đặt" : ""}</span>
                                </div>
                            </div>

                        ))}
                        <div className="w-[12%]"></div>
                        <div className="w-[12%]"></div>
                        <div className="w-[12%]"></div>
                        <div className="w-[12%]"></div>
                        <div className="w-[12%]"></div>
                        <div className="w-[12%]"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MapHostess
