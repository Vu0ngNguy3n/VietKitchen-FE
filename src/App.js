import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInSide from './pages/common/Login/Login';
import SignUp from './pages/common/SignUp/SignUp';
import HomePage from './pages/common/HomePage/HomePage';
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
axios.defaults.baseURL = "http://localhost:8080"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path='/'
          element={<HomePage />}
        />
        <Route
          path='/login'
          element={<SignInSide />}
        />
        <Route
          path='/signUp'
          element={<SignUp />}
        />

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
