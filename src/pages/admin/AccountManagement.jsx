import Dashboardview from "../../components/adminComponent/DashboardView"
import Sidebar from "../../components/adminComponent/Sidebar"
import { FaSearch } from "react-icons/fa";

function AccountsManagements() {

    const FILTERS = [
        
    ]

    return (
        <div className="">
            <div className="flex overflow-scroll ">
                <div className="basis-[12%] h-[100vh]">
                    <Sidebar />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <Dashboardview />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow">
                        <h1 className="font-black text-3xl">Danh sách người dùng</h1>

                        <div className="flex mt-6">
                            <div className="">
                                <div className="relative grow rounded-md border-2 border-gray-300">
                                    <FaSearch
                                        className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        className=" w-full px-4 py-3 pl-10 outline-none italic"
                                        placeholder="Nhập tên người dùng"
                                    />
                                </div>


                            </div>

                            <div>

                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default AccountsManagements