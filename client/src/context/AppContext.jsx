import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { dummyProducts } from "../assets/assets";
import { toast } from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [isSeller, setIsSeller] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  //fetch seller status
  const fetchSellerStatus = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  //fetch user auth status , user data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      } else {
        setUser(false);
        setCartItems({});
      }
    } catch (error) {
      setUser(null);
      setCartItems({});
    }
  };

  //fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added To Cart");
  };

  //update cart item

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  //remove product from cart

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed From Cart");
    setCartItems(cartData);
  };

  //get cart items count
  const getCartCount = () => {
    let count = 0;
    for (const items in cartItems) {
      count += cartItems[items];
    }
    return count;
  };

  //get cart total price
  const getCartAmount = () => {
    let totalPrice = 0;
    for (const items in cartItems) {
      let product = products.find((item) => item._id === items);
      if (cartItems[items] > 0 && product) {
        totalPrice += product.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalPrice * 100) / 100;
  };

  useEffect(() => {
    fetchUser();
    fetchProducts();
    fetchSellerStatus();
  }, []);

  // update cart items
  useEffect(() => {
  const updateCart = async () => {
    try {
      const { data } = await axios.post("/api/cart/update", {
        userId: user._id,  // pass userId from the user object
        cartItems,
      });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
    if (user) {
      updateCart();
    }
}, [cartItems]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    setCartItems,
    toast
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
