import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInSide from './pages/common/Login/Login';
import SignUp from './pages/common/SignUp/SignUp';
import HomePage from './pages/common/HomePage/HomePage';
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { publicRoutes } from './routes';
import Page404 from './pages/common/Page404/Page404';
import Main from './components/adminComponent/Main';
axios.defaults.baseURL = "http://localhost:8080"

function App() {
  

  return (
    <BrowserRouter>
      <Routes>

        {publicRoutes.map((route, index) => {
          return (
            (route?.path.includes('/admin/dashboard'))?
              <Route path={route?.path} element={<route.component/>}>
                  <Route index element={<Main/>}/>
              </Route>
            :
              <Route
                path={route.path}
                element={<route.component />}
                key={index}
              />
           
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
