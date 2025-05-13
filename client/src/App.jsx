import React from 'react'
// import dotenv from 'dotenv'
// dotenv.config()
import Navbar from './components/navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import ProductList from './pages/seller/ProductList'
import Orders from './pages/seller/Orders'
import Loading from './components/Loding'

const App = () => {

  const isSellerPath = useLocation().pathname.includes('seller');
  const {showUserLogin,isSeller} = useAppContext();
  return (
    <div className='text-default min-h-screen text-grey-700 bg-white'>
      {isSellerPath ? "" : <Navbar/>}
      {showUserLogin ? <Login/>:null}
      <Toaster/>
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-40"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/add-address" element={<AddAddress/>} />
          <Route path="/my-orders" element={<MyOrders/>} />
          <Route path="/loader" element={<Loading/>} />
          <Route path="/seller" element={isSeller ? <sellerLayout/> : <SellerLogin/>}>
            <Route index element={isSeller ? <AddProduct/> : null}/>
            <Route path="product-list" element={<ProductList/>}/>
            <Route path="orders" element={<Orders/>}/>
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer/>}
    </div>
  )
}

export default App
