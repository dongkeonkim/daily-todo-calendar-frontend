import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import User from './pages/User';
import LoginContextProvider from './contexts/LoginContextProvider';
import UserChange from './pages/UserChange';
import UserLeave from './pages/UserLeave';
import PrivateRoute from './components/Auth/PrivateRoute';
import { AlertProvider } from './contexts/AlertContext'; // AlertProvider 추가

function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <LoginContextProvider>
          <div className='flex flex-col min-h-screen'>
            <Header />
            <div className='flex-grow'>
              <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/join' element={<Join />}></Route>

                <Route
                  path='/user'
                  element={
                    <PrivateRoute>
                      <User />
                    </PrivateRoute>
                  }
                />

                <Route
                  path='/user/changeMember'
                  element={
                    <PrivateRoute>
                      <UserChange />
                    </PrivateRoute>
                  }
                />

                <Route
                  path='/user/leaveMember'
                  element={
                    <PrivateRoute>
                      <UserLeave />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </LoginContextProvider>
      </AlertProvider>
    </BrowserRouter>
  );
}

export default App;
