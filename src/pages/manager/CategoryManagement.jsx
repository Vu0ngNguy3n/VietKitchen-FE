import SidebarManager from "../../components/managerComponent/SidebarManager"
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard"

function CategoryManagement() {
    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-white p-16 shadow min-h-[90vh] mt-2">
                        <h1 className="font-black text-3xl">Quản lý thực đơn</h1>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default CategoryManagement
