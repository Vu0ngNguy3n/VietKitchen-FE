import SidebarManager from "../../components/managerComponent/SidebarManager"
import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard"
import MapMain from "../../components/managerComponent/RestaunrantMap/MapMain"


function RestaurantMapMain() {

    

    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                    <div className="min-w-[40]x rounded-lg bg-gray-300 p-4 shadow min-h-[90vh] mt-2">
                         {/* <h1 className="font-black text-3xl">Sơ đồ nhà hàng</h1> */}
                        
                        <div className="w-full ">
                            <MapMain/>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default RestaurantMapMain
