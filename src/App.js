import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { adminRoutes, chefRoutes, hostessRoutes, managerRoutes, publicRoutes, waiterRoutes } from './routes';
import Page404 from './pages/common/Page404/Page404';
import Main from './components/adminComponent/Main';
import { getUser } from './utils/constant';
import { useEffect } from 'react';
axios.defaults.baseURL = "http://localhost:8080"

function App() {
  const user = getUser();
  useEffect(() => {
    console.log(user);
  },[])
  
  return (
    <BrowserRouter>
      <Routes>

        {publicRoutes.map((route, index) => {
          return (
              <Route
                path={route.path}
                element={<route.component />}
                key={index}
              />
           
            )
          }
        )}

        {adminRoutes.map((route, index) => {
          return (
            (user?.role?.includes("ROLE_ADMIN")&& (route?.path?.includes('/admin/dashboard'))?
              <Route path={route?.path} element={<route.component/>}>
                  <Route index element={<Main/>}/>
              </Route>
            :
              <Route
                path={route.path}
                element={<route.component />}
                key={index}
              />
           
            ))
        })}

        {managerRoutes.map((route, index) => {
          return (
              (user?.role?.includes("MANAGER") && (
                <Route
                  path={route.path}
                  element={<route.component />}
                  key={index}
                />
              ))
           
            )
          }
        )}

        {waiterRoutes.map((route, index) => {
          return (
              (user?.role?.includes("WAITER") && (
                <Route
                  path={route.path}
                  element={<route.component />}
                  key={index}
                />
              ))
           
            )
          }
        )}

        {chefRoutes.map((route, index) => {
          return (
              (user?.role?.includes("CHEF") && (
                <Route
                  path={route.path}
                  element={<route.component />}
                  key={index}
                />
              ))
           
            )
          }
        )}

        {hostessRoutes.map((route, index) => {
          return (
              (user?.role?.includes("HOSTESS") && (
                <Route
                  path={route.path}
                  element={<route.component />}
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
