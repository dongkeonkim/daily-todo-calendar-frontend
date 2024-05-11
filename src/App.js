import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import { Home } from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import User from './pages/User';
import LoginContextProvider from './contexts/LoginContextProvider';

function App() {
  return (
    <BrowserRouter>
      <LoginContextProvider>
        <Header />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/join' element={<Join />}></Route>
          <Route path='/user' element={<User />}></Route>
        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  );
}

export default App;
