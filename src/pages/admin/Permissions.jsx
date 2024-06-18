import Dashboardview from "../../components/adminComponent/DashboardView"
import Sidebar from "../../components/adminComponent/Sidebar"


function Permissions(){
    return(
        <div className="">
            <div className="flex overflow-scroll ">
                <div className="basis-[12%] h-[100vh]">
                    <Sidebar />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <Dashboardview />
                    <div className="min-w-[40rem] round ">
                        
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Permissions