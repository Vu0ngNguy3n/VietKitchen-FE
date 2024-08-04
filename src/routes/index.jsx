import SignInSide from "../pages/common/Login/Login"
import SignUp from "../pages/common/SignUp/SignUp"
import HomePage from "../pages/common/HomePage/HomePage"
import Dashboard from "../pages/admin/Dashboard"
import Permissions from "../pages/admin/Permissions"
import Packages from "../pages/admin/Packages"
import AccountsManagements from "../pages/admin/AccountManagement"
import AccountDetail from "../pages/admin/AccountDetail"
// import Dashboardmanager from "../pages/manager/DashboardManager"
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
import AddCombo from "../pages/manager/AddCombo"
import Ordering from "../pages/staff/waiter/Ordering"
import Menu from "../pages/staff/waiter/Menu"
import DishPreparation from "../pages/staff/chef/DishPreparation"
import MapWaiter from "../pages/staff/waiter/MapWaiter"
import Payment from "../pages/staff/waiter/Payment"
import MapHostess from "../pages/staff/hostess/MapHostess"
import PaymentSetting from "../pages/manager/PaymentSetting"
import DashboardManager from "../pages/manager/DashboardManager"
import SettingPackage from "../pages/manager/SettingPackage"
import VATSetting from "../pages/manager/VATSetting"
import PointSetting from "../pages/manager/PointSetting"
import PackageUpdate from "../pages/admin/PackageUpdate"
import RestaurantMapMain from "../pages/manager/RestaurantMapMain"

const publicRoutes = [
    {path: '/login', component: SignInSide},
    {path: '/signUp', component: SignUp},
    {path: '/', component: HomePage},

]

const adminRoutes = [
    {path: '/admin/dashboard', component: Dashboard},
    {path: '/admin/permissions', component: Permissions},
    {path: '/admin/packages', component: Packages},
    {path: '/admin/packageDetail', component: PackageDetail},
    {path: '/admin/packageUpdate/:slug', component: PackageUpdate},
    {path: '/admin/accountsManagement', component: AccountsManagements},
    {path: '/admin/accountDetail/:accountId', component: AccountDetail},
]

const managerRoutes = [
    {path: '/manager/dashboard', component: DashboardManager},
    {path: '/manager/staffs', component: StaffManager},
    {path: '/manager/customers', component: CustomerManager},
    {path: '/manager/dishes', component: DishesManagement},
    {path: '/manager/invoices', component: InvoiceManagement},
    {path: '/manager/categories', component: CategoryManagement},
    {path: '/manager/combos', component: ComboManagement},
    {path: '/manager/addCombo', component: AddCombo},
    {path: '/manager/units', component: UnitManagement},
    {path: '/manager/setting', component: SettingManager},
    {path: '/manager/restaurantInformation', component: RestaurantInformation},
    {path: '/manager/restaurantMap', component: RestaurantMap},
    {path: '/manager/restaurantMapMain', component: RestaurantMapMain},
    {path: '/manager/paymentSetting', component: PaymentSetting},
    {path: '/manager/packageRestaurant', component: SettingPackage},
    {path: '/manager/VATSetting', component: VATSetting},
    {path: '/manager/PointSetting', component: PointSetting},
]

const waiterRoutes = [
    {path: '/waiter/ordering', component: Ordering},
    {path: '/waiter/menu/:slug', component: Menu},
    {path: '/waiter/map', component: MapWaiter},
    {path: '/waiter/payment', component: Payment},
]

const hostessRoutes = [
    {path: '/hostess/map', component: MapHostess},
]

const chefRoutes = [
    {path: '/chef/dishPreparation', component: DishPreparation},
]

export {publicRoutes, adminRoutes, managerRoutes, waiterRoutes, hostessRoutes, chefRoutes}