import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Map from "../../../components/managerComponent/RestaunrantMap/Map"
import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import axiosInstance from "../../../utils/axiosInstance";
import LOGO from "../../../assests/VIET.png"
import { getUser } from "../../../utils/constant";
import { useNavigate } from "react-router";
import { BiSolidDish } from "react-icons/bi";
import { saveTable } from "../../../actions/tableActions";
import { useDispatch } from "react-redux";
import { saveCustomer } from "../../../actions/customerActions";
import { saveOrderId } from "../../../actions/orderActions";


function MapWaiter(){

    const [areaList, setAreaList] = useState([])
    const [currentArea, setCurrentArea] = useState();
    const [board, setBoard] = useState([]);
    const [currentAreaName, setCurrentAreaName] = useState();
    const user = getUser();
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
    const handleChooseTable = (table) => {
        const tableData = {
            tableId: table.id,
            tableName: table?.name,
            areaId: currentArea,
            areaName: currentAreaName
        }
        const action = saveTable(tableData);
        dispatch(action);
        axiosInstance
        .get(`/api/order/table/${table.id}`)
        .then(res => {
           if(res.data.result !== null){
                const dataCustomer = res.data.result.customer;
                const dataOrderId = res.data.result.id;
                const actionCustomer = saveCustomer(dataCustomer);
                dispatch(actionCustomer);
                const actionOrderId = saveOrderId(dataOrderId);
                dispatch(actionOrderId)
                navigate("/waiter/menu/o-rung")
           }else{
                navigate("/waiter/menu/o-rung")
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

    return (
        <div className="">
            <div className="flex ">
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
                <div className="basis-[100%] border overflow-scroll h-[100vh]">
                    <NavBarStaff />
                    <div className="min-w-[40]x bg-secondary p-10 shadow min-h-[86vh] mt-2 ">
                         {/* <h1 className="font-black text-3xl">Sơ đồ nhà hàng</h1> */}
                        
                        <div className="w-full flex flex-wrap justify-between">
                            {board?.map((table, index) => {
                                return (
                                    <div 
                                        className="flex-row p-8 border-2 border-transparent bg-white justify-center w-[12%] mb-2 rounded-lg shadow-lg cursor-pointer hover:opacity-80 transition-all duration-300" 
                                        key={index} 
                                        onClick={() => handleChooseTable(table)}    
                                    >
                                        <div className="text-center">
                                            <b>{table?.name}</b>
                                        </div>
                                        <div className="text-center mt-2">
                                            <hr className="w-1/2 mx-auto border-gray-400" />
                                            <span className="block mt-2 text-sm text-gray-500">Bàn trống</span>
                                        </div>
                                    </div>

                                )
                            })}
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
        </div>
    )
}

export default MapWaiter