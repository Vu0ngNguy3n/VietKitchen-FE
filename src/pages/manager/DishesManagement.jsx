import SidebarManager from "../../components/managerComponent/SidebarManager"
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard"
import { IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useUser } from "../../utils/constant";
import { toast } from "react-toastify";
import {formatVND} from "../../utils/format"
import { FaEdit, FaEye, FaSearch } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { NumericFormat } from "react-number-format";
import _ from "lodash";
import Pagination from "../../components/component/Pagination/Pagination";


function DishesManagement() {

    const [dishesList, setDishesList] = useState([]);
    const [dishesListDisplay, setDishesListDisplay] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [unitsList, setUnitsList] = useState([]);
    const [currentUnit, setCurrentUnit] = useState();
    const [userStorage, setUserStorage] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState();
    const [dishName, setDishName] = useState();
    const [weight, setWeight] = useState('');
    const [description, setDescription] = useState();
    const [price, setPrice] = useState(100000);
    const [isOpenHidePopUp, setIsOpenHidePopUp] = useState(false);
    const [isReRender, setIsReRender] = useState(false);
    const [hideDish, setHideDish] = useState();
    const [statusDish, setStatusDish] = useState("true");
    const [imgDishCreate, setImgDishCreate] = useState()
    const [isFile, setIsFile] = useState();
    const [showImgUpload, setShowImgUpload] = useState();
    const [search, setSearch] = useState('');
    const [isOpenShow, setIsOpenShow] = useState(false);
    const [currentDish, setCurrentDish] = useState(); 
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [dishIdEdit, setDishIdEdit] = useState();
    const [currentImgEdit, setCurrentImgEdit] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalDishes, setTotalDishes] = useState();
    const [isSearch, setIsSearch] = useState(false);
    const user = useUser();
    

    useEffect(() => {
        setUserStorage(user);
        axiosInstance
        .get(`/api/dish/restaurant/${user.restaurantId}/${statusDish}`,{
            params: {
                page: currentPage,
                size: size,
                query: ''
            },
        })
        .then(res => {
            const data = res.data.result;
            setTotalDishes(data.totalItems)
            setDishesList(data.results);
            setDishesListDisplay(data.results);
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
        .get(`/api/dish-category/${user.restaurantId}`)
        .then(res =>{ 
            const data = res.data.result;
            setCategoryList(data);
            if(data?.length > 0){
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
        axiosInstance
        .get(`/api/dish/restaurant/${user.restaurantId}/${statusDish}`,{
            params: {
                page: currentPage,
                size: size,
                query: ''
            },
        })
        .then(res => {
            const data = res.data.result;
            setDishesList(data.results);
            setDishesListDisplay(data.results);
            setTotalDishes(data.totalItems)
            
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
    },[isReRender])

    useEffect(() => {
        setSearch('');
        setCurrentPage(1);
        axiosInstance
        .get(`/api/dish/restaurant/${user.restaurantId}/${statusDish}`,{
            params: {
                page: 1,
                size: size,
                query: ''
            },
        })
        .then(res => {
            const data = res.data.result;
            setDishesList(data.results);
            setDishesListDisplay(data.results);
            setTotalDishes(data.totalItems)
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
    },[statusDish])

    const handleDebouncedChange = useCallback(
        _.debounce((value) => {
            setIsSearch(prev => !prev);
        }, 500),
        []
    )

    useEffect(() => {
        handleDebouncedChange(search)

        return () => {
            handleDebouncedChange.cancel();
        }
    },[search])

    useEffect(() => {

        axiosInstance
        .get(`/api/dish/restaurant/${user.restaurantId}/${statusDish}`,{
            params: {
                page: 1,
                size: size,
                query: search
            },
        })
        .then(res => {
            const data = res.data.result;
            console.log(data);
            setDishesList(data.results);
            setDishesListDisplay(data.results);
            setTotalDishes(data.results.length)
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
    },[isSearch])

    useEffect(() => {
        axiosInstance
        .get(`/api/dish/restaurant/${user.restaurantId}/${statusDish}`,{
            params: {
                page: currentPage,
                size: size,
                query: search
            },
        })
        .then(res => {
            const data = res.data.result;
            setDishesList(data.results);
            setDishesListDisplay(data.results);
            setTotalDishes(data.totalItems)
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

    },[currentPage])

    const handleClick = (page) => {
        if(page > 0 && page <= (totalDishes / 10 + 1)){
            setCurrentPage(page);
        }

    };


    const handleOpenPopUp = () => {
        setIsOpen(true);
        if(categoryList.length === 0){
            toast.warn("Bạn hãy tạo loại món ăn để tạo gói")
        }
    }

    const handleClosePouUp = () => {
        setIsOpen(false);
        setDishName('');
        setWeight('');
        setDescription('');
        setPrice(100000);
        setImgDishCreate('');
        setCurrentCategory(categoryList[0]?.id);
        setCurrentUnit(unitsList[0]?.id)
        setShowImgUpload();
    } 

  

    const handleCreateDish = () => {
        if(unitsList?.length === 0){
            toast.warn("Hãy tạo đơn vị tính cho món ăn")
            return
        }
        if(categoryList?.length === 0){
            toast.warn('Hãy tạo loại món ăn')
        }else if(dishName === '' || description === '' || (price/1 <=0 || isNaN(price)) || imgDishCreate === '' || !imgDishCreate){
            toast.warn("Thông tin món ăn không được để trống")
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
                        // accountId: userStorage.accountId
                        restaurantId: user?.restaurantId
                    }

                    axiosInstance
                    .post(`/api/dish/create`, resultDish)
                    .then(res => {
                        toast.success(`Tạo món ăn ${dishName} thành công!`)
                        setIsReRender(!isReRender)
                        setShowImgUpload('')
                        setImgDishCreate('');
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
            toast.success(`${statusDish === true ? "Ẩn" : "Hiện"} món ăn ${hideDish?.name} thành công`)
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

         if(fileImg?.type === 'image/jpeg' || fileImg?.type === 'image/png'){
            fileImg.preview = URL.createObjectURL(fileImg)
            setIsFile(true)
            setShowImgUpload(fileImg)
        }else{
            setIsFile(false)
            toast.error("File is not a image!")
        }


            
    }

    const handleChangeWeight = (value) => {
         if(value >= 0){
            setWeight(value);
         }
    }

    // useEffect(() => {
    //     const newListDishes = dishesList?.filter(d => (d?.code.includes(search.toLowerCase()) || d?.name.toLowerCase().includes(search.trim().toLowerCase())))
    //     setDishesListDisplay(newListDishes)
    // },[search])

    const handleChangePrice = (price) => {
        if(!isNaN(price) ){
            const numericValue = price.replace(/[^0-9]/g, '');
            const numericValueAsNumber = Number(numericValue);
            if (numericValueAsNumber > 0 && Number.isSafeInteger(numericValueAsNumber)) {
                setPrice(numericValue);
            }
        }
    }

    const handleOpenShow = (dish) => {
        setCurrentDish(dish)
        setIsOpenShow(true);
    }

    const handleCloseShow = () => {
        setIsOpenShow(false)
    }

    const handleOpenEdit = (dish) =>{
        setIsOpenEdit(true)
        setDishName(dish?.name);
        setWeight(dish?.weight);
        setStatusDish(dish?.status);
        setDescription(dish?.description);
        setPrice(dish?.price);
        setCurrentCategory(dish?.dishCategory?.id);
        setCurrentUnit(dish?.unit?.id)
        setDishIdEdit(dish?.id)
        setCurrentImgEdit(dish?.imageUrl)
    }

    const handleCloseEdit = () => {
        setIsOpenEdit(false);
        setDishName('');
        setWeight('');
        setDescription('');
        setPrice('');
        setCurrentCategory('');
        setImgDishCreate('');
        setCurrentUnit('')
        setDishIdEdit('')
    }

    const handleSubmitEdit = () => {
       
        if(unitsList?.length === 0){
            toast.warn("Hãy tạo đơn vị tính cho món ăn")
            return
        }
        if(categoryList?.length === 0){
            toast.warn('Hãy tạo loại món ăn')
        }else if(dishName === '' || weight === '' || description === '' || (price/1 <=0 || isNaN(price)) || imgDishCreate === '' || !imgDishCreate){
            toast.warn("Thông tin món ăn không được để trống")
        }else{
            if(imgDishCreate !== ''){
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

                        const request = {
                            name: dishName,
                            weight: weight,
                            status: statusDish,
                            description: description,
                            price: price,
                            dishCategoryId: currentCategory,
                            imageUrl: data.url ,
                            unitId: currentUnit
                        }
                    
                        
                        axiosInstance
                        .put(`/api/dish/${dishIdEdit}`, request)
                        .then(res => {
                            handleCloseEdit();
                            toast.success("Cập nhật thông tin món ăn thành công")
                            setIsReRender(!isReRender)
                            setShowImgUpload('')
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
            }else{
                const request = {
                    name: dishName,
                    weight: weight,
                    status: statusDish,
                    description: description,
                    price: price,
                    dishCategoryId: currentCategory,
                    imageUrl: currentImgEdit ,
                    unitId: currentUnit
                }
            
                
                axiosInstance
                .put(`/api/dish/${dishIdEdit}`, request)
                .then(res => {
                    handleCloseEdit();
                    toast.success("Cập nhật thông tin món ăn thành công")
                    setIsReRender(!isReRender)
                    setShowImgUpload('')
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

    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-white p-10 shadow mt-2 ">
                        <h1 className="font-black text-3xl mb-4">Quản lý món ăn</h1>
                        <div className="flex justify-between">
                            <div className="">
                                <div className="relative grow rounded-md border-2 border-gray-300">
                                    <FaSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 pl-10 outline-none italic "
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Nhập tên món ăn"
                                    />
                                </div>
                            </div>

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
                                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
                                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl z-50 overflow-y-auto max-h-screen">
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-4">
                                        <div className="flex items-center justify-between  border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Thêm món ăn
                                            </h3>
                                            <button type="button"  onClick={handleClosePouUp}  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                        </div>
                                        <from className="p-4 md:p-5">
                                            <div className="grid gap-4 mb-4 grid-cols-2">
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên món ăn <span className="text-red-600">*</span></label>
                                                    <input type="text" name="name" id="name" 
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Tên món ăn"
                                                    value={dishName}
                                                    onChange={e => setDishName(e.target.value)}/>
                                                </div>
                                                {/* <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Định lượng món ăn <span className="text-red-600">*</span></label>
                                                    
                                                    <NumericFormat type="text" name="weight" id="weight" 
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                    value={weight}
                                                    thousandSeparator=","
                                                    displayType="input"
                                                    placeholder="Định lượng món ăn"
                                                    suffix=" kg"
                                                    onValueChange={(values) => handleChangeWeight(values.value)}/>
                                                </div> */}
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá món ăn <span className="text-red-600">*</span></label>
                                                    <NumericFormat type="text" name="price" id="price" 
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                    value={price}
                                                    thousandSeparator=","
                                                    displayType="input"
                                                    placeholder="Giá món ăn"
                                                    suffix=" VNĐ"
                                                    onValueChange={(values) => handleChangePrice(values.value)}/>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loại đồ ăn  <span className="text-red-600">*</span></label>
                                                    <select id="category" 
                                                    value={currentCategory}
                                                    onChange={e => setCurrentCategory(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    >
                                                        {categoryList?.map((cate, index) => (
                                                            <option value={cate?.id} selected={currentCategory === cate?.id ? true : false} key={index}>{cate?.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="unit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đơn vị tính  <span className="text-red-600">*</span></label>
                                                    <select id="unit" 
                                                        value={currentUnit}
                                                        onChange={e => setCurrentUnit(e.target.value)}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                                        {unitsList?.map((unit, index) => (
                                                            <option value={unit?.id} selected={currentUnit === unit?.id ? true : false} key={index}>{unit?.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="file_input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ảnh món ăn <span className="text-red-600">*</span></label>
                                                    <input
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                    onChange={handleFileUpload}
                                                    id="file_input" 
                                                    type="file"/>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ảnh minh hoạ  <span className="text-red-600">*</span></label>
                                                    
                                                    {showImgUpload ? (
                                                    <img src={showImgUpload.preview} alt='' className="w-[50%] object-cover " />
                                                    ):<img src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" className="w-[50%] object-cover " alt="" />}
                                                </div>
                                                <div className="col-span-2">
                                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Miêu tả món ăn <span className="text-red-600">*</span></label>
                                                    <textarea id="description" rows="4" 
                                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    value={description}
                                                    onChange={e => setDescription(e.target.value)}
                                                    placeholder="Miêu tả món ăn"></textarea>                    
                                                </div>
                                            </div>
                                            <button onClick={() => handleCreateDish()} type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                                Thêm món ăn
                                            </button>
                                        </from>
                                    </div>
                                </div>
                            </div>:""}
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        
                                        <th scope="col" className="px-6 py-3">
                                            Hình ảnh
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tên món ăn
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Giá
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Thông tin
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Hành động
                                        </th>
                                        <th scope="col" className="px-16 py-3">
                                            <span className="sr-only">Hide</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dishesListDisplay?.map((dish, index) => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <img src={dish?.imageUrl} className=" w-16 h-16 object-cover rounded-md" alt={dish?.code} />
                                            </th>
                                            <td className="px-6 py-4">
                                               {dish?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatVND(dish?.price)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => handleOpenShow(dish)}
                                                    className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <a  className="font-medium text-white dark:text-blue-500 hover:underline cursor-pointer">Mô tả</a>
                                                </button>
                                                
                                            </td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => handleOpenEdit(dish)}
                                                    className="py-2 px-5 bg-blue-500 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <a className="font-medium text-white dark:text-blue-500 hover:underline cursor-pointer" >Cập nhật</a>
                                                </button>
                                                
                                            </td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => handleOpenHidePopUp(dish)}
                                                    className="py-2 px-5 bg-red-400 font-semibold text-white rounded hover:bg-primary transition-all duration-300 flex items-center">
                                                    <a className="font-medium text-white dark:text-blue-500 hover:underline cursor-pointer" >{statusDish === 'true'? 'Ẩn' : 'Hiện'}</a>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {dishesListDisplay?.length === 0 && (
                                        <tr classNameName="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-6 py-4">
                                            </td>
                                            <td classNameName="px-6 py-4 text-red-500">
                                                Không tìm thấy thông tin món ăn tương ứng
                                            </td>
                                            <td classNameName="px-6 p-4"></td>
                                            <td classNameName="px-6 p-4"></td>
                                            <td classNameName="px-6 p-4"></td>
                                            <td classNameName="px-6 p-4"></td>
                                        </tr>
                                    )}
                                   
                                </tbody>
                            </table>
                            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Hiển thị <span className="font-semibold text-gray-900 dark:text-white">{1 + 10*(currentPage-1)}-{10 + 10*(currentPage-1)}</span> trong <span className="font-semibold text-gray-900 dark:text-white">{totalDishes} </span>món ăn</span>
                                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                                    <li onClick={() => handleClick(currentPage-1)}>
                                        <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Trước</a>
                                    </li>
                                    {Array.from({ length: totalDishes/10+1 }).map((_, index) => (
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
                            {/* <Pagination totalPages={2} onChange={setCurrentPage}/> */}
                        </div>
                        
                    </div>
                </div>

                {isOpenEdit && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl z-50 overflow-y-auto max-h-screen">
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-4">
                                        <div className="flex items-center justify-between  border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Chỉnh sửa món ăn
                                            </h3>
                                            <button type="button"  onClick={handleCloseEdit}  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                        </div>
                                        <from className="p-4 md:p-5">
                                            <div className="grid gap-4 mb-4 grid-cols-2">
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên món ăn <span className="text-red-600">*</span></label>
                                                    <input type="text" name="name" id="name" 
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Tên món ăn"
                                                    value={dishName}
                                                    onChange={e => setDishName(e.target.value)}/>
                                                </div>
                                                {/* <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Định lượng món ăn<span className="text-red-600">*</span></label>
                                                    <input type="text"  id="weight" 
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                    placeholder="Định lượng món ăn"
                                                    value={weight}
                                                    onChange={e => handleChangeWeight(e.target.value)}/>
                                                </div> */}
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá món ăn <span className="text-red-600">*</span></label>
                                                    <NumericFormat type="text" name="price" id="price" 
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                    value={price}
                                                    thousandSeparator=","
                                                    displayType="input"
                                                    placeholder="Giá món ăn"
                                                    suffix=" VNĐ"
                                                    onValueChange={(values) => handleChangePrice(values.value)}/>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loại đồ ăn  <span className="text-red-600">*</span></label>
                                                    <select id="category" 
                                                    value={currentCategory}
                                                    onChange={e => setCurrentCategory(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    >
                                                        {categoryList?.map((cate, index) => (
                                                            <option value={cate?.id} selected={currentCategory === cate?.id ? true : false} key={index}>{cate?.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="unit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đơn vị tính  <span className="text-red-600">*</span></label>
                                                    <select id="unit" 
                                                        value={currentUnit}
                                                        onChange={e => setCurrentUnit(e.target.value)}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                                        {unitsList?.map((unit, index) => (
                                                            <option value={unit?.id} selected={currentUnit === unit?.id ? true : false} key={index}>{unit?.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="file_input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ảnh món ăn <span className="text-red-600">*</span></label>
                                                    <input
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                    onChange={handleFileUpload}
                                                    id="file_input" 
                                                    type="file"/>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ảnh minh hoạ  <span className="text-red-600">*</span></label>
                                                    
                                                    {showImgUpload ? (
                                                    <img src={showImgUpload?.preview} alt='' className="w-[50%] object-cover " />
                                                    ):<img src={currentImgEdit} className="w-[50%] object-cover " alt="" />}
                                                </div>
                                                <div className="col-span-2">
                                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Miêu tả món ăn <span className="text-red-600">*</span></label>
                                                    <textarea id="description" rows="4" 
                                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    value={description}
                                                    onChange={e => setDescription(e.target.value)}
                                                    placeholder="Miêu tả món ăn"></textarea>                    
                                                </div>
                                            </div>
                                            <button onClick={() => handleSubmitEdit()} type="submit" class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                {/* <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg> */}
                                                    Lưu
                                            </button>
                                        </from>
                                    </div>
                                </div>
                            </div>
                )}

                {isOpenShow && (
                    <div id="crud-modal" tabindex="-1" aria-hidden="true" className=" fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="relative p-4 w-full max-w-xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Thông tin món ăn
                                    </h3>
                                    <button type="button" onClick={() => handleCloseShow()} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <form className="p-4 md:p-5">
                                    <div className="grid gap-4 mb-4 grid-cols-2">
                                        <div className="col-span-2">
                                            <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên món ăn</label>
                                            <input
                                                type="text" 
                                                name="name" id="name" 
                                                disabled
                                                value={currentDish?.name}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                placeholder="Tên món ăn" required=""/>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá món ăn</label>
                                            <input 
                                                type="text" name="price" 
                                                value={currentDish?.price}
                                                disabled
                                                id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                placeholder="$2999" required=""/>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label for="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Định lượng món ăn</label>
                                            <input 
                                                type="text" name="weight" id="weight" 
                                                value={currentDish?.weight}
                                                disabled
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                placeholder="0.4" required=""/>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label for="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loại món ăn</label>
                                            <input 
                                                type="text" name="category" id="category" 
                                                value={currentDish?.dishCategory?.name}
                                                disabled
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                placeholder="$2999" required=""/>
                                            
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label for="unit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đơn vị tính</label>
                                            <input 
                                                type="text" name="unit" id="unit"
                                                disabled
                                                value={currentDish?.unit?.name}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                placeholder="$2999" required=""/>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label for="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ảnh món ăn</label>
                                            <img src={currentDish?.imageUrl} alt="" />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label for="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Miêu tả món ăn</label>
                                            <textarea 
                                                id="description" rows="4" 
                                                disabled
                                                value={currentDish?.description}
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                placeholder="Write product description here"></textarea>                    
                                        </div>
                                    </div>
                                    <button  onClick={() => handleCloseShow()} className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <IoMdArrowRoundBack className="mr-2"/>
                                        Quay lại
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div> 
                )}


            </div>
        </div>
    )
}

export default DishesManagement
