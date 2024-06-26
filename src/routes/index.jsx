import SignInSide from "../pages/common/Login/Login"
import SignUp from "../pages/common/SignUp/SignUp"
import HomePage from "../pages/common/HomePage/HomePage"
import Dashboard from "../pages/admin/Dashboard"
import Permissions from "../pages/admin/Permissions"
import Packages from "../pages/admin/Packages"
import AccountsManagements from "../pages/admin/AccountManagement"
import AccountDetail from "../pages/admin/AccountDetail"
import Dashboardmanager from "../pages/manager/DashboardManager"
import StaffManager from "../pages/manager/StaffManager"
import CustomerManager from "../pages/manager/CustomerManager"
import InvoiceManagement from "../pages/manager/InvoiceManagerment"
import CategoryManagement from "../pages/manager/CategoryManagement"
import ComboManagement from "../pages/manager/ComboManagement"
import UnitManagement from "../pages/manager/UnitManagement"
import SettingManager from "../pages/manager/SettingManager"
import RestaurantInformation from "../pages/manager/RestaurantInformation"
import PackageDetail from "../pages/admin/PackageDetail"
import DishesManagement from "../pages/manager/DishesManagement"
import RestaurantMap from "../pages/manager/RestaurantMap"

const publicRoutes = [
    {path: '/login', component: SignInSide},
    {path: '/signUp', component: SignUp},
    {path: '/', component: HomePage},
    {path: '/admin/dashboard', component: Dashboard},
    {path: '/admin/permissions', component: Permissions},
    {path: '/admin/packages', component: Packages},
    {path: '/admin/packageDetail', component: PackageDetail},
    {path: '/admin/accountsManagement', component: AccountsManagements},
    {path: '/admin/accountDetail/:accountId', component: AccountDetail},
    {path: '/manager/dashboard', component: Dashboardmanager},
    {path: '/manager/staffs', component: StaffManager},
    {path: '/manager/customers', component: CustomerManager},
    {path: '/manager/dishes', component: DishesManagement},
    {path: '/manager/invoices', component: InvoiceManagement},
    {path: '/manager/categories', component: CategoryManagement},
    {path: '/manager/combos', component: ComboManagement},
    {path: '/manager/units', component: UnitManagement},
    {path: '/manager/setting', component: SettingManager},
    {path: '/manager/restaurantInformation', component: RestaurantInformation},
    {path: '/manager/restaurantMap', component: RestaurantMap},

]

const adminRoutes = [

]

const managerRoutes = [

]

const waiterRoutes = [

]

const hostessRoutes = [

]

const chefRoutes = [

]

export {publicRoutes, adminRoutes, managerRoutes, waiterRoutes, hostessRoutes, chefRoutes}