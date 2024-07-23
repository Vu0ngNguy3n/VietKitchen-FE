import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard"
import SidebarManager from "../../components/managerComponent/SidebarManager"
import axiosInstance from "../../utils/axiosInstance";
import { getUser } from "../../utils/constant";
import { formatVND } from "../../utils/format";
// import RestaurantPackage from "../../assests/restaurantPackage.jpg"

function SettingPackage(){

    const [restaurantInformation, setRestaurantInformation] = useState();
    const [packageAbleToUpdate, setPackageAbleToUpdate] = useState();
    const user = getUser();

    useEffect(() => {
        axiosInstance
        .get(`/api/restaurant/account/${user?.accountId}`)
        .then(res => {
            const data =res.data.result.restaurantPackage;
            setRestaurantInformation(data)
        })
        .catch(err => {
            if (err.response) {
                const errorRes = err.response.data;
                toast.error(errorRes.message);
            } else if (err.request) {
                toast.error("Request failed");
            } else {
                toast.error(err.message);
            }
        });

        axiosInstance
        .get(`/api/package/restaurant/${user?.restaurantId}`)
        .then(res => {
            const data =res.data.result?.packages;
            console.log(data);
            setPackageAbleToUpdate(data)
        })
        .catch(err => {
            if (err.response) {
                const errorRes = err.response.data;
                toast.error(errorRes.message);
            } else if (err.request) {
                toast.error("Request failed");
            } else {
                toast.error(err.message);
            }
        });
    },[])

    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%]  h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-primary/[0.1] p-12 shadow min-h-[90vh] mt-2 flex-row overflow-y-scroll">
                        <div className="flex justify-between pb-3 border-b-2 border-slate-300">
                            <h1 className="font-black text-2xl">Thông tin gói dịch vụ</h1>
                        </div>
                        <div className="flex justify-center mt-10 w-full border-b-2 border-b-slate-300 pb-8">
                            <div className="relative w-[50%] rounded-lg bg-white p-12 shadow min-h-10 mt-2">
                                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg">
                                    Gói hiện tại
                                </div>

                                <div className="flex gap-4 justify-center mt-6 flex-wrap">
                                    <img src='https://bizweb.dktcdn.net/100/102/351/files/iconpakagesoft.svg?v=1600332100283' alt="" className="w-[60%]"/>
                                    <div className="w-full justify-center flex flex-wrap">
                                        <div className="w-full flex justify-center">
                                            <h2 className="text-black uppercase font-semibold text-3xl">Gói {restaurantInformation?.packName}</h2>
                                        </div>
                                        <div className="w-full flex justify-center">
                                            <p className="font-semibold text-black"><s>{formatVND(restaurantInformation?.pricePerMonth)} /tháng</s></p>
                                        </div>
                                        <div className="w-full flex justify-center border-b-2 pb-6">
                                            <p className="flex items-end"><p className="text-blue-700 text-3xl font-extrabold">{formatVND(restaurantInformation?.pricePerYear)}</p> <p className="font-normal">/tháng</p></p>
                                        </div>
                                    </div>
                                    <div className="w-full justify-center">
                                        <ul className="">
                                            {restaurantInformation?.permissions?.map((p, index) => {
                                                return <li key={index} className="text-center mb-3">{p?.name}</li>
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center w-full flex-wrap ">
                            <div className="pt-[15px] w-full flex justify-center"><p className="pt-[15px] text-[42px] text-[#42464e] font-light leading-4">Bảng giá gói phần mềm tính tiền, quản lý nhà hàng</p></div>
                            <div className="flex justify-center mt-10 w-full ">
                                {packageAbleToUpdate?.reverse()?.map((pack, index) => {
                                    return (
                                        <div className="relative w-[35%] rounded-lg bg-white p-12 shadow min-h-10 mt-2 mx-2" key={index}>
                                            {pack?.packName.toLowerCase().includes("premium") && <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg">
                                                Gói phổ biến
                                            </div> }
                                            <div className="flex gap-4 justify-center mt-6 flex-wrap">
                                                <img src='https://bizweb.dktcdn.net/100/102/351/files/iconpakagesoft.svg?v=1600332100283' alt="" className="w-[60%]"/>
                                                <div className="w-full justify-center flex flex-wrap">
                                                    <div className="w-full flex justify-center">
                                                        <h2 className="text-black uppercase font-semibold text-3xl">Gói {pack?.packName}</h2>
                                                    </div>
                                                    <div className="w-full flex justify-center">
                                                        <p className="font-semibold text-black"><s>{formatVND(pack?.pricePerMonth)} /tháng</s></p>
                                                    </div>
                                                    <div className="w-full flex justify-center border-b-2 pb-6">
                                                        <p className="flex items-end"><p className="text-blue-700 text-3xl font-extrabold">{formatVND(pack?.pricePerYear)}</p> <p className="font-normal">/năm</p></p>
                                                    </div>
                                                </div>
                                                <div className="w-full justify-center">
                                                    <ul className="">
                                                        {pack?.permissions?.map((p, index) => {
                                                            return <li key={index} className="text-center mb-3">{p?.name}</li>
                                                        })}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl ">Nâng cấp</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        

                    </div>
                </div>


            </div>
        </div>
    )
}

export default SettingPackage