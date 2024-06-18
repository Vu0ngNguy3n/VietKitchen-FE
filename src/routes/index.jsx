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
import DishesManagement from "../pages/manager/DishesManagement"
import InvoiceManagement from "../pages/manager/InvoiceManagerment"
import CategoryManagement from "../pages/manager/CategoryManagement"

const publicRoutes = [
    {path: '/login', component: SignInSide},
    {path: '/signUp', component: SignUp},
    {path: '/', component: HomePage},
    {path: '/admin/dashboard', component: Dashboard},
    {path: '/admin/permissions', component: Permissions},
    {path: '/admin/packages', component: Packages},
    {path: '/admin/accountsManagement', component: AccountsManagements},
    {path: '/admin/accountDetail', component: AccountDetail},
    {path: '/manager/dashboard', component: Dashboardmanager},
    {path: '/manager/staffs', component: StaffManager},
    {path: '/manager/customers', component: CustomerManager},
    {path: '/manager/dishes', component: DishesManagement},
    {path: '/manager/invoices', component: InvoiceManagement},
    {path: '/manager/categories', component: CategoryManagement},

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