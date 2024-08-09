import { useEffect, useState } from "react";
import { BiSolidDish } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import { useUser } from "../../../utils/constant";
import LOGO from "../../../assests/VIET.png"
import { MdTableBar } from "react-icons/md";
import NavBarHostess from "../../../components/staffComponent/NavBarHostess";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { BsFillCaretDownFill } from "react-icons/bs";
import { BsFillCaretUpFill } from "react-icons/bs";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { FaMinus, FaPlus, FaPlusCircle, FaUserCircle } from "react-icons/fa";
import { MdNoteAlt } from "react-icons/md";
import { GiAlarmClock } from "react-icons/gi";
import { GiMoneyStack } from "react-icons/gi";
import { NumericFormat } from 'react-number-format'; 
import { MdLocationSearching } from "react-icons/md";
import { MdOutlineNavigateNext } from "react-icons/md";
import { IoMdArrowBack, IoMdMore } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import {formatVND} from "../../../utils/format"
import { FaCircleCheck } from "react-icons/fa6";



function BookingTable() {

    const [areaList, setAreaList] = useState([])
    const [isOpenBooking, setIsOpenBooking] = useState(false);
    const [time, setTime] = useState('12:00');
    const [pickUpDay, setPickUpDay] = useState("");    
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isOpenChooseTable, setIsOpenChooseTable] = useState(false);
    const [tables, setTables] = useState([]);
    const [deposit, setDeposit] = useState("");
    const [customerName, setCustomerName] = useState('');
    const [numberCustomer, setNumberCustomer] = useState(1);
    const [intendTime, setIntendTime] = useState(60);
    const [note, setNote] = useState('');
    const [currentArea, setCurrentArea] = useState({});
    const [board, setBoard] = useState([]);
    const [listDay, setListDay] = useState([]);
    const [selectDay, setSelectDay] = useState();
    const [listBookingTables, setListBookingTables] = useState([]);
    const [isBooking, setIsBooking] = useState(false);
    const [lateTables, setLateTables] = useState([]);
    const [nearTables, setNearTables] = useState([]);
    const [statusTime, setStatusTime] = useState('week');
    const [isOpenShowInformation, setIsOpenShowInformation] = useState(false);
    const [isCancel, setIsCancel] = useState(false);
    const [scheduleIdCancel, setScheduleIdCancel] = useState('');
    const [isOpenConfirmCancel, setIsOpenConfirmCancel] = useState(false);
    const [allTables, setAllTables] = useState([]);
    const [isOpenConfirmJoin, setIsOpenConfirmJoin] = useState(false);
    const [scheduleIdJoin, setScheduleIdJoin] = useState('');
    const [isOpenChooseDishes, setIsOpenChooseDishes] = useState(false);
    const [listCategories, setListCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState()
    const [listDishes, setListDishes] = useState([]);
    const [dishesChoose, setDishesChoose] = useState([]);
    const [dishesChooseSubmit, setDishesChooseSubmit] = useState([]);
    const user = useUser();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getAllTable = () => {
        axiosInstance
        .get(`/api/schedule/restaurant/${user?.restaurantId}/find-all`)
        .then(res => {
            const data = res.data.result;
            console.log(data);
            setAllTables(data);
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

    const getNearTable = () => {
        axiosInstance
        .get(`/api/schedule/restaurant/${user?.restaurantId}/time/near`)
        .then(res => {
            const data = res.data.result;
            setNearTables(data);
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

    const getListDay = () => {
        axiosInstance
        .get(`/api/schedule/restaurant/${user?.restaurantId}/day`)
        .then(res => {
            const data = res.data.result;
            if(data?.length > 0){
                setSelectDay(data[0]?.date)
                setListDay(data);
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

    const getLateTable = () => {
         axiosInstance
        .get(`/api/schedule/restaurant/${user?.restaurantId}/time/late`)
        .then(res => {
            const data = res.data.result;
            setLateTables(data);
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
        axiosInstance
        .get(`/api/area/${user?.restaurantId}`)
        .then(res =>{ 
            const data =res.data.result;
            if(data?.length > 0){
                setCurrentArea(data[0])
                setAreaList(data)
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
        .get(`/api/dish-category/${user?.accountId}`)
        .then(res => {
            const data = res.data.result;
            if(data?.length > 0){
                setCurrentCategory(data[0])
                setListCategories(data);
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

        
        getListDay()
        
        getAllTable()
        
        getNearTable()

        getLateTable()


        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const formattedDate = tomorrow.toISOString().split('T')[0];
        setPickUpDay(formattedDate)

    },[])

    useEffect(() => {
        if(currentCategory){
            axiosInstance
            .get(`/api/dish/category/${currentCategory?.code}`)
            .then(res => {
                const data = res.data.result;
                setListDishes(data);
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
    }, [currentCategory])

    useEffect(() => {
        if(selectDay){
            axiosInstance
            .get(`/api/schedule/restaurant/${user?.restaurantId}/date/${selectDay}`)
            .then(res => {
                const data = res.data.result;
                setListBookingTables(data)
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
    },[selectDay, isBooking])

    useEffect(() => {
        if(currentArea?.id !== undefined){
            axiosInstance
            .get(`/api/table/area/${currentArea?.id}`)
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

    const sliceDisplayTime = (time) => {
        const newTime = time.slice(0, -3);
        return newTime
    }

    const handleChangeArea = (area) => {
        navigate(`/hostess/map/${area?.id}`)
    }

    const handleChangeDay = (value) => {
        setSelectDay(value);
        setStatusTime('week')
    }

    const handleChangeStatusTime = (value) => {
        setStatusTime(value);
        if(value === 'near'){
            setListBookingTables(nearTables)
        }else if(value === 'late'){
            setListBookingTables(lateTables)
        }else if(value === "all"){
            setListBookingTables(allTables)
        }
    }   

    const handleIncreaseNumberCustomer = () => {
        setNumberCustomer(prev => prev + 1);
    }
    const handleDecreaseNumberCustomer = () => {
        if(numberCustomer > 1){
            setNumberCustomer(prev => prev - 1);
        }
    }
    const handleChangeNumberCustomer = (value) => {
        if(!isNaN(value)){
            setNumberCustomer(value);
        }
    }

    const convertTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        // Convert 0 hour to 24
        const adjustedHours = hours === 0 ? 24 : hours;
        // Ensure hours are in 1-24 range and format
        return `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const handleOpenChooseTable = () => {
        setIsOpenChooseTable(true);
    }

    const handleOpenChooseDishes = () => {
        setIsOpenChooseDishes(true);
    }

    const handleChangeTime = (e) => {
        const value = e.target.value;
        setTime(convertTime(value));
    };

    const handleChangeDeposit = (value) => {
        if(!isNaN(value)){
            const numericValue = value.replace(/[^0-9]/g, '');
            setDeposit(numericValue);
        }
    }
    
    const checkTable = (id) => {
        if(tables?.includes(id)){
            return true
        }else{
            const result = tables?.findIndex(t => t?.id === id)
            return result !== -1
        }
        return false
    }

    const handleAddTable = (id) => {
        if(!tables?.includes(id)){
            setTables([...tables, id])
        }else{
            let listTable = tables?.filter(t => t !== id);
            setTables(listTable)
        }
    }

    const handleAddDish = (dish) => {
        let listDishesBooking = [...dishesChoose];
        let listDishesBookingSubmit = [...dishesChooseSubmit];
        const index = listDishesBooking.findIndex(d => d?.id === dish?.id)
        if(index !== -1){
           listDishesBooking[index].quantity += 1;
           listDishesBookingSubmit[index].quantity += 1;
        }else{
            listDishesBooking.push({...dish, quantity: 1});
            listDishesBookingSubmit.push({dishId: dish?.id, comboId: dish?.comboId !== undefined ? `${dish?.comboId}` :`0` , quantity: 1});
        }
        setDishesChoose(listDishesBooking)
        setDishesChooseSubmit(listDishesBookingSubmit)
    }

    const handleIncreaseDish = (dish) => {
        let listDishesBooking = [...dishesChoose];
        let listDishesBookingSubmit = [...dishesChooseSubmit];
        const index = listDishesBooking.findIndex(d => d?.id === dish?.id)
        listDishesBooking[index].quantity += 1;
        listDishesBookingSubmit[index].quantity += 1;
        setDishesChoose(listDishesBooking)
        setDishesChooseSubmit(listDishesBookingSubmit)
    }

    const handleDecreaseDish = (dish) => {
        let listDishesBooking = [...dishesChoose];
        let listDishesBookingSubmit = [...dishesChooseSubmit];
        const index = listDishesBooking.findIndex(d => d?.id === dish?.id)
        if(listDishesBooking[index]?.quantity === 1){
            listDishesBooking.splice(index,1);
            listDishesBookingSubmit.splice(index,1);
        }else{
            listDishesBooking[index].quantity -= 1;
            listDishesBookingSubmit[index].quantity -= 1;
        }
        setDishesChoose(listDishesBooking)
        setDishesChooseSubmit(listDishesBookingSubmit)
    }

    const handleRemoveDish = (dish) => {
        let listDishesBooking = [...dishesChoose];
        let listDishesBookingSubmit = [...dishesChooseSubmit];
        const index = listDishesBooking.findIndex(d => d?.id === dish?.id)
        listDishesBooking.splice(index,1);
        listDishesBookingSubmit.splice(index,1);
        setDishesChoose(listDishesBooking)
        setDishesChooseSubmit(listDishesBookingSubmit)
    }


    const handleSubmitBookTable = () => {
        const data = {
            customerName: customerName,
            customerPhone: phoneNumber,
            note: note,
            bookedDate: pickUpDay,
            time: time+':00',
            deposit: deposit,
            intendTimeMinutes: +intendTime,
            numbersOfCustomer: numberCustomer,
            tables: tables,
            scheduleDishes: dishesChooseSubmit
        }
        axiosInstance
        .post(`/api/schedule/restaurant/${user?.restaurantId}/create`,data)
        .then(res => {
            const response = res.data.result;
           if(response === 'success'){
                toast.success(`Đặt bàn thành công!`)
                setCustomerName('')
                setPhoneNumber('');
                setNote('');
                setDeposit('')
                setIntendTime(60);
                setNumberCustomer(1);
                setTables([]);
                setIsOpenBooking(false);
                setIsBooking(!isBooking)
                setIsCancel(!isCancel)
                setDishesChoose([]);
                setDishesChooseSubmit([]);
           }else{
            toast.error(response)
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

    function timeToMilliseconds(time) {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return (hours * 3600 + minutes * 60 + seconds) * 1000; 
    }

    function getMinutesDifference(time1, time2) {
        const time1InMillis = timeToMilliseconds(time1);
        const time2InMillis = timeToMilliseconds(time2);

        let differenceInMillis = time2InMillis - time1InMillis;
        
        // Nếu chênh lệch âm, nghĩa là time2 nằm trong ngày tiếp theo
        if (differenceInMillis < 0) {
            differenceInMillis += 24 * 3600 * 1000; // Thêm một ngày (24 giờ)
        }

        // Chuyển đổi từ mili giây sang phút
        const differenceInMinutes = Math.floor(differenceInMillis / (1000 * 60));

        return differenceInMinutes;
    }


    const handleOpenShowInfor = (table) => {
        setIsOpenShowInformation(true);
        setDishesChoose(table?.dishes)
        let listDishesSubmit = [];
        table?.dishes?.map(d => {
            let data = {
                comboId: d?.combo,
                dishId: d?.dish?.id,
                quantity: d?.quantity
            }
            listDishesSubmit.push(data)
        })
        setDishesChooseSubmit(listDishesSubmit);
        setScheduleIdCancel(table?.id);
        setCustomerName(table?.customerName);
        setPhoneNumber(table?.customerPhone);
        setNote(table?.note)
        setDeposit(table?.deposit);
        setIntendTime(getMinutesDifference(table?.time,table?.intendTime))
        setNumberCustomer(table?.numbersOfCustomer);
        setTables(table?.tableRestaurants);
        setPickUpDay(table?.bookedDate);
        setTime(sliceDisplayTime(table?.time));
    }

    const handleCloseShowInfor = () => {
        setCustomerName('')
        setPhoneNumber('');
        setNote('');
        setScheduleIdCancel("");
        setDeposit('')
        setIntendTime(60);
        setNumberCustomer(1);
        setTables([]);
        setIsOpenBooking(false);
        setIsBooking(!isBooking)
        setIsOpenShowInformation(false);
        setDishesChoose([]);
        setDishesChooseSubmit([]);
    }

    const handleCancelBooking = () => {
        setIsOpenConfirmCancel(true);
    }

    useEffect(() => {
        if(selectDay){
            axiosInstance
            .get(`/api/schedule/restaurant/${user?.restaurantId}/date/${selectDay}`)
            .then(res => {
                const data = res.data.result;
                setListBookingTables(data)
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
            setStatusTime("week")
        }

        getAllTable()
        getNearTable()
        getLateTable()
        getListDay()

    },[isCancel])

    const handleConfirmCancelBooking = () => {
        axiosInstance
        .put(`/api/schedule/${scheduleIdCancel}/employee/${user?.employeeId}/status/CANCEL`)
        .then(res => {
            toast.success("Huỷ đơn đặt bàn thành công")
            setIsOpenConfirmCancel(false);
            handleCloseShowInfor();
            setIsCancel(!isCancel)
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

    const handleCloseConfirmCancel = () => {
        setIsOpenConfirmCancel(false);
    }

    const handleOpenConfirmJoin = (id) => {
        setIsOpenConfirmJoin(true);
        setScheduleIdJoin(id)
    }

    const handleCloseConfirmJoin = () => {
        setIsOpenConfirmJoin(false);
        setScheduleIdJoin('');
    }

    const handleSubmitJoin = () => {
        axiosInstance
        .put(`/api/schedule/${scheduleIdJoin}/employee/${user?.employeeId}/status/ACCEPT`)
        .then(res => {
            toast.success("Nhập bàn thành công")
            setIsOpenConfirmJoin(false);
            setScheduleIdJoin('');
            setIsCancel(!isCancel)
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
                <div className="min-w-[40]x bg-secondary p-2 shadow min-h-[86vh] mt-2 flex justify-between">
                    <div className="w-[83%] rounded-md p-4 ">
                        <div className="flex justify-between flex-wrap">
                            {listBookingTables?.map((table, index) => {
                                return (
                                    <div  className="bg-white w-[22%] rounded-md mx-1 mb-4 " key={index}>
                                        <div className={`w-full ${table?.status === "CANCEL" ? " bg-red-400" : "bg-gray-200"} px-2 py-3 rounded-t-md text-center`}>
                                            <span className="font-medium">{table?.customerName} - {table?.customerPhone}</span>
                                        </div>
                                        <div className="bg-white flex cursor-pointer" onClick={() => handleOpenShowInfor(table)}>
                                            <div className="w-[30%] border-r-2 flex justify-center items-center flex-col">
                                                <span className="font-bold text-lg">{table?.tableRestaurants[0]?.name}</span>
                                                <div>
                                                    <span className="font-medium ">{table?.tableRestaurants.length > 1 && `(+${table?.tableRestaurants.length-1})`}</span>
                                                </div>
                                            </div>
                                            <div className="w-[70%]">
                                                <div className="flex">
                                                    <div className="w-[50%] px-2 py-2 flex items-center">
                                                    <GiAlarmClock className="mr-1 "/> <span>{sliceDisplayTime(table?.time)}</span>
                                                    </div>
                                                    <div className="w-[50%] px-2 py-2 flex items-center">
                                                    <HiUsers className="mr-1"/> <span>{table?.numbersOfCustomer}</span>
                                                    </div>
                                                </div>
                                                <div className=" px-2 py-2 flex items-center">
                                                    <RiMoneyDollarCircleFill />
                                                    <span className="ml-1">{formatVND(table?.deposit)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-200 flex rounded-b-md">
                                            <div className="w-[30%] flex justify-center items-center py-3 border-r-2 text-blue-600 font-semibold">
                                                ...
                                            </div>
                                            <div
                                                onClick={() => handleOpenConfirmJoin(table?.id)} 
                                                className="w-[70%] flex justify-center items-center py-3 text-blue-500 font-semibold cursor-pointer">
                                                <span>Khách nhận bàn</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="w-[22%] mx-1"></div>
                            <div className="w-[22%] mx-1"></div>
                            <div className="w-[22%] mx-1"></div>
                            <div className="w-[22%] mx-1"></div>
                        </div>
                       
                    </div>
                    <div className="w-[16%] flex-row">
                        <div
                            onClick={() => setIsOpenBooking(true)}
                            className="px-6 py-4 bg-[#65B741] flex justify-center items-center rounded-md text-white font-semibold shadow-md mb-2 cursor-pointer">
                             <MdOutlineAddCircleOutline className="mr-2 size-4"/>
                            <span>Tạo đơn đặt bàn</span>
                        </div>
                        <hr className="border-black border-1 mb-2"/>
                        <div
                            onClick={() => handleChangeStatusTime("all")} 
                            className={`px-6 py-4 ${statusTime === 'all' ? "bg-[#088e6a]" : "bg-[#50B498]"} flex justify-center items-center rounded-md text-white font-semibold shadow-md mb-2 cursor-pointer`}>
                            <span>Tất cả đơn đặt bàn</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <div
                                onClick={() => handleChangeStatusTime("near")} 
                                className={`w-[48%] px-3 py-4 ${statusTime === 'near' ? "bg-gray-400 text-white" : "bg-white text-black"} flex justify-center items-center rounded-md font-semibold shadow-md cursor-pointer relative`}>
                                <span>Sắp đến</span>
                                <span className="absolute right-1 top-1 text-xs text-red-700">{nearTables?.length}</span>
                            </div>
                            <div 
                                onClick={() => handleChangeStatusTime("late")} 
                                className={`w-[48%] px-3 py-4 ${statusTime === 'late' ? "bg-gray-400 text-white" : "bg-white text-black"} flex justify-center items-center rounded-md font-semibold shadow-md cursor-pointer relative`}>
                                <span>Quá giờ</span>
                                <span className="absolute right-1 top-1 text-xs text-red-700">{lateTables?.length}</span>
                            </div>
                        </div>
                        <hr className="border-black border-1 mb-2"/>
                        {listDay?.map((day, index) => (
                            <div 
                                key={index}
                                onClick={() => handleChangeDay(day?.date)}
                                className={`px-6 py-2 ${(selectDay === day?.date && statusTime === "week") ? "bg-gray-400 text-white" : "bg-white text-black"} relative flex justify-center items-center rounded-md font-semibold shadow-md mb-2 cursor-pointer duration-300 transition-all `}>
                                <span>{day?.date}</span>
                                <span className="absolute right-1 top-1 text-xs text-red-700">{day?.numbersSchedule}</span>
                            </div>
                        ))}
                        
                    </div>
                </div>
                {isOpenBooking && (
                    <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                        <div className="relative w-full max-w-3xl bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                            <button type="button" onClick={() => setIsOpenBooking(false)} className="absolute top-3 end-2.5 text-red-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="w-full flex justify-center items-center mb-4 border-b-2 pb-2 pt-4 bg-slate-200 rounded-t-lg">
                                <h2 className="font-bold text-lg">Thêm đặt bàn</h2>
                            </div>
                            <div className="flex-row">
                                <div className="flex justify-center px-4 pb-10">
                                    <div class="grid gap-6 mb-6 md:grid-cols-2 w-full">
                                        <div>
                                            <label htmlFor="dateBooking" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Thời gian nhận bàn<span className="text-red-500">(*)</span></label>
                                            <div className="w-full flex">
                                                <div className="w-[50%]">
                                                    <input
                                                        type="date"
                                                        id="dateBooking"
                                                        value={pickUpDay}
                                                        onChange={e => setPickUpDay(e.target.value)}
                                                        className="border border-gray-300 rounded-lg px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div className="w-[50%]">
                                                    <div class="relative ">
                                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                            <GiAlarmClock />
                                                        </div>
                                                        <input type="time" 
                                                        value={time}
                                                        onChange={e => handleChangeTime(e)}
                                                        className="bg-gray-50 border font-semibold text-center border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                        placeholder="Nhập ngày giờ"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="w-[45%]">
                                                <label htmlFor="numberCustomer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số khách<span className="text-red-500">(*)</span></label>
                                                <div className="flex">
                                                    <button onClick={handleDecreaseNumberCustomer} className="w-[35%] flex justify-center cursor-pointer items-center font-semibold bg-gray-300 p-2.5 text-lg rounded-l-lg text-red-500">-</button>
                                                    <input 
                                                        type="text"
                                                        value={numberCustomer}
                                                        onChange={e => handleChangeNumberCustomer(e.target.value)}
                                                        className="w-[30%] flex font-semibold p-2.5 text-center border-t-[2px] border-b-[2px]"
                                                     />
                                                    <button onClick={handleIncreaseNumberCustomer} className="w-[35%] flex justify-center cursor-pointer items-center font-semibold bg-gray-300 p-2.5 text-lg rounded-r-lg text-blue-500">+</button>
                                                </div>
                                            </div>
                                            <div className="w-[50%]">
                                                <label htmlFor="intendTime" className="text-right block mb-2 text-sm font-medium text-gray-900 dark:text-white">Thời gian dự kiến hoàn tất</label>
                                                <div className="w-full flex">
                                                    <input 
                                                        type="text" 
                                                        value={intendTime}
                                                        onChange={e => setIntendTime(e.target.value)}    
                                                        className="w-[50%] outline-none bg-gray-50 border text-center font-medium border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                    <div className="w-[50%] border-[1px] p-2.5 flex justify-center items-center font-semibold">Phút</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số điện thoại <span className="text-red-500">(*)</span></label>
                                            <div class="relative ">
                                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                    <MdOutlinePhoneAndroid />
                                                </div>
                                                <input type="text" id="phone" 
                                                value={phoneNumber}
                                                onChange={e => setPhoneNumber(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                placeholder="Nhập số điện thoại"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="customer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Khách hàng<span className="text-red-500">(*)</span></label>
                                            <div class="relative ">
                                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                    <FaUserCircle />
                                                </div>
                                                <input type="text" id="customer" 
                                                 value={customerName}
                                                onChange={e => setCustomerName(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                placeholder="Nhập tên khách hàng"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="table" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chọn bàn<span className="text-red-500">(*)</span></label>
                                            <div class="relative ">
                                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                    <MdLocationSearching />
                                                </div>
                                                <div 
                                                    onClick={() => handleOpenChooseTable()}
                                                    className="block bg-gray-50 cursor-pointer border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                    <span className="border-gray-300 font-medium text-gray-400">{tables?.length === 0 ? "Chưa chọn bàn" : `Đã chọn ${tables?.length} bàn`}</span>
                                                </div>
                                                <span className="absolute right-2.5 top-3 cursor-pointer"><MdOutlineNavigateNext /></span>
                                            </div>
                                        </div>  
                                        <div>
                                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đặt trước món</label>
                                            <div class="relative ">
                                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                    <BiSolidDish />
                                                </div>
                                                <div
                                                    onClick={() => handleOpenChooseDishes()} 
                                                    className="block bg-gray-50 cursor-pointer border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                    <span className="border-gray-300 font-medium text-gray-400">{dishesChooseSubmit?.length === 0 ? "Chưa chọn món" :`Đã chọn ${dishesChooseSubmit.length} món`}</span>
                                                </div>
                                                <span className="absolute right-2.5 top-3 cursor-pointer"><MdOutlineNavigateNext /></span>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="money" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đặt cọc trước</label>
                                            <div className="flex items-center">
                                                <div className="w-[50%] p-2.5 flex items-center border-2 rounded-l-lg ">
                                                    <GiMoneyStack className="mr-4 size-6" />
                                                    <span className="font-semibold">Tiền mặt</span>
                                                </div>
                                                    <NumericFormat
                                                        value={deposit}
                                                        thousandSeparator=","
                                                        suffix=" VND"
                                                        displayType="input"
                                                        onValueChange={(values) => handleChangeDeposit(values.value)}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-[50%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Nhập số tiền"
                                                    />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ghi chú</label>
                                            <div class="relative ">
                                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                    <MdNoteAlt />
                                                </div>
                                                <input type="text" id="note" 
                                                 value={note}
                                                onChange={e => setNote(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                placeholder="Nhập tên ghi chú"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t-2 flex justify-center py-2 items-center bg-blue-400 cursor-pointer rounded-b-md" onClick={() => handleSubmitBookTable()}>
                                    <p className="text-white font-medium uppercase">Xác nhận</p>
                                </div>
                            </div>
                            
                        </div>
                    
                </div>
                )}
            </div>
            {isOpenShowInformation && (
                <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                    <div className="relative w-full max-w-3xl bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                        <button type="button" onClick={() => handleCloseShowInfor()} className="absolute top-3 end-2.5 text-red-600 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="w-full flex justify-center items-center mb-4 border-b-2 pb-2 pt-4 bg-slate-200 rounded-t-lg">
                            <h2 className="font-bold text-lg">Thêm đặt bàn</h2>
                        </div>
                        <div className="flex-row">
                            <div className="flex justify-center px-4 pb-10">
                                <div class="grid gap-6 mb-6 md:grid-cols-2 w-full">
                                    <div>
                                        <label htmlFor="dateBooking" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Thời gian nhận bàn<span className="text-red-500">(*)</span></label>
                                        <div className="w-full flex">
                                            <div className="w-[50%]">
                                                <input
                                                    type="date"
                                                    id="dateBooking"
                                                    value={pickUpDay}
                                                    onChange={e => setPickUpDay(e.target.value)}
                                                    className="border border-gray-300 rounded-lg px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="w-[50%]">
                                                <div class="relative ">
                                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                        <GiAlarmClock />
                                                    </div>
                                                    <input type="time" 
                                                    value={time}
                                                    onChange={e => handleChangeTime(e)}
                                                    className="bg-gray-50 border font-semibold text-center border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    placeholder="Nhập ngày giờ"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="w-[45%]">
                                            <label htmlFor="numberCustomer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số khách<span className="text-red-500">(*)</span></label>
                                            <div className="flex">
                                                <button onClick={handleDecreaseNumberCustomer} className="w-[35%] flex justify-center cursor-pointer items-center font-semibold bg-gray-300 p-2.5 text-lg rounded-l-lg text-red-500">-</button>
                                                <input 
                                                    type="text"
                                                    value={numberCustomer}
                                                    onChange={e => handleChangeNumberCustomer(e.target.value)}
                                                    className="w-[30%] flex font-semibold p-2.5 text-center border-t-[2px] border-b-[2px]"
                                                    />
                                                <button onClick={handleIncreaseNumberCustomer} className="w-[35%] flex justify-center cursor-pointer items-center font-semibold bg-gray-300 p-2.5 text-lg rounded-r-lg text-blue-500">+</button>
                                            </div>
                                        </div>
                                        <div className="w-[50%]">
                                            <label htmlFor="intendTime" className="text-right block mb-2 text-sm font-medium text-gray-900 dark:text-white">Thời gian dự kiến hoàn tất</label>
                                            <div className="w-full flex">
                                                <input 
                                                    type="text" 
                                                    value={intendTime}
                                                    onChange={e => setIntendTime(e.target.value)}    
                                                    className="w-[50%] outline-none bg-gray-50 border text-center font-medium border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                <div className="w-[50%] border-[1px] p-2.5 flex justify-center items-center font-semibold">Phút</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số điện thoại <span className="text-red-500">(*)</span></label>
                                        <div class="relative ">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                <MdOutlinePhoneAndroid />
                                            </div>
                                            <input type="text" id="phone" 
                                            value={phoneNumber}
                                            disabled
                                            className="bg-gray-400 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            placeholder="Nhập số điện thoại"/>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="customer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Khách hàng<span className="text-red-500">(*)</span></label>
                                        <div class="relative ">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                <FaUserCircle />
                                            </div>
                                            <input type="text" id="customer" 
                                                value={customerName}
                                                disabled
                                                className="bg-gray-400 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            placeholder="Nhập tên khách hàng"/>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="table" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Chọn bàn<span className="text-red-500">(*)</span></label>
                                        <div class="relative ">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                <MdLocationSearching />
                                            </div>
                                            <div 
                                                onClick={() => handleOpenChooseTable()}
                                                className="block bg-gray-50 cursor-pointer border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                <span className="border-gray-300 font-medium text-gray-400">{tables?.length === 0 ? "Chưa chọn bàn" : `Đã chọn ${tables?.length} bàn`}</span>
                                            </div>
                                            <span className="absolute right-2.5 top-3 cursor-pointer"><MdOutlineNavigateNext /></span>
                                        </div>
                                    </div>  
                                    <div>
                                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đặt trước món</label>
                                        <div class="relative ">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                <BiSolidDish />
                                            </div>
                                            <div
                                                onClick={() => handleOpenChooseDishes()} 
                                                className="block bg-gray-50 cursor-pointer border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                <span className="border-gray-300 font-medium text-gray-400">{dishesChoose?.length > 0 ? `Đã đặt ${dishesChoose?.length} món` : "Chưa có món được chọn"} </span>
                                            </div>
                                            <span className="absolute right-2.5 top-3 cursor-pointer"><MdOutlineNavigateNext /></span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="money" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đặt cọc trước</label>
                                        <div className="flex items-center">
                                            <div className="w-[50%] p-2.5 flex items-center border-2 rounded-l-lg ">
                                                <GiMoneyStack className="mr-4 size-6" />
                                                <span className="font-semibold">Tiền mặt</span>
                                            </div>
                                                <NumericFormat
                                                    value={deposit}
                                                    thousandSeparator=","
                                                    suffix=" VND"
                                                    disabled
                                                    displayType="input"
                                                    // onValueChange={(values) => handleChangeDeposit(values.value)}
                                                    className="bg-gray-400 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-[50%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    placeholder="Nhập số tiền"
                                                />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ghi chú</label>
                                        <div class="relative ">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                <MdNoteAlt />
                                            </div>
                                            <input type="text" id="note" 
                                                value={note}
                                            onChange={e => setNote(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            placeholder="Nhập tên ghi chú"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div onClick={() => handleCancelBooking(scheduleIdCancel)} className="border-t-2 flex justify-center py-2 items-center bg-gray-200 cursor-pointer rounded-bl-md w-[50%]" >
                                    <p className="text-red-500 font-medium uppercase">Huỷ đơn đặt bàn</p>
                                </div>
                                <div className="border-t-2 flex justify-center py-2 items-center bg-blue-400 cursor-pointer rounded-br-md w-[50%]" >
                                    <p className="text-white font-medium uppercase">Xác nhận</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                
            </div>
            )}

            {isOpenConfirmCancel && (
                <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                    <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                        <button type="button" onClick={handleCloseConfirmCancel} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn muốn huỷ đơn đặt bàn này?</h3>
                            <button 
                                onClick={handleConfirmCancelBooking}
                                data-modal-hide="popup-modal" 
                                type="button" 
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Có
                            </button>
                            <button 
                                data-modal-hide="popup-modal" 
                                type="button" 
                                onClick={handleCloseConfirmCancel}
                                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                Không
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isOpenConfirmJoin && (
                <div id="popup-delete" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 animate-fadeIn">
                    <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 animate-slideIn">
                        <button type="button" onClick={handleCloseConfirmJoin} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <FaCircleCheck className="text-green"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Bạn có chắc chắn khách đã nhập bàn?</h3>
                            <button 
                                onClick={handleSubmitJoin}
                                data-modal-hide="popup-modal" 
                                type="button" 
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Có
                            </button>
                            <button 
                                data-modal-hide="popup-modal" 
                                type="button" 
                                onClick={handleCloseConfirmJoin}
                                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                Không
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isOpenChooseTable && (
                 <div className="fixed inset-0 bg-primary z-50 flex flex-col animate-fadeIn">
                        <div className="flex items-center justify-between h-[70px] bg-gray-700 ">
                            <div className='px-[15px] py-[30px] flex items-center justify-center border-[#EDEDED]/[0.3] '>
                                <img src={LOGO} alt="" className="w-10 inline-block items-center rounded-full mr-2" />
                                <h1 className='text-white text-[20px] leading-[24px] font-extrabold cursor-pointer'> VietKitchen</h1>
                            </div>
                            <div onClick={() => setIsOpenChooseTable(false)} className={'text-white bg-red-400 px-[15px] flex items-center h-full cursor-pointer'}>
                                <span className="flex items-center"><IoMdArrowBack className="mr-2"/> Quay lại (Esc)</span>
                            </div>
                        </div>
                        <div className="flex-1 flex">
                            <div className="w-[84%] bg-secondary flex p-6 relative">
                                <div className="w-full flex flex-wrap justify-between">
                                    {board?.map((table, index) => (
                                        <div 
                                            onClick={() => handleAddTable(table?.id)}
                                            className={`flex-row p-8 border-2 border-transparent ${checkTable(table?.id) ? "bg-blue-500 text-white"  : "bg-white text-black"} justify-center w-[12%] h-[30%] mb-2 rounded-lg shadow-lg cursor-pointer hover:opacity-80 transition-all duration-300`} 
                                            key={index} 
                                        >
                                            <div className="text-center">
                                                <b>{table?.name}</b>
                                            </div>
                                            <div className="text-center mt-2">
                                                <hr className="w-1/2 mx-auto border-gray-400" />
                                                <span className={`block mt-2 text-sm font-semibold ${checkTable(table?.id) ? "text-white" : "text-gray-500"} `}>Bàn trống</span>
                                            </div>
                                        </div>

                                    ))}
                                    <div className="w-[12%]"></div>
                                    <div className="w-[12%]"></div>
                                    <div className="w-[12%]"></div>
                                    <div className="w-[12%]"></div>
                                    <div className="w-[12%]"></div>
                                    <div className="w-[12%]"></div>
                                    <div className="w-[12%]"></div>
                                    
                                </div>
                            </div>
                            <div className="absolute bg-white bottom-2 left-6 w-[81%] rounded-lg p-4">
                                <h3 className="font-semibold mb-3">Bàn đang chọn ({tables?.length})</h3>
                                <div className="flex justify-between items-center">
                                    <span>Đã chọn {tables?.length} bàn</span>
                                    <button onClick={() => setIsOpenChooseTable(false)} className="px-3 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md cursor-pointer">Xác nhận</button>
                                </div>
                            </div>
                            <div className="w-[16%] bg-gray-400 flex flex-col items-center">
                                {areaList?.map((a, index) => (
                                    <div
                                        onClick={() => setCurrentArea(a)} 
                                        className={`mt-2 ${currentArea?.id === a?.id ? "bg-blue-600 text-white" : "bg-white text-black"} w-[94%] flex items-center px-3 py-4 rounded-md shadow-lg cursor-pointer duration-300 transition-all hover:bg-blue-600 hover:text-white`} key={index}>
                                        <span className="flex items-center font-medium"><MdLocationOn className="size-6 mr-3"/>{a?.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                </div>
            )}
            {isOpenChooseDishes && (
                <div className="fixed inset-0 bg-primary z-50 flex flex-col animate-fadeIn">
                        <div className="flex items-center justify-between h-[70px] bg-gray-700 ">
                            <div className='px-[15px] py-[30px] flex items-center justify-center border-[#EDEDED]/[0.3] '>
                                <img src={LOGO} alt="" className="w-10 inline-block items-center rounded-full mr-2" />
                                <h1 className='text-white text-[20px] leading-[24px] font-extrabold cursor-pointer'> VietKitchen</h1>
                            </div>
                            <div onClick={() => setIsOpenChooseDishes(false)} className={'text-white bg-red-400 px-[15px] flex items-center h-full cursor-pointer'}>
                                <span className="flex items-center"><IoMdArrowBack className="mr-2"/> Quay lại (Esc)</span>
                            </div>
                        </div>
                        <div className="flex-1 flex bg-gray-700">
                            <div className="w-[8%] bg-gray-500 rounded-sm">
                                <div className="w-full h-[40px] bg-slate-200 rounded-sm mb-1"></div>
                                {listCategories?.map((cate, index) => (
                                    <div 
                                        onClick={() => setCurrentCategory(cate)} 
                                        className={`w-full h-[80px] ${currentCategory?.id === cate?.id ? "bg-blue-600 text-white" : "bg-white text-black"} flex justify-center items-center cursor-pointer`} key={index}>
                                        <span className="font-medium ">{cate?.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="w-[75%] px-1 flex-row">
                                <div className="w-full flex">
                                    <div className="w-[50%] mr-1 h-[40px] bg-slate-200 rounded-sm ">

                                    </div>
                                    <div className="w-[50%] h-[40px] bg-slate-200 rounded-sm">

                                    </div>
                                </div>
                                <div className="w-full flex flex-wrap mt-1 rounded-sm">
                                    {listDishes?.map((d, index) => (
                                        <div className="w-[16%] mr-1 relative cursor-pointer" key={index} onClick={() => handleAddDish(d)}>
                                            <div className="w-full">
                                                <img className="object-cover md:h-[180px] rounded-l-md rounded-t-sm" src={d?.imageUrl} alt=""/>
                                            </div>
                                            <div className="absolute top-2 left-2 flex justify-center items-center bg-blue-800 p-1 rounded">
                                                <span className="text-xs text-white font-medium">{formatVND(d?.price)}</span>
                                            </div>
                                            <div className={`absolute bottom-0 w-full left-0 h-[50px] bg-gray-500/[0.95] rounded-b-sm flex justify-center items-center`}>
                                                <span className="text-white font-medium">{d?.name}</span>
                                            </div>
                                            
                                       </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-[18%] bg-white">
                                <div className="w-full h-[40px] bg-slate-200 rounded-sm mb-1 flex">
                                    <div className="w-[20%] border-r border-slate-400 flex justify-center items-center"><BiSolidDish /></div>
                                    <div className="w-[60%] flex justify-center items-center border-r border-slate-400">
                                        <span className="text-sm font-medium">Danh sách món ăn đặt trước</span>
                                    </div>
                                    <div className="w-[20%] flex justify-center items-center"><IoMdMore className="size-8" /></div>
                                </div>
                                {dishesChoose?.map((d, index) => (
                                    <div className="flex-row bg-blue-600 py-2 px-2 " key={index}>
                                        <div className="w-full ">
                                            <div className="flex justify-between">
                                                <div className="w-[5%] flex justify-center">
                                                    <span className="text-[12px] text-white font-medium">{index+1}.</span>
                                                </div>
                                                <div className="w-[60%] flex-row">
                                                    <h2 className="text-[12px] text-white font-medium">{d?.name || d?.dish?.name}</h2>
                                                    <span className="text-[12px] text-white font-normal">Giá thường: {formatVND(d?.price||d?.dish?.price)}</span>
                                                </div>
                                                <div className="w-[7%] flex items-start">
                                                    <span className="text-[12px] text-white font-medium">{d?.quantity}</span>
                                                </div>
                                                <div className="w-[23%] flex items-start">
                                                    <span className="text-[12px] text-white font-medium">{formatVND((+d?.price||d?.dish?.price)*(+d?.quantity))}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between w-full my-3">
                                            <div
                                                onClick={() => handleDecreaseDish(d)} 
                                                className="w-[17%] bg-white shadow-lg flex justify-center items-center py-2 rounded-md cursor-pointer">
                                                <FaMinus className="font-bold text-xl " />
                                            </div>
                                            <div 
                                                onClick={() => handleIncreaseDish(d)} 
                                                className="w-[17%] bg-white shadow-lg flex justify-center items-center py-2 rounded-md cursor-pointer">
                                                <FaPlus className="font-bold text-xl " />
                                            </div>
                                            <div className="w-[17%] flex justify-center items-center py-2 ">
                                                {/* <FaMinus className="font-bold text-xl " /> */}
                                            </div>
                                            <div className="w-[17%] flex justify-center items-center py-2 ">
                                                {/* <FaMinus className="font-bold text-xl " /> */}
                                            </div>
                                            <div 
                                                onClick={() => handleRemoveDish(d)} 
                                                className="w-[17%] bg-white shadow-lg flex justify-center items-center py-2 rounded-md cursor-pointer">
                                                <span className="font-medium text-red-500 text-sm ">Xoá</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute bg-white bottom-2 left-36 w-[70%] rounded-lg p-4">
                                <h3 className="font-semibold mb-3">Món đang chọn ({dishesChooseSubmit?.length})</h3>
                                <div className="flex justify-between items-center">
                                    <span>Đã chọn {dishesChooseSubmit?.length} món</span>
                                    <button onClick={() => setIsOpenChooseDishes(false)} className="px-3 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md cursor-pointer">Xác nhận</button>
                                </div>
                            </div>
                            
                        </div>
                </div>
            )}
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

export default BookingTable
