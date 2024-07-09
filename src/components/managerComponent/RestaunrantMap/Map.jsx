import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import { getUser } from "../../../utils/constant";
import Table from "./Table";
import {  FaPlus } from "react-icons/fa";

const Map = () => {
    const [board, setBoard] = useState();
    const [isEnableSave, setIsEnableSave] = useState(false);
    const [selectedTable, setSelectedTable] = useState();


    const [{ isOver }, drop] = useDrop(() => ({
        accept: "image",
        drop: (item, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset();
            const positionX = Math.round(item.positionX + delta.x);
            const positionY = Math.round(item.positionY + delta.y);
            moveImageToBoard(item.id, positionX, positionY);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const moveImageToBoard = (id, positionX, positionY) => {
         const pictureSize = 70; // Kích thước của ảnh
        const minDistance = 5; // Khoảng cách tối thiểu giữa các ảnh
        // const isPositionTaken = board.some((picture) => {
        //     if (picture.id === id) {
        //         return false; // Bỏ qua so sánh với chính ảnh đang kéo thả
        //     }

        //     // Tính khoảng cách giữa ảnh đang kéo thả và ảnh trong mảng
        //     const distanceX = Math.abs(picture.positionX - positionX);
        //     const distanceY = Math.abs(picture.positionY - positionY);

        //     // Kiểm tra xem ảnh có bị giao nhau với ảnh trong mảng không
        //     return (
        //         distanceX < pictureSize + minDistance &&
        //         distanceY < pictureSize + minDistance
        //     );
        // });

        // if (isPositionTaken) {
        //     toast.warn(
        //         "Vị trí này đã có ảnh khác hoặc không đủ khoảng cách. Vui lòng chọn vị trí khác."
        //     );
        //     return;
        // }
        setIsEnableSave(true);
        setBoard((prevBoard) =>
            prevBoard.map((b) => (b.id === id ? { ...b, positionX, positionY } : b))
        );

    };

    const [areaList, setAreaList] = useState([])
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

    useEffect(() => {
        const user = getUser();
        setUserStorage(user);
        console.log(user.restaurantId , '2');
        axiosInstance
        .get(`/api/area/${user?.restaurantId}`)
        .then(res =>{ 
            const data =res.data.result;
            if(data.length > 0){
                setCurrentArea(data[0].id)
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
            const user = getUser();
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
        setIsOpen(true);
        setIsCreateArea(false);
    }

    const handleOpenPopup = () => {
        setIsOpen(true);
        setIsCreateArea(true);
    }

    const handleClosePopup = () => {
        setIsOpen(false)
        setAreaName('');
        setTableName('');
        setNumberTables(1);
    }

    const handleCreateArea = () => {
        
            if(isCreateArea){
                if(areaName.trim() === ''){
                    toast.warn('Vui lòng điền tên khu vực!')   
                }else{
                    const area = {
                        name: areaName,
                        restaurantId: +userStorage.restaurantId
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
                const table = {
                    name: tableName,
                    tableTypeId: currentTypeTable,
                    areaId: +currentArea,
                    positionX: 0,
                    positionY: 0,
                }

                axiosInstance
                .post(`/api/table/create/${numberTables}`, table)
                .then(res => {
                    toast.success(`Tạo bàn ${tableName} thành công`);
                    handleClosePopup();
                    setIsAddTable(!isAddTable);
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

    return (
         <div>
            <div className="flex mt-6 flex-col gap-4 md:flex-row justify-between">
                            <div className="flex items-center ">
                                    <select
                                        id="countries"
                                        value={currentArea}
                                        onChange={(e) => setCurrentArea(e.target.value)}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                        focus:border-blue-500 block  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                        outline-none px-4 py-3 cursor-pointer">
                                        {
                                            areaList?.map((area, index) => {
                                                return <option value={area?.id} key={index}>{area?.name}</option>
                                            })
                                        }
                                    </select>
                                    <button
                                         className="py-2 px-5 ml-[10px] bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300 flex items-center"
                                         onClick={handleOpenPopup}
                                         >
                                        <FaPlus className="mr-1" />
                                        Thêm khu vực
                                    </button>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <button
                                         className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300 flex items-center"
                                         onClick={handleOpenTable}
                                         >
                                        <FaPlus className="mr-1" />
                                        Tạo bàn
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
                                        <label className="block mb-2">Tên khu vực</label>
                                        <input
                                            type="text"
                                            placeholder="Tên khu vực"
                                            value={areaName}
                                            onChange={(e) => setAreaName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>}
                                    {!isCreateArea && <div className="mb-4">
                                        <label className="block mb-2">Tên bàn</label>
                                        <input
                                            type="text"
                                            placeholder="Tên bàn"
                                            value={tableName}
                                            onChange={(e) => setTableName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>}
                                    {!isCreateArea && <div className="mb-4">
                                        <label className="block mb-2">Số lượng bàn</label>
                                        <input
                                            type="number"
                                            placeholder="Số lượng bàn"
                                            value={numberTables}
                                            onChange={(e) => setNumberTables(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>}
                                   {!isCreateArea && <div className="mb-4">
                                        <label className="block mb-2">Loại bàn</label>
                                        
                                        <select 
                                            id="countries" 
                                            value={currentTypeTable}
                                            onChange={e => setCurrentTypeTable(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            {typeTableList?.map((table, index) =>
                                                <option value={table?.id} key={index}>{table?.name}</option>
                                            )}
                                        </select>

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
                                            className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300"
                                        >
                                            Thêm 
                                        </button>
                                    </div>
                                </div>
                            </div>
                            : ''}
                        <div className="flex justify-center my-10">
                            <div
                                ref={drop}
                                className="relative bg-white border-2 border-gray-300 rounded-lg shadow-lg"
                                style={{ width: "90%", height: "600px" }}
                            >
                                {board?.map((picture, index) => (
                                    <Table
                                        url={picture?.tableType.imageUrl}
                                        id={picture?.id}
                                        key={index}
                                        positionX={picture?.positionX}
                                        positionY={picture?.positionY}
                                        name={picture?.name}
                                    />
                                ))}
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
    );
};

export default Map;
