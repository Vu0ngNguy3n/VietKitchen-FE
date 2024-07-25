import { useEffect, useState } from "react";
import { BiSolidDish } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import axiosInstance from "../../../utils/axiosInstance";
import { getUser } from "../../../utils/constant";
import LOGO from "../../../assests/VIET.png"
import Table from "../../../components/managerComponent/RestaunrantMap/Table"
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";


function MapHostess() {

    const [areaList, setAreaList] = useState([])
    const [currentArea, setCurrentArea] = useState();
    const [board, setBoard] = useState([]);
    const [currentAreaName, setCurrentAreaName] = useState();
    const user = getUser();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        axiosInstance
        .get(`/api/area/${user?.restaurantId}`)
        .then(res =>{ 
            const data =res.data.result;
            if(data.length > 0){
                setCurrentArea(data[0].id)
                setCurrentAreaName(data[0].name)
            }
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
        if(currentArea !== undefined){
             axiosInstance
            .get(`/api/table/area/${currentArea}`)
            .then(res => {
                const data = res.data.result;
                setBoard(data);
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
        }
    },[currentArea])

    const handleChangeArea = (area) => {
        setCurrentArea(area?.id)
        setCurrentAreaName(area?.name)
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
                                            <BiSolidDish color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>{area?.name}</p>
                                        </div>
                                        {/* <FaChevronRight color='white' /> */}
                                    </div>
                                )
                            })}

                        
                            
                        </div>
            
                    </div>
                </div>
            <div className="basis-[88%] border overflow-scroll h-[100vh]">
                <NavBarStaff />
                <div className="min-w-[40]x rounded-lg bg-slate-300 p-6 shadow min-h-[90vh] h-full w-full">
                        
                    <div className="relative bg-white border-2 border-gray-300 rounded-lg shadow-lg w-full h-[600px]">
                        {board?.map((picture, index) => (
                            <Table
                                        typeTable={picture?.tableType?.id}
                                        id={picture?.id}
                                        key={index}
                                        positionX={picture?.positionX}
                                        positionY={picture?.positionY}
                                        name={picture?.name}
                                        orderCurrent={picture?.orderCurrent}
                                        numberChairs={picture?.numberChairs}
                                    />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MapHostess
