import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { getUser } from "../../../utils/constant";
import ZEROTABLE from "../../../assests/zeroTable.jpg"
import SidebarChef from "../../../components/staffComponent/chefComponent/SideBarChef";
import { useNavigate } from "react-router";
import NavBarChef from "../../../components/staffComponent/chefComponent/NavBarChef";

function TableAreaChef(){

    const user = getUser();
    const [areaList, setAreaList] = useState([]);
    const [board, setBoard] = useState([]);
    const [currentArea, setCurrentArea] = useState();
    const [currentAreaName, setCurrentAreaName] = useState();
    const navigate = useNavigate();

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
            .get(`/api/table/chef/area/${currentArea}`)
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
        setCurrentArea(area)
    }
    
    return (
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarChef/>
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <NavBarChef />
                   <div className="min-w-[40]x bg-white p-10 shadow min-h-[86vh] mt-2  ">
                         {/* <h1 className="font-black text-3xl">Sơ đồ nhà hàng</h1> */}
                        <div className="mb-4 flex w-full justify-between">
                            <div>
                                <h2 className="font-semibold text-xl text-black">Danh sách các bàn trong khu vực</h2>
                                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Danh sách các bàn có món được gọi.</p>
                            </div>
                            <div className="w-[15%]">
                                <form class="max-w-sm mx-auto">
                                    <label for="countries" class="block mb-2 text-sm font-medium text-black dark:text-black text-right">Khu vực</label>
                                    <select
                                    onChange={(e) => handleChangeArea(e.target.value)} 
                                    id="countries"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {/* <option selected>Choose a country</option> */}
                                    {areaList?.map((area, index) => <option value={area?.id} key={index}>{area?.name}</option>)}
                                    </select>
                                </form>
                            </div>
                        </div>
                        
                        {board?.length > 0 ? (
                            <div className="w-full flex flex-wrap justify-between">
                                {board?.map((table, index) => {
                                    return (
                                        <div 
                                            className="flex-row p-8 border-2 border-transparent bg-secondary justify-center w-[12%] mb-2 rounded-lg shadow-lg cursor-pointer hover:opacity-80 transition-all duration-300" 
                                            key={index} 
                                            onClick={() => navigate(`/chef/dishesInTable/${table?.orderCurrent}`)}
                                        >
                                            <div className="text-center text-white">
                                                <b>{table?.name}</b>
                                            </div>
                                            <div className="text-center mt-2">
                                                <hr className="w-1/2 mx-auto border-gray-400" />
                                                <span className={`block mt-2 text-sm font-semibold text-white`}>Có món được gọi</span>
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
                        ) : (
                            <div className="w-full flex items-center justify-center">
                                <div
                                    className="relative border-gray-300 shadow-lg flex flex-wrap justify-center px-4 pt-4 "
                                >
                                    <div className="flex flex-col items-center justify-center p-6">
                                        <img src={ZEROTABLE} alt="" className="size-52" />
                                        <h2 className="font-semibold text-lg mb-3">Khu vực này không có bàn nào có món được gọi</h2>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default TableAreaChef