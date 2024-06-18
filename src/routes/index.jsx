import SignInSide from "../pages/common/Login/Login"
import SignUp from "../pages/common/SignUp/SignUp"
import HomePage from "../pages/common/HomePage/HomePage"
import Dashboard from "../pages/admin/Dashboard"
import Permissions from "../pages/admin/Permissions"
import Packages from "../pages/admin/Packages"
import AccountsManagements from "../pages/admin/AccountManagement"
import AccountDetail from "../pages/admin/AccountDetail"

const publicRoutes = [
    {path: '/login', component: SignInSide},
    {path: '/signUp', component: SignUp},
    {path: '/', component: HomePage},
    {path: '/admin/dashboard', component: Dashboard},
    {path: '/admin/permissions', component: Permissions},
    {path: '/admin/packages', component: Packages},
    {path: '/admin/accountsManagement', component: AccountsManagements},
    {path: '/admin/accountDetail', component: AccountDetail},
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