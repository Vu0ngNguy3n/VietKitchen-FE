import { useEffect, useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { useNavigate } from "react-router";
import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { IoIosArrowBack } from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useUser } from "../../utils/constant";
import { FaArrowRight } from "react-icons/fa";
import { NumericFormat } from "react-number-format";
import { AiFillEdit } from "react-icons/ai";
import LOCATION from "../../assests/restaurantLocation.jpg"

function AreaManagement() {

    const navigate = useNavigate();
    const [areaList, setAreaList] = useState([])
    const [dataShow, setDataShow] = useState([])
    const [totalTables, setTotalTables] = useState();
    const [areaName, setAreaName] = useState('');
    const [isOpenPopup, setIsOpenPopup] = useState(false); 
    const [isAddArea, setIsAddArea] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [currentArea, setCurrentArea] = useState();
    const user = useUser();

    useEffect(() => {
        getAreaList()
    },[isAddArea])

    const getAreaList = () => {
        axiosInstance
        .get(`/api/area/${user?.restaurantId}`)
        .then(res => {
            const data = res.data.result;
            setAreaList(data);
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

   useEffect(() => {
        if (areaList?.length > 0) {
            const fetchTables = async () => {
                try {
                    const promises = areaList.map(async (a) => {
                        try {
                            const res = await axiosInstance.get(`/api/table/area/${a?.id}`);
                            const data = res.data.result;

                            return {
                                area: a,
                                tables: data.length
                            };
                        } catch (err) {
                            if (err.response) {
                                const errorRes = err.response.data;
                                toast.error(errorRes.message);
                            } else if (err.request) {
                                toast.error("Yêu cầu không thành công");
                            } else {
                                toast.error(err.message);
                            }
                            // Trả về mặc định nếu có lỗi
                            return {
                                area: a,
                                tables: 0
                            };
                        }
                    });

                    // Đợi tất cả các yêu cầu axios hoàn tất
                    const results = await Promise.all(promises);
                    setDataShow(results);
                } catch (error) {
                    // Xử lý lỗi nếu cần
                    toast.error("Đã xảy ra lỗi khi tải dữ liệu.");
                }
            };

            fetchTables();
        }
    }, [areaList]);

    
    useEffect(() => {
        let tablesNumber = 0;
        dataShow?.map(d => {
            tablesNumber+=d?.tables
        })
        setTotalTables(tablesNumber)
    },[dataShow])

    const handleOpenPopCreate = () => {
        setIsOpenPopup(true);
    }

    const handleClosePopCreate = () => {
        setIsOpenPopup(false);
        setAreaName('');
    }

    const submitCreateArea = () => {
        if(areaName === ''){
            toast.warn("Tên khu vực đang để trống")
            return;
        }
        const data = {
            name: areaName,
            restaurantId: user?.restaurantId
        }

        axiosInstance
        .post(`/api/area/create`,data)
        .then(res => {
            toast.success('Tạo khu vực mới thành công')
            setIsAddArea(!isAddArea)
            handleClosePopCreate()
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

    const handleOpenEditPopUp = (area) => {
        setCurrentArea(area)
        setIsOpenEdit(true)
        setAreaName(area?.name)
    }

    const handleCloseEditPopUp = () => {
        setIsOpenEdit(false);
        setAreaName('');
    }
    const handleSubmitEditArea = () => {
        if(areaName === ''){
            toast.warn("Tên khu vực đang bỏ trống")
            return
        }

        const data = {
            name: areaName,
            restaurantId: user?.restaurantId
        }
        
        axiosInstance
        .put(`/api/area/${currentArea?.id}`, data)
        .then(res => {
            toast.success("Cập nhật khu vực thành công")
            handleCloseEditPopUp();
            setIsAddArea(!isAddArea)
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
        <div>
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border h-[100vh] overflow-scroll">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-primary/[0.1] p-16 shadow min-h-[90vh]  mt-2 flex-row ">
    
                        <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[40vh] mt-2 relative">
                            <div className="absolute top-2 left-2 cursor-pointer flex text-gray-500" onClick={() => navigate("/manager/setting")}><IoIosArrowBack className="size-6"/> <span className="font-medium">Thiết lập nhà hàng</span></div>
                            <h1 className="font-black text-3xl mb-8">Danh sách khu vực</h1>

                            {dataShow?.length > 0 ? (
                                <div className="grid gap-4 mb-4 grid-cols-2 w-full">
                                    <div className="w-[60%] flex flex-col">
                                        <span className="font-normal w-full">Cho phép thiết lập, chỉnh sửa các khu vực bàn trong nhà hàng.</span>
                                        <b className="mt-4">Tổng số: {totalTables} bàn/ {dataShow?.length} khu vực</b>
                                    </div>
                                    <div className="w-[100%] bg-gray-300 p-4">
                                        <div className="border-b-2 w-full flex">
                                            <span className="flex font-semibold text-base text-blue-600 border-b-4 border-blue-600 pb-3 cursor-pointer">
                                                Tất cả khu vực
                                            </span>
                                        </div>
                                        <div className="border-b-2 py-3 w-full flex items-center justify-between">
                                            <span className="flex w-[45%] font-semibold text-base">
                                                Tên khu vực
                                            </span>
                                            <span className="flex w-[35%] font-semibold text-base justify-center">
                                                Số lượng bàn
                                            </span>
                                            <span className="w-[20%] font-semibold text-base justify-center">

                                            </span>
                                        </div>
                                        <div className=" py-3 w-full flex items-center flex-wrap">
                                        {dataShow?.map((a, index) => (
                                                <div className="w-full flex justify-between mb-2 border-b pb-3" key={index}>
                                                    <span className="flex w-[45%] font-normal text-base text-blue-600">
                                                        <span className="text-black mr-2">{index+1}. </span>{a?.area?.name}
                                                    </span>
                                                    <span className="flex w-[35%] font-normal text-base justify-center">
                                                        {a?.tables}
                                                    </span>
                                                    <span className="w-[20%] font-semibold text-base items-center ">
                                                        <div className="flex justify-center items-center cursor-pointer " onClick={() => handleOpenEditPopUp(a?.area)}>
                                                            <AiFillEdit className="size-6 text-blue-500 hover:text-blue-800 duration-300 transition-all"/>
                                                        </div>
                                                    </span>
                                                </div>
                                        ))}
                                            
                                        </div>
                                        
                                    </div>
                                </div>
                            ):(
                                <div className="flex items-center px-16">
                                    <div className="flex flex-col w-[70%]">
                                        <h3 className="font-semibold text-gray-700">Chưa thiết lập khu vực</h3>
                                        <span className="mt-2 text-gray-600">Tạo mới khu vực và danh sách bàn để dễ dàng quản lý bán hàng.</span>
                                        <div className="mt-4">
                                            <button onClick={() => handleOpenPopCreate()} className="bg-blue-700 outline-none  px-4 py-2 cursor-pointer rounded text-white font-medium">Tạo khu vực</button>
                                        </div>
                                    </div>
                                    <div className="w-[30%]">
                                        <img src={LOCATION} alt="" className="w-full " />
                                    </div>
                                </div>
                            )}

                            
                        </div>
                    </div>
                    {isOpenPopup  && (
                        <div  className=" fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                            <div className="relative p-4 w-full max-w-md max-h-full">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Tạo khu vực
                                        </h3>
                                        <button onClick={handleClosePopCreate} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-4 md:p-5">
                                        <div className="grid gap-4 mb-4 grid-cols-2">
                                            <div className="col-span-2">
                                                <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên khu vực</label>
                                                <input type="text" name="name" id="name"
                                                value={areaName}
                                                onChange={e => setAreaName(e.target.value)}
                                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                 placeholder="VD: Tầng 1" required=""/>
                                            </div>
                                        </div>
                                        <button  
                                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => submitCreateArea()}
                                        >
                                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                            Tạo khu vực
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    )}
                    {isOpenEdit && (
                        <div  className=" fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                            <div className="relative p-4 w-full max-w-md max-h-full">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Tạo khu vực
                                        </h3>
                                        <button onClick={handleCloseEditPopUp} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="p-4 md:p-5">
                                        <div className="grid gap-4 mb-4 grid-cols-2">
                                            <div className="col-span-2">
                                                <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên khu vực</label>
                                                <input type="text" name="name" id="name"
                                                value={areaName}
                                                onChange={e => setAreaName(e.target.value)}
                                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                 placeholder="VD: Tầng 1" required=""/>
                                            </div>
                                        </div>
                                        <button  
                                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => handleSubmitEditArea()}
                                        >
                                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                            Cập nhật
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    )}
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
            `}</style>
        </div>
    )
}

export default AreaManagement
