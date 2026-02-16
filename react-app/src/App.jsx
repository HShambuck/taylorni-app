/*
  React conversion of the original Vue implementation.
  The Vue version is preserved in this repository.
*/

import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initializeStore } from "./store/slices/authSlice";
import { initializeCart } from "./store/slices/cartSlice";
import AppRoutes from "./routes";
import "./index.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize stores on app load
    dispatch(initializeStore());
    dispatch(initializeCart());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;