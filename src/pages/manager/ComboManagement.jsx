import SidebarManager from "../../components/managerComponent/SidebarManager";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import { IoMdAdd } from "react-icons/io";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { useUser } from "../../utils/constant";
import { toast } from "react-toastify";

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
            setComboPrice(price)
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
                    comboName,
                    comboPrice,
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
            comboName,
            comboPrice,
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
            toast.success("Upload image successfully!");
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
        setIsUpdateMode(true);
        setCurrentCombo(combo);
        setComboName(combo.comboName);
        setComboPrice(combo.comboPrice);
        setDescription(combo.description);
        setSelectedDishes(combo.dishes || []);
        setShowImgUpload(combo.imageUrl);
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
                                        <th scope="col" className="px-16 py-3">
                                            <span className="sr-only">Image</span>
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Product
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comboList?.map(combo => (
                                        <tr key={combo?.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="p-4">
                                                <img src={combo?.imageUrl} alt={combo?.comboName} className="w-16 h-16 object-cover rounded-md" />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {combo?.comboName}
                                            </td>
                                            <td className="px-6 py-4">
                                                {combo?.comboPrice}
                                            </td>
                                            <td className="px-6 py-4">
                                                {combo?.description}
                                            </td>
                                            <td className="px-6 py-4 flex space-x-2 ">
                                                <button
                                                    className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                    onClick={() => handleEditCombo(combo)}
                                                >
                                                    <FaEdit className="mr-1" />
                                                    Cập nhật
                                                </button>
                                                <button
                                                    className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
                                                >
                                                    <FaTrash className="mr-1" />
                                                    Xóa
                                                </button>
                                                <button
                                                    className="py-2 px-5 bg-green-600 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center"
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
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-4">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                            onClick={handleClosePopUp}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-2">{isUpdateMode ? 'Cập nhật Combo' : 'Thêm Combo'}</h2>
                        <div className="mb-2">
                            <label htmlFor="combo-name" className="block mb-2">
                                Tên Combo <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="combo-name"
                                type="text"
                                placeholder="Tên Combo"
                                value={comboName}
                                onChange={e => setComboName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="combo-price" className="block mb-2">
                                Giá Combo <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="combo-price"
                                type="text"
                                placeholder="Giá Combo"
                                value={comboPrice}
                                onChange={e => handleChangePrice(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="combo-description" className="block mb-2">
                                Miêu tả Combo <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="combo-description"
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Miêu tả Combo"
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-2 flex">
                            <div className="w-full">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Ảnh Combo 
                                </label>
                                <input
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 
                                    focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    onChange={handleFileUpload}
                                    id="file_input"
                                    type="file"
                                />
                            </div>
                        </div>
                        {showImgUpload && (
                            <div className="mb-2">
                                <img src={showImgUpload} alt="Combo preview" className="w-full h-40 object-cover rounded-md" />
                            </div>
                        )}
                        <div className="mb-2">
                            <label htmlFor="combo-dishes" className="block mb-2">
                                Chọn món ăn <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="combo-dishes"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={e => {
                                    const selectedDish = dishesList.find(dish => dish.id === +e.target.value);
                                    if (selectedDish) {
                                        handleSelectDish(selectedDish);
                                    }
                                }}
                            >
                                <option value="">Chọn món ăn</option>
                                {dishesList?.map(dish => (
                                    <option key={dish.id} value={dish.id}>
                                        {dish.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2">
                            <h3 className="block mb-2">Món ăn đã chọn</h3>
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
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleClosePopUp}
                                className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={isUpdateMode ? handleUpdateCombo : handleCreateCombo}
                                className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300"
                            >
                                {isUpdateMode ? 'Cập nhật' : 'Thêm'}
                            </button>
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
                        <h2 className="text-xl font-semibold mb-4">{comboDetail.comboName}</h2>
                        <img src={comboDetail.imageUrl} alt={comboDetail.comboName} className="w-full h-40 object-cover rounded-md mb-4" />
                        <p className="mb-2"><strong>Giá:</strong> {comboDetail.comboPrice}</p>
                        <p className="mb-4"><strong>Miêu tả:</strong> {comboDetail.description}</p>
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
                                            <img src={dish.imageUrl} alt={dish.name} className="w-10 h-10 object-cover rounded-md" />
                                        </td>
                                        <td className="px-4 py-2">{dish.name}</td>
                                        <td className="px-4 py-2">{dish.description}</td>
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
