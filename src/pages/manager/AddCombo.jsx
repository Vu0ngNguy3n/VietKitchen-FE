import HeaderManagerDashboard from "../../components/managerComponent/HeaderManagerDashboard";
import SidebarManager from "../../components/managerComponent/SidebarManager";


function AddCombo(){
    return (
        <div className="">
            <div className="flex ">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarManager />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <HeaderManagerDashboard />
                </div>


            </div>
        </div>
    )
}

export default AddCombo