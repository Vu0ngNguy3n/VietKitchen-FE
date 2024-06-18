import Dashboardview from "../../components/adminComponent/DashboardView"
import Sidebar from "../../components/adminComponent/Sidebar"


function AccountsManagements(){
    return(
        <div className="">
            <div className="flex overflow-scroll ">
                <div className="basis-[12%] h-[100vh]">
                    <Sidebar />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <Dashboardview />
                    <div>
                        
                    </div>
                </div>


            </div>
        </div>
    )
}

export default AccountsManagements