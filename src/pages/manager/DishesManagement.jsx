import SidebarManager from "../../components/managerComponent/SidebarManager"
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard"
import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { getUser } from "../../utils/constant";
import { toast } from "react-toastify";
import {formatVND} from "../../utils/format"


function DishesManagement() {

    const [dishesList, setDishesList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [unitsList, setUnitsList] = useState([]);
    const [currentUnit, setCurrentUnit] = useState();
    const [userStorage, setUserStorage] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState();
    const [dishName, setDishName] = useState();
    const [weight, setWeight] = useState();
    const [description, setDescription] = useState();
    const [price, setPrice] = useState();
    const [isOpenHidePopUp, setIsOpenHidePopUp] = useState(false);
    const [isReRender, setIsReRender] = useState(false);
    const [hideDish, setHideDish] = useState();
    const [statusDish, setStatusDish] = useState("true");
    const [imgDishCreate, setImgDishCreate] = useState()
    const [isFile, setIsFile] = useState();
    const [showImgUpload, setShowImgUpload] = useState();
    

    useEffect(() => {
        const user = getUser();
        setUserStorage(user);
        axiosInstance
        .get(`/api/dish/account/${user.accountId}/${statusDish}`)
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
                })

        axiosInstance
        .get(`/api/dish-category/${user.accountId}`)
        .then(res =>{ 
            const data = res.data.result;
            setCategoryList(data);
            if(data.length > 0){
                setCurrentCategory(data[0]?.id);
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

        axiosInstance
        .get(`/api/unit/account/${user.accountId}`)
        .then(res => {
            const data = res.data.result;
            if(data.length > 0){
                setCurrentUnit(data[0]?.id)
            }
            setUnitsList(data)
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
        const user = getUser();
        setUserStorage(user);
        axiosInstance
        .get(`/api/dish/account/${user.accountId}/${statusDish}`)
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
                })
    },[isReRender, statusDish])


    const handleOpenPopUp = () => {
        setIsOpen(true);
    }

    const handleClosePouUp = () => {
        setIsOpen(false);
        setDishName('');
        setWeight('');
        setDescription('');
        setPrice(0);
        setImgDishCreate('');
        setCurrentCategory(categoryList[0]?.id);
        setCurrentUnit(unitsList[0]?.id)
    } 

  

    const handleCreateDish = () => {
        if(dishName === '' || weight === '' || description === '' || price === '' || imgDishCreate === '' || !imgDishCreate){
            toast.warn("Vui lòng điền đầy đủ thông tin")
        }else{
            const data = new FormData();
            data.append("file",imgDishCreate);
            data.append("upload_preset", "seafood");
            data.append("cloud_name", "dggciohw8");  
            fetch("https://api.cloudinary.com/v1_1/dggciohw8/image/upload", {
                    method: "post",
                    body: data,
                })
                .then((res) => res.json())
                .then((data) => {
                     const resultDish = {
                        name: dishName,
                        weight: weight,
                        status: true,
                        description: description,
                        price: price,
                        dishCategoryId: currentCategory,
                        imageUrl: data.url,
                        unitId: currentUnit,
                        accountId: userStorage.accountId
                    }

                    axiosInstance
                    .post(`/api/dish/create`, resultDish)
                    .then(res => {
                        toast.success(`Tạo món ăn ${dishName} thành công!`)
                        setIsReRender(!isReRender)
                        handleClosePouUp();
                        setCurrentCategory(categoryList[0]?.id)
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
            })
             .catch(err => console.log(err + "Can not comment"))
            

            
        }
    }

    const handleOpenHidePopUp = (dish) => {
        setIsOpenHidePopUp(true);
        setHideDish(dish);
    }

    const handleCloseHidePopUp =() => {
        setIsOpenHidePopUp(false);
    }

    const handleSubmitHideDish = () => {
        const result = {
            name: hideDish?.name,
            weight: hideDish?.weight,
            status: statusDish === 'true' ? false : true,
            description: hideDish?.description,
            price: hideDish?.price,
            dishCategoryId: hideDish?.dishCategory?.id,
            imageUrl: hideDish?.imageUrl,
            unitId: hideDish?.unit?.id
        }
        axiosInstance
        .put(`/api/dish/${+hideDish?.id}`, result)
        .then(res => {
            toast.success(`Ẩn món ăn ${hideDish?.name} thành công`)
            setHideDish();
            setIsReRender(!isReRender)
            handleCloseHidePopUp();
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

     const handleFileUpload =(e) => {
        setImgDishCreate(e.target.files[0])

         const fileImg = e.target.files[0];

         if(fileImg.type === 'image/jpeg' || fileImg.type === 'image/png'){
             toast.success("Upload image successfully!")
            fileImg.preview = URL.createObjectURL(fileImg)
            setIsFile(true)
            setShowImgUpload(fileImg)
        }else{
            setIsFile(false)
            toast.error("File is not a image!")
        }


            
    }



    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                        <div className="flex justify-between">
                            <h1 className="font-black text-3xl">Quản lý món ăn</h1>
                            <div className="flex items-center">
                                <form class="max-w-sm mr-4 ">
                                    <select
                                        id="countries"
                                        value={statusDish}
                                        onChange={e => setStatusDish(e.target.value)}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                        focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                                        outline-none px-4 py-3 cursor-pointer">
                                        <option  value={"true"}>Món ăn không bị ẩn</option>
                                        <option value={'false'}>Món ăn bị ẩn</option>
                                    </select>
                                </form>
                                <button
                                onClick={() => handleOpenPopUp()} 
                                className="py-2 px-3 bg-secondary font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                <IoMdAdd />Thêm món ăn
                            </button>
                               
                            </div>
                            

                        </div>

                        {isOpenHidePopUp?(
                        <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                                <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                                    <button type="button" onClick={handleCloseHidePopUp} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-4 md:p-5 text-center">
                                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        </svg>
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muôn {statusDish === "true" ? 'ẩn' : 'hiện'} món ăn {dishName}?</h3>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={() => handleSubmitHideDish()}
                                            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                            Có
                                        </button>
                                        <button 
                                            data-modal-hide="popup-modal" 
                                            type="button" 
                                            onClick={handleCloseHidePopUp}
                                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            Không
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : ''}

                        {isOpen?<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                                        onClick={handleClosePouUp}
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl font-semibold mb-2">
                                        Thêm món ăn
                                    </h2>
                                    <div className="mb-2">
                                        <label htmlFor="dish-name" className="block mb-2">Tên món ăn</label>
                                        <input  
                                            id="dish-name"
                                            type="text"
                                            placeholder="Tên món ăn"
                                            value={dishName}
                                            onChange={e => setDishName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="dish-weight" className="block mb-2">Định lượng món ăn</label>
                                        <input
                                            id="dish-weight"
                                            type="text"
                                            placeholder="Định lượng món ăn (kg)"
                                            value={weight}
                                            onChange={e => setWeight(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="dish-description" className="block mb-2">Miêu tả món ăn</label>
                                        <input
                                            id="dish-description"
                                            type="text"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            placeholder="Miêu tả món ăn"
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="dish-price" className="block mb-2">Giá món ăn</label>
                                        <input
                                            id="dish-price"
                                            type="number"
                                            placeholder="Giá món ăn"
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>

                                    <div className="mb-2 flex" >
                                        <div className={`${showImgUpload ? 'w-[50%]' : 'w-full'}`}>
                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Ảnh món ăn</label>
                                            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 
                                            focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                                            onChange={handleFileUpload}
                                            id="file_input" 
                                            type="file"/>
                                        </div>
                                        {showImgUpload && (
                                            <img src={showImgUpload.preview} alt='' width={"50%"}/>
                                        )}
                                    </div>
                                    
                                    <div className="mb-2">
                                        <label htmlFor="dish-type" className="block mb-2">Loại thức ăn</label>
                                        
                                        <select 
                                            id="dish-type" 
                                            value={currentCategory}
                                            onChange={e => setCurrentCategory(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                {categoryList?.map((cate, index) => (
                                                    <option value={cate?.id} selected={currentCategory === cate?.id ? true : false} key={index}>{cate?.name}</option>
                                                ))}
                                        </select>

                                    </div>

                                    <div className="mb-2">
                                        <label htmlFor="dish-unit" className="block mb-2">Đơn vị tính</label>
                                        
                                        <select 
                                            id="dish-unit" 
                                            value={currentUnit}
                                            onChange={e => setCurrentUnit(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                {unitsList?.map((unit, index) => (
                                                    <option value={unit?.id} selected={currentUnit === unit?.id ? true : false} key={index}>{unit?.name}</option>
                                                ))}
                                        </select>

                                    </div>
                                   
                                    
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={handleClosePouUp}
                                            className="py-2 px-5 bg-red-600 font-semibold text-white rounded hover:bg-red-700 transition-all duration-300"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={handleCreateDish}
                                            className="py-2 px-5 bg-lgreen font-semibold text-white rounded hover:bg-green transition-all duration-300"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                </div>
                            </div>:""}
                        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" class="px-16 py-3">
                                            <span class="sr-only">Image</span>
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Tên món ăn
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Giá
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dishesList?.map((dish, index) => (
                                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                            <td class="p-4">
                                                <img src={dish?.imageUrl} class="w-16 md:w-32 max-w-full max-h-full" alt={dish?.code} />
                                            </td>
                                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                {dish?.name}
                                            </td>
                                            {/* <td class="px-6 py-4">
                                                <div class="flex items-center">
                                                    <button class="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                                                        <span class="sr-only">Quantity button</span>
                                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                                                        </svg>
                                                    </button>
                                                    <div>
                                                        <input type="number" id="first_product" class="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" required />
                                                    </div>
                                                    <button class="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                                                        <span class="sr-only">Quantity button</span>
                                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td> */}
                                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                {formatVND(dish?.price)}
                                            </td>
                                            <td class="px-6 py-4">
                                                <a onClick={() => handleOpenHidePopUp(dish)} class="font-medium text-red-600 dark:text-red-500 hover:underline">{statusDish === 'true'? 'Ẩn' : 'Hiện'}</a>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default DishesManagement
