import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { IoMdAdd } from "react-icons/io";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import {formatVND} from "../../utils/format"
import { useUser } from "../../utils/constant";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";

function ComboManagement() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [currentCombo, setCurrentCombo] = useState(null);
    const [comboName, setComboName] = useState('');
    const [comboPrice, setComboPrice] = useState(100000);
    const [description, setDescription] = useState('');
    const [imgComboCreate, setImgComboCreate] = useState(null);
    const [dishesList, setDishesList] = useState([]);
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [showImgUpload, setShowImgUpload] = useState(null);
    const [userStorage, setUserStorage] = useState(null);
    const [comboList, setComboList] = useState([]);
    const [comboDetail, setComboDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const user = useUser();

    useEffect(() => {
        setUserStorage(user);
        axiosInstance
            .get(`/api/dish/account/${user.accountId}/true`)
            .then(res => {
                const data = res.data.result;
                setDishesList(data);
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
            });

        axiosInstance
            .get(`/api/combos/getAllCombos`)
            .then(res => {
                setComboList(res.data);
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
            });
    }, []);

    const handleOpenPopUp = () => {
        setIsOpen(true);
        setIsUpdateMode(false);
    };

    const handleClosePopUp = () => {
        setIsOpen(false);
        setComboName('');
        setComboPrice(100000);
        setDescription('');
        setImgComboCreate(null);
        setShowImgUpload(null);
        setSelectedDishes([]);
        setCurrentCombo(null);
    };
    const handleChangePrice = (price) => {
        if(!isNaN(price) && price > 0){
             const numericValue = price.replace(/[^0-9]/g, '');
            setComboPrice(numericValue);
        }
    }

    const handleCreateCombo = () => {
        if (comboName === '' || comboPrice === 0 || description === '' ) {
            toast.warn("Vui lòng điền đầy đủ thông tin");
            return;
        }
        if(!imgComboCreate){
            toast.warn("Ảnh của combo không được để trống");
            return
        }
        if(selectedDishes.length === 0){
            toast.warn("Món ăn của combo không dược để trống");
        }
        
        const data = new FormData();
        data.append("file", imgComboCreate);
        data.append("upload_preset", "seafood");
        data.append("cloud_name", "dggciohw8");

        fetch("https://api.cloudinary.com/v1_1/dggciohw8/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                const resultCombo = {
                    name: comboName,
                    price: comboPrice,
                    description,
                    imageUrl: data.url,
                    status: true,
                    dishIds: selectedDishes.map(dish => dish.id),
                    accountId: userStorage.accountId
                };

                axiosInstance
                    .post(`/api/combos`, resultCombo)
                    .then(res => {
                        toast.success(`Tạo combo ${comboName} thành công!`);
                        axiosInstance
                            .get(`/api/combos/getAllCombos`)
                            .then(res => {
                                setComboList(res.data);
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
                            });
                        handleClosePopUp();
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
                    });
            })
            .catch(err => console.log(err + "Can not upload image"));
        

        
    };

    const handleUpdateCombo = () => {
        if (comboName === '' || comboPrice === 0 || description === '' ) {
            toast.warn("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if(selectedDishes.length === 0){
            toast.warn("Vui lòng chọn món ăn trong combo")
            return
        }


        const updatedCombo = {
            id: currentCombo.id,
            name: comboName,
            price: comboPrice,
            description,
            status: true,
            dishIds: selectedDishes.map(dish => dish.id)
        };

        if (imgComboCreate) {
            const data = new FormData();
            data.append("file", imgComboCreate);
            data.append("upload_preset", "seafood");
            data.append("cloud_name", "dggciohw8");

            fetch("https://api.cloudinary.com/v1_1/dggciohw8/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    updatedCombo.imageUrl = data.url;

                    axiosInstance
                        .put(`/api/combos/update/${currentCombo.id}`, updatedCombo)
                        .then(res => {
                            toast.success(`Cập nhật combo ${comboName} thành công!`);
                            const updatedComboList = comboList.map(combo =>
                                combo.id === currentCombo.id ? res.data.result : combo
                            );
                            setComboList(updatedComboList);
                            handleClosePopUp();
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
                        });
                })
                .catch(err => console.log(err + "Can not upload image"));
        } else {
            axiosInstance
                .put(`/api/combos/update/${currentCombo.id}`, updatedCombo)
                .then(res => {
                    toast.success(`Cập nhật combo ${comboName} thành công!`);
                    const updatedComboList = comboList.map(combo =>
                        combo.id === currentCombo.id ? res.data.result : combo
                    );
                    setComboList(updatedComboList);
                    handleClosePopUp();
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
                });
        }
    };

    const handleFileUpload = (e) => {
        const fileImg = e.target.files[0];
        setImgComboCreate(fileImg);

        if (fileImg.type === 'image/jpeg' || fileImg.type === 'image/png') {
            fileImg.preview = URL.createObjectURL(fileImg);
            setShowImgUpload(fileImg.preview);
        } else {
            toast.error("File is not a valid image!");
        }
    };

    const handleSelectDish = (dish) => {
        if (!selectedDishes.some(selectedDish => selectedDish.id === dish.id)) {
            setSelectedDishes([...selectedDishes, dish]);
        }
    };

    const handleRemoveDish = (dish) => {
        setSelectedDishes(selectedDishes.filter(item => item.id !== dish.id));
    };

    const handleEditCombo = (combo) => {
        console.log(combo);
        setIsUpdateMode(true);
        setCurrentCombo(combo);
        setComboName(combo?.name);
        setComboPrice(combo?.price);
        setDescription(combo?.description);
        setSelectedDishes(combo?.dishes || []);
        setShowImgUpload(combo?.imageUrl);
        setIsOpen(true);
    };

    const handleViewDetail = (comboId) => {
        axiosInstance
            .get(`/api/combos/getDetail/${comboId}`)
            .then(res => {
                setComboDetail(res.data.result);
                setIsDetailOpen(true);
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
            });
    };

    const handleCloseDetail = () => {
        setIsDetailOpen(false);
        setComboDetail(null);
    };

    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                        <div className="flex justify-between">
                            <h1 className="font-black text-3xl">Quản lý Combo</h1>
                            <button
                                className="py-2 px-3 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                onClick={handleOpenPopUp}
                            >
                                <IoMdAdd /> Thêm Combo
                            </button>
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-10 py-3">
                                            <span className="sr-only">Image</span>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tên món ăn
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Giá
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Miêu tả
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comboList?.map(combo => (
                                        <tr key={combo?.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="p-4">
                                                <img src={combo?.imageUrl} alt={combo?.name} className="w-16 h-16 object-cover rounded-md" />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {combo?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatVND(combo?.price)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {combo?.description}
                                            </td>
                                            <td className="px-6 py-4 m-auto space-x-2 ">
                                                <button
                                                    className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                    onClick={() => handleEditCombo(combo)}
                                                >
                                                    <FaEdit className="mr-1" />
                                                    Cập nhật
                                                </button>
                                            </td>
                                            {/* <td className="px-6 py-4  space-x-2 ">
                                                <button
                                                    className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                >
                                                    <FaTrash className="mr-1" />
                                                    Xóa
                                                </button>
                                            </td> */}
                                            <td>
                                                <button
                                                    className="py-2 px-5 bg-blue-500 bg-green-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                    onClick={() => handleViewDetail(combo.id)}
                                                >
                                                    <FaEye className="mr-1" />
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl z-50 overflow-y-auto max-h-screen">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-4">
                            <div className="flex items-center justify-between  border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Thêm combo
                                </h3>
                                <button type="button"  onClick={handleClosePopUp}  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <from className="p-4 md:p-5">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên combo <span className="text-red-600">*</span></label>
                                        <input type="text" name="name" id="name" 
                                        value={comboName}
                                        onChange={e => setComboName(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Tên combo"
                                       />
                                    </div>
                                    {/* <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá combo<span className="text-red-600">*</span></label>
                                        <input type="text"  id="weight" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                        placeholder="Giá combo"
                                        />
                                    </div> */}
                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá combo <span className="text-red-600">*</span></label>
                                        <NumericFormat type="text" name="price" id="price" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                        value={comboPrice}
                                        thousandSeparator=","
                                        displayType="input"
                                        placeholder="Giá combo"
                                        suffix=" VNĐ"
                                        onValueChange={(values) => handleChangePrice(values.value)}
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="file_input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ảnh combo <span className="text-red-600">*</span></label>
                                        <input
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                        onChange={handleFileUpload}
                                        id="file_input" 
                                        type="file"/>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ảnh minh hoạ  <span className="text-red-600">*</span></label>
                                        {showImgUpload ? (
                                        <img src={showImgUpload} alt='Ảnh combo' className="w-[50%] object-cover h-[70px]" />
                                        ):<img src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" className="w-[50%] object-cover h-[70px]" alt="" />}
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Miêu tả combo <span className="text-red-600">*</span></label>
                                        <textarea id="description" rows="4" 
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="Miêu tả combo"></textarea>                    
                                    </div>
                                    <div className="col-span-2 ">
                                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chọn món ăn  <span className="text-red-600">*</span></label>
                                        <select id="category" 
                                        onChange={e => {
                                            const selectedDish = dishesList.find(dish => dish.id === +e.target.value);
                                            if (selectedDish) {
                                                handleSelectDish(selectedDish);
                                            }
                                        }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        >
                                            {/* {dishesList?.map(dish => (
                                                <option key={dish.id} value={dish.id}>
                                                    {dish.name}
                                                </option>
                                            ))} */}
                                            {dishesList?.map((dish, index) => (
                                                <option value={dish?.id} key={index}>{dish?.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    
                                    <div className="col-span-2 ">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Món đã chọn  <span className="text-red-600">*</span></label>
                                        <div className="flex flex-wrap">
                                            {selectedDishes?.map(dish => (
                                                <div key={dish.id} className="flex items-center m-1 p-2 border rounded">
                                                    <img src={dish.imageUrl} alt={dish.name} className="w-10 h-10 mr-2" />
                                                    <span>{dish.name}</span>
                                                    <button
                                                        className="ml-2 text-red-500"
                                                        onClick={() => handleRemoveDish(dish)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                </div>
                                <button 
                                     onClick={isUpdateMode ? handleUpdateCombo : handleCreateCombo}
                                    type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                    Thêm combo
                                </button>
                            </from>
                        </div>
                    </div>
                </div>
            )}

            {isDetailOpen && comboDetail && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-4">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                            onClick={handleCloseDetail}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">{comboDetail?.name}</h2>
                        <img src={comboDetail.imageUrl} alt={comboDetail?.name} className="w-full h-40 object-cover rounded-md mb-4" />
                        <p className="mb-2"><strong>Giá:</strong> {formatVND(comboDetail?.price)}</p>
                        <p className="mb-4"><strong>Miêu tả:</strong> {comboDetail?.description}</p>
                        <h3 className="text-lg font-semibold mb-2">Món ăn trong combo:</h3>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-2">Ảnh</th>
                                    <th scope="col" className="px-4 py-2">Tên</th>
                                    <th scope="col" className="px-4 py-2">Mô tả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comboDetail.dishes.map(dish => (
                                    <tr key={dish.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-4 py-2">
                                            <img src={dish?.imageUrl} alt={dish?.name} className="w-10 h-10 object-cover rounded-md" />
                                        </td>
                                        <td className="px-4 py-2">{dish?.name}</td>
                                        <td className="px-4 py-2">{dish?.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ComboManagement;
