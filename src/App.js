import './App.css';
import { BrowserRouter, Route, Routes, unstable_HistoryRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { adminRoutes, chefRoutes, hostessRoutes, managerRoutes, publicRoutes, waiterRoutes } from './routes';
import Page404 from './pages/common/Page404/Page404';
import Main from './components/adminComponent/Main';
import {  useUser } from './utils/constant';
import { useEffect } from 'react';
import { checkAuth, logoutLocalStorage } from './utils/localStorageHelper';
axios.defaults.baseURL = "http://localhost:8080"
// axios.defaults.baseURL = "http://be.vietkitchen.shop/"

function App() {

  const user = useUser();

  // useEffect(() => {
  //   if(!checkAuth()){
  //     logoutLocalStorage()
  //     navigate('/login');
  //   }
  // },[navigate])

  return (
    <BrowserRouter>
      <Routes>

        {publicRoutes.map((route, index) => {
          const Page = route.component;
          return (
              <Route
                path={route?.path}
                element={<Page />}
                key={index}
              />
           
            )
          }
        )}

        {adminRoutes.map((route, index) => {
          const Page = route.component;
          return (
            (user?.role?.includes("ROLE_ADMIN")&& 
              <Route
                path={route?.path}
                element={<Page />}
                key={index}
              />
           
            ))
        })}

        {managerRoutes.map((route, index) => {
          const Page = route.component;
          return (
              (user?.role?.includes("ROLE_MANAGER") && (
                <Route
                  path={route?.path}
                  element={<Page />}
                  key={index}
                />
              ))
           
            )
          }
        )}

        {waiterRoutes.map((route, index) => {
          const Page = route.component;
          return (
              (user?.role?.includes("ROLE_WAITER") && (
                <Route
                  path={route?.path}
                  element={<Page />}
                  key={index}
                />
              ))
           
            )
          }
        )}

        {chefRoutes.map((route, index) => {
          const Page = route.component;
          return (
              (user?.role?.includes("ROLE_CHEF") && (
                <Route
                  path={route?.path}
                  element={<Page />}
                  key={index}
                />
              ))
           
            )
          }
        )}

        {hostessRoutes.map((route, index) => {
          const Page = route.component;
          return (
              (user?.role?.includes("ROLE_HOSTESS") && (
                <Route
                  path={route?.path}
                  element={<Page />}
                  key={index}
                />
              ))
           
            )
          }
        )}

        <Route path='*' element={<Page404 />} />

      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Bounce}
        theme="light"
        className={'toastContainerDefault'}
      />
    </BrowserRouter>

  );
}

export default App;
