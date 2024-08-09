import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import { useUser } from "../../../utils/constant";
import { AiTwotoneEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import {  FaPlus } from "react-icons/fa";
import REACTANGE4 from "../../../assests/reactange4.png"
import REACTANGE6 from "../../../assests/reactange6.png"
import REACTANGE8 from "../../../assests/reactange8.png"
import ROUND4 from "../../../assests/round4.png"
import ROUND6 from "../../../assests/round6.png"
import ROUND8 from "../../../assests/round8.png"
import SQUARE4 from "../../../assests/square4.png"
import SQUARE6 from "../../../assests/square6.png"
import SQUARE8 from "../../../assests/square8.png"
import ZEROTABLE from "../../../assests/zeroTable.jpg"

const MapMain = () => {
    const [board, setBoard] = useState([]);
    const [isEnableSave, setIsEnableSave] = useState(false);
    const [areaList, setAreaList] = useState([])
    const user = useUser();
    const [currentArea, setCurrentArea] = useState();
    const [userStorage, setUserStorage] = useState();
    const [areaName, setAreaName] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isReRender, setIsReRender] = useState(false);
    const [isCreateArea, setIsCreateArea] = useState(true);
    const [tableName, setTableName] = useState();
    const [typeTableList, setTypeTableList] = useState([]);
    const [currentTypeTable, setCurrentTypeTable] = useState();
    const [numberTables, setNumberTables] = useState(1);
    const [isOpenSave, setIsOpenSave] = useState(false);
    const [isAddTable, setIsAddTable] = useState(false);
    const [isAddArea, setIsAddArea] = useState(false);
    const [isOpenCreateTable, setIsOpenCreateTable] = useState(false);
    const [typeTable, setTypeTable] = useState();
    const [shapeTable, setShapeTable] = useState();
    const [areaDetail, setAreaDetail] = useState();
    const [isSave, setIsSave] = useState(null);
    

    
    useEffect(() => {
        setUserStorage(user);
        axiosInstance
        .get(`/api/area/${user?.restaurantId}`)
        .then(res =>{ 
            const data =res.data.result;
            if(data.length > 0){
                setCurrentArea(data[0]?.id)
                setAreaDetail(data[0]);
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
                
        axiosInstance
        .get(`/api/table-type`)
        .then(res => {
            const data = res.data.result;
            setTypeTableList(data);
            setCurrentTypeTable(data[0].id)
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
    }, [])

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
       
    }, [currentArea,isAddTable])

    useEffect(() => {
            axiosInstance
            .get(`/api/area/${user?.restaurantId}`)
            .then(res =>{ 
                const data =res.data.result;
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
    },[ isAddArea])

    const handleOpenTable = () => {
        setIsOpenCreateTable(true);
        setIsCreateArea(false);
    }

    const handleOpenPopup = () => {
        setIsOpen(true);
        setIsCreateArea(true);
    }

    const handleClosePopup = () => {
        setIsOpen(false)
        setAreaName('');
    }
    
    const handleClosePopTable = () => {
        setIsOpenCreateTable(false);
         setTableName('');
        setTypeTable();
        setShapeTable();
    }

    const handleCreateArea = () => {
        
            if(isCreateArea){
                if(areaName.trim() === ''){
                    toast.warn('Tên khu vực không dược để trống!')   
                }else{
                    const area = {
                        name: areaName,
                        restaurantId: +user.restaurantId
                    }

                    axiosInstance
                    .post(`/api/area/create`, area)
                    .then(res => {
                        toast.success(`Tạo khu vực ${areaName} thành công`);
                        handleClosePopup();
                        // setIsReRender(!isReRender)
                        setIsAddArea(!isAddArea);
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
            }else{
                if(tableName === '' || numberTables === ''|| !typeTable || !shapeTable){
                    toast.warn("Vui lòng nhập đầy đủ thông tin")
                }else{
                    const table = {
                        name: tableName,
                        numberChairs: typeTable,
                        tableTypeId: shapeTable,
                        areaId: +currentArea,
                        positionX: 0,
                        positionY: 0,
                    }

                    axiosInstance
                    .post(`/api/table/create/${numberTables}`, table)
                    .then(res => {
                        toast.success(`Tạo bàn ${tableName} thành công`);
                        handleClosePopTable();
                        setIsAddTable(!isAddTable);
                        setTableName('');
                        setTypeTable();
                        setShapeTable();
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
                
            }
            
        
    }

    const handleOpenSavePopUp = () => {
        setIsOpenSave(true);
    }

    const handleCloseSavePopUp = () => {
        setIsOpenSave(false);
    }

    const handleSave = () => {
        axiosInstance
        .put(`/api/table/update`,board)
        .then(res => {
            toast.success("Lưu thành công")
            setIsReRender(!isReRender)
            setIsEnableSave(false);
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
        handleCloseSavePopUp();
    }

    const handleChangeAreaDetail = (areaId) => {
        setCurrentArea(areaId);
        const areaFind = areaList?.find(a => a?.id == areaId);
        setAreaDetail(areaFind);
    }
 
    const handleChangeNumberTable = (number) => {
        if(!isNaN(number)){
            if(number > 0 && number < 20){
                setNumberTables(number)
            }else{
                setNumberTables(1)
            }
        }
    }

    const handleOpenEdit = (table) => {
        console.log(table);
    }

    const handleOpenDelete = (table) => {
        console.log(table);
    }

    return (
         <div className="">
            <div className="w-full flex justify-center">
                <div className="flex flex-col gap-4 md:flex-row justify-between w-[90%]">
                    <div className="flex items-center ">
                            <select
                                id="countries"
                                value={currentArea}
                                onChange={(e) => handleChangeAreaDetail(e.target.value)}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                outline-none px-8 py-3 cursor-pointer">
                                {
                                    areaList?.map((area, index) => {
                                        return <option value={area?.id} key={index}>{area?.name}</option>
                                    })
                                }
                            </select>
                            <button
                                    className="py-2 px-5 ml-[10px] bg-blue-500 font-semibold text-white rounded hover:bg-blue-700 transition-all duration-300 flex items-center"
                                    onClick={handleOpenPopup}
                                    >
                                <FaPlus className="mr-1" />
                                Thêm khu vực
                            </button>
                    </div>

                    <div className="flex items-center">
                        <div>
                            <button
                                    className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-blue-700 transition-all duration-300 flex items-center"
                                    onClick={handleOpenTable}
                                    >
                                <FaPlus className="mr-1" />
                                Thêm bàn mới
                            </button>
                        </div>
                        <div>
                            <button
                                    className={`py-2 px-5 bg-red-500 ml-[20px] font-semibold text-white rounded hover:bg-red-800 transition-all duration-300 ${isEnableSave ? "flex" : 'hidden'}
                                    items-center`}
                                    disabled={!isEnableSave}
                                    onClick={handleOpenSavePopUp}
                                    >
                                <FaPlus className="mr-1" />
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
                        {isOpenSave ?<div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                                    <button type="button" onClick={handleCloseSavePopUp} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-4 md:p-5 text-center">
                                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        </svg>
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn lưu lại sơ đồ?</h3>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={() => handleSave()}
                                            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                            Có
                                        </button>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={handleCloseSavePopUp}
                                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Không
                                        </button>
                                    </div>
                                </div>
                            </div>:''}
                        {isOpen ? <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50 animate-slideIn">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                                        onClick={handleClosePopup}
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl font-semibold mb-4">
                                        {isCreateArea ? 'Thêm khu vực mới' : 'Thêm bàn mới'}
                                    </h2>
                                    {isCreateArea && <div className="mb-4">
                                        <label className="block mb-2">Tên khu vực <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Tên khu vực"
                                            value={areaName}
                                            onChange={(e) => setAreaName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>}
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                                            onClick={handleClosePopup}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={() => handleCreateArea()}
                                            className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-blue-500 transition-all duration-300"
                                        >
                                            Thêm 
                                        </button>
                                         
                                    </div>
                                </div>
                            </div>
                            : ''}
                            {isOpenCreateTable ? <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl z-50 animate-slideIn">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                                        onClick={handleClosePopTable}
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl font-semibold mb-4">
                                        {isCreateArea ? 'Thêm khu vực mới' : 'Thêm bàn mới'}
                                    </h2>
                                    <hr />
                                    <div className="w-full flex border-b-2 justify-between border-b-gray-400 pb-2 mb-4">
                                        <div className="w-[52%]">
                                           <div className="border-b-2 pb-2 border-b-gray-400">
                                                <div className="mb-2">
                                                    <label className="block mb-2 font-semibold">Tên bàn <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        placeholder="Tên bàn"
                                                        value={tableName}
                                                        onChange={(e) => setTableName(e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-md"
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="block mb-2 font-semibold">Số lượng bàn <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="number"
                                                        placeholder="Số lượng bàn"
                                                        value={numberTables}
                                                        onChange={(e) => handleChangeNumberTable(e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-md"
                                                    />
                                                </div>
                                           </div>
                                           <div className="flex justify-between py-2">
                                                <div className="w-[45%] ">
                                                    <label className="block mb-2 font-semibold">Loại bàn <span className="text-red-500">*</span></label>
                                                    <div className="flex-row">
                                                        <div 
                                                            className={`flex justify-center py-1 border-2 rounded mb-2 shadow-md cursor-pointer duration-300 transition-all ${typeTable === 4 ? "border-blue-500" : "border-gray-400 "}`} 
                                                            onClick={() => setTypeTable(4)}
                                                        >
                                                            <span className="text-center font-semibold">Nhỏ {`(4) chỗ`}</span>
                                                        </div>
                                                        <div 
                                                            className={`flex justify-center py-1 border-2 rounded mb-2 shadow-md cursor-pointer duration-300 transition-all ${typeTable === 6 ? "border-blue-500" : "border-gray-400 "}`} 
                                                            onClick={() => setTypeTable(6)}
                                                        >
                                                            <span className="text-center font-semibold">Trung bình {`(5-8) chỗ`}</span>
                                                        </div>
                                                        <div 
                                                            className={`flex justify-center py-1 border-2 rounded mb-2 shadow-md cursor-pointer duration-300 transition-all ${typeTable === 8 ? "border-blue-500" : "border-gray-400 "}`} 
                                                            onClick={() => setTypeTable(8)}
                                                        >
                                                            <span className="text-center font-semibold">Lớn {`(> 9 chỗ)`}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-[45%]">
                                                    <label className="block mb-2 font-semibold">Kiểu dáng <span className="text-red-500">*</span></label>
                                                     <div className="flex-row">
                                                        {typeTableList?.map((t,index) => {
                                                            return (
                                                                <div 
                                                                    className={`flex justify-center py-1 border-2 rounded mb-2 shadow-md cursor-pointer duration-300 transition-all ${t?.id === shapeTable ?"border-blue-500":"border-gray-400 "}`} 
                                                                    key={index}
                                                                    onClick={() => setShapeTable(t?.id)}
                                                                >
                                                                    {t?.name === "Bàn tròn" && <div className="border-2 border-gray-400 py-1 h-6 w-6 rounded-full"></div>}
                                                                    {t?.name === "Bàn vuông" && <div className="border-2 border-gray-400 py-1 h-6 w-6"></div>}
                                                                    {t?.name === "Bàn chữ nhật" && <div className="border-2 border-gray-400 py-1 h-6 w-10"></div>}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                           </div>
                                        </div>
                                        <div className="w-[45%] border-l-2 flex justify-center items-center">
                                            {(typeTable === 4 && shapeTable === 3) && <img src={REACTANGE4} alt="" className="size-52"/>}
                                            {(typeTable === 6 && shapeTable === 3) && <img src={REACTANGE6} alt="" className="size-52"/>}
                                            {(typeTable === 8 && shapeTable === 3) && <img src={REACTANGE8} alt="" className="size-52"/>}
                                            {(typeTable === 4 && shapeTable === 1) && <img src={ROUND4} alt="" className="size-52"/>}
                                            {(typeTable === 6 && shapeTable === 1) && <img src={ROUND6} alt="" className="size-52"/>}
                                            {(typeTable === 8 && shapeTable === 1) && <img src={ROUND8} alt="" className="size-52"/>}
                                            {(typeTable === 4 && shapeTable === 2) && <img src={SQUARE4} alt="" className="size-52"/>}
                                            {(typeTable === 6 && shapeTable === 2) && <img src={SQUARE6} alt="" className="size-52"/>}
                                            {(typeTable === 8 && shapeTable === 2) && <img src={SQUARE8} alt="" className="size-52"/>}
                                            
                                        </div>
                                    </div>
                                   
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                                            onClick={handleClosePopTable}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={() => handleCreateArea()}
                                            className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-blue-500 transition-all duration-300"
                                        >
                                            Thêm 
                                        </button>
                                    </div>
                                </div>
                            </div>
                            : ''}
                        <div className="mt-2">
                            <div className="w-full flex justify-center items-center">
                                <div className="w-[90%] bg-white px-6 py-3 border-b-2 flex">
                                    <div className="w-[40%] flex items-center">
                                        <span className="font-semibold">Tên khu vực</span>
                                    </div>
                                    <div className="w-[60%] ">
                                        <div className="border-2 px-2 py-2">
                                            {areaDetail?.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {board?.length > 0 ? (
                                <div className="flex justify-center">
                                    <div
                                        className="relative bg-white border-gray-300 shadow-lg flex flex-wrap justify-between px-4 pt-4"
                                        style={{ width: "90%", height: "500px" }}
                                    >
                                        {board?.map((table, index) => (
                                            <div 
                                                className="relative flex flex-col p-8 border-2 border-transparent bg-secondary justify-center w-[15%] h-40 mb-2 rounded-lg shadow-lg cursor-pointer hover:opacity-80 transition-all duration-300 group" 
                                                key={index}
                                            >
                                                {/* Nút Edit */}
                                                <button 
                                                    onClick={() => handleOpenEdit(table)}
                                                    className="absolute top-2 left-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                                    <AiTwotoneEdit/>
                                                </button>

                                                {/* Nút Delete */}
                                                <button
                                                    onClick={() => handleOpenDelete(table)} 
                                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                                    <FaTrashAlt/>
                                                </button>

                                                <div className="text-center">
                                                    <b className="text-white">{table?.name}</b>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <hr className="w-1/2 mx-auto border-white" />
                                                    <span className={`block mt-2 text-sm font-semibold text-white`}>
                                                        {table?.tableType?.id === 1 ? "Bàn tròn" : (table?.tableType?.id === 2 ? "Bàn vuông" : (table?.tableType?.id === 3 && "Bàn chữ nhật"))}
                                                    </span>
                                                    <span className={`block mt-2 text-sm font-semibold text-white`}>
                                                        {table?.numberChairs === 4 ? "4 chỗ" : (table?.numberChairs === 6 ? "5-8 chỗ" : "9 chỗ trở lên")}
                                                    </span>
                                                </div>
                                            </div>


                                        ))}
                                        <div className=" w-[15%] h-40 " ></div>
                                        <div className=" w-[15%] h-40 " ></div>
                                        <div className=" w-[15%] h-40 " ></div>
                                        <div className=" w-[15%] h-40 " ></div>
                                        <div className=" w-[15%] h-40 " ></div>
                                        <div className=" w-[15%] h-40 " ></div>
                                    </div>
                                </div>
                            ):(
                                <div className="flex justify-center">
                                    <div
                                        className="relative bg-white border-gray-300 shadow-lg flex flex-wrap justify-center px-4 pt-4"
                                        style={{ width: "90%", height: "500px" }}
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={ZEROTABLE} alt="" className="size-52" />
                                            <h2 className="font-semibold text-lg mb-3">Khu vực này chưa có bàn</h2>
                                            <button
                                                onClick={() => handleOpenTable()}
                                                className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-blue-700 transition-all duration-300 "
                                            >
                                                Thêm bàn 
                                            </button>
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
    );
};

export default MapMain;
