import { useEffect, useState } from "react";
import { BiSolidDish } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import axiosInstance from "../../../utils/axiosInstance";
import { useUser, WEBSOCKET_CONNECTION } from "../../../utils/constant";
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
    const [isOpen, setIsOpen] = useState(false);
    const [currentTable, setCurrentTable] = useState();
    const [listSchedule, setListSchedule] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(6);
    const [totalSchedules, setTotalSchedules] = useState();
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const {slug} = useParams();

    useEffect(()=>{
        const socket = new SockJS(WEBSOCKET_CONNECTION);
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

    useEffect(() => {
        if(currentTable ){
            axiosInstance
            .get(`/api/schedule/table/${currentTable?.id}`,{
                params: {
                    page: currentPage,
                    size: size
                }
            })
            .then(res => {
                const data = res.data.result;
                setListSchedule(data.results)
                setTotalSchedules(data.totalItems)
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
    },[currentTable])

    useEffect(() => {
        if(currentTable){
            axiosInstance
            .get(`/api/schedule/table/${currentTable?.id}`,{
                params: {
                    page: currentPage,
                    size: size
                }
            })
            .then(res => {
                const data = res.data.result;
                setListSchedule(data.results)
                setTotalSchedules(data.totalItems)
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
    },[currentPage])

    const handleClick = (page) => {
        if(page > 0 && page <= (totalSchedules / size + 1)){
            setCurrentPage(page);
        }

    };
    
    const handleClose = ()  => {
        setIsOpen(false);
        setCurrentTable();
    }

    const handleOpen = (table) => {
        setIsOpen(true);
        console.log(table);
        setCurrentTable(table)
        setCurrentPage(1);
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
                            <p className='text-[10px] font-extrabold leading-[16px] text-white/[0.4]'> Khu vực</p>
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
                                onClick={() => handleOpen(table)}
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
                {isOpen && (
                    <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                        <div className="relative w-full max-w-5xl bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                            <button type="button" onClick={() => handleClose()} className="absolute top-3 end-2.5 text-red-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="w-full flex justify-center items-center mb-4 border-b-2 pb-2 pt-4 bg-slate-200 rounded-t-lg">
                                <h2 className="font-bold text-lg">Danh sách các đơn đặt bàn - {currentTable?.name}</h2>
                            </div>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Khách hàng
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Số điện thoại
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Thời gian
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Số khách
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Dự kiến 
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Lưu ý
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Trạng thái
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listSchedule?.map((schedule, index) => (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {schedule?.customerName}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {schedule?.customerPhone}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {schedule?.time}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {schedule?.numbersOfCustomer}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {schedule?.intendTime}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {schedule?.note}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{schedule?.status === 'PENDING' ? "Chưa nhận" : (schedule?.status === 'ACCEPT' ? "Đã nhận" : 'Từ chối')}</a>
                                                </td>
                                            </tr>
                                        ) )}
                                        {listSchedule?.length === 0 && (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"></th>
                                                <td className="px-6 py-4">Bàn không có đơn đặt bàn nào trong ngày hôm nay</td>
                                                <td className="px-6 py-4"></td>
                                                <td className="px-6 py-4"></td>
                                                <td className="px-6 py-4"></td>
                                                <td className="px-6 py-4"></td>
                                                <td className="px-6 py-4"></td>
                                            </tr>
                                        )}
                                        
                                    </tbody>
                                </table>
                                {listSchedule?.length > 0 && (
                                    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Hiển thị <span className="font-semibold text-gray-900 dark:text-white">{1 + size*(currentPage-1)}-{(size + size*(currentPage-1) <= totalSchedules ? size + size*(currentPage-1) : totalSchedules)}</span> trong <span className="font-semibold text-gray-900 dark:text-white">{totalSchedules} </span>đơn đặt bàn</span>
                                        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                            <li onClick={() => handleClick(currentPage-1)}>
                                                <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Trước</a>
                                            </li>
                                            {Array.from({ length: (totalSchedules%size > 0 ?totalSchedules/size+1 : totalSchedules/size) }).map((_, index) => (
                                                <li onClick={() => setCurrentPage(index+1)}>
                                                    <a href="#" aria-current="page" className={`flex items-center justify-center px-3 h-8 leading-tight ${
                                                        currentPage === index+1
                                                            ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                                                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                                        }`}>{index+1}</a>
                                                </li>
                                            ))}
                                            <li onClick={() => handleClick(currentPage+1)}>
                                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Sau</a>
                                            </li>
                                            
                                        </ul>
                                    </nav>
                                )}
                            </div>
                        </div>
                    
                </div>
                )}
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

export default MapHostess
