import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './components/pages/Home';
import Login from './components/pages/Login';
import Join from './components/pages/Join';
import User from './components/pages/User';
import About from './components/pages/About';
import LoginContextProvider from './contexts/LoginContextProvider';

function App() {
  return (
    <BrowserRouter>
      <LoginContextProvider>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/join' element={<Join />}></Route>
          <Route path='/user' element={<User />}></Route>
          <Route path='/about' element={<About />}></Route>
        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  );
}

export default App;
