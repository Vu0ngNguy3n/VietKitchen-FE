import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInSide from './pages/common/Login/Login';
import SignUp from './pages/common/SignUp/SignUp';
import HomePage from './pages/common/HomePage/HomePage';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8080"

function App() {
  return (
   <BrowserRouter>
      <Routes>
        
          <Route 
            path='/'
            element={<HomePage/>}
          /> 
          <Route
            path='/login'
            element={<SignInSide/>}
          />
          <Route
            path='/signUp'
            element={<SignUp/>}
          />

      </Routes>
   </BrowserRouter>
  );
}

export default App;
