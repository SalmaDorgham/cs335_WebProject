import './App.css';
import {Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";
import Home from './pages/Home'
import Contact from './pages/Contact'
import Account from './pages/Account'
import Cart from './pages/Cart'
import Product from './pages/Product'
import Error404 from './pages/Error404'
import Header from './components/Header';
import Footer from './components/Footer';
import Browse from './pages/Browse';
import Register from './pages/Register';
import Requests from './pages/Requests';
import { AuthProvider } from './context/AuthProvider';
import Trades from './pages/Trades';

function App() {
  return (
    <div className="Body">
      <AuthProvider >
        <Header />
        <div className='px-3 px-sm-4 px-md-5 px-lg-5'>
          <Routes>
            <Route path = '/' element={ <Home/> }/>
            <Route path = '/account' element={ <Account/> }/>
            <Route path = '/contact' element={ <Contact/> }/>
            <Route path = '/register' element={ <Register/> }/>
            <Route path = '/browse' element={ <Browse/> }/>
            <Route path = '/cart' element={ <Cart/> }/>
            <Route path = '/product/:id' element={ <Product/> }/>
            <Route path = '*' element={ <Error404/> }/>
            <Route path = '/requests' element={ <Requests/> }/>
            <Route path = '/trades' element={ <Trades/> }/>
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
