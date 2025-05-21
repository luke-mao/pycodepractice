import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
export const StoreContext = createContext();
export const ModalContext = createContext();

// Custom hook to use the store
export const useStore = () => useContext(StoreContext);
export const useModal = () => useContext(ModalContext);

// Store provider component
export const StoreProvider = ({ children }) => {
  // State for authentication and user information
  const [isLogin, setIsLogin] = useState(false);

  // the user info contains username, email, token, avatar, etc
  const [userInfo, setUserInfo] = useState(null);
  
  // State for loading from sessionStorage
  const [isLoading, setIsLoading] = useState(true);

  // modal state
  const [modal, setModal] = useState({
    show: false,
    title: "",
    body: "",
    okText: "OK",
    cancelText: "Cancel",
    showCancelButton: false,
    onOk: () => {},
    onCancel: () => {},
  });

  // Load data from sessionStorage on mount
  useEffect(() => {
    setIsLoading(true);
    const storedUserInfo = sessionStorage.getItem("userInfo");

    if (storedUserInfo) {
      setIsLogin(true);
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      setIsLogin(false);
    }

    setIsLoading(false);
  }, []);

  // Function to update user info and authentication state
  const updateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo);
    setIsLogin(true);
    sessionStorage.setItem("userInfo", JSON.stringify(newUserInfo));
  };

  // Function to clear store (e.g., on logout)
  const clearStore = () => {
    setIsLogin(false);
    setUserInfo(null);
    sessionStorage.removeItem("userInfo");
  };

  // Function to show modal
  const showModal = ({ title, body, okText, cancelText, showCancelButton, onOk, onCancel }) => {
    setModal({ 
      show: true, 
      title, 
      body, 
      okText, 
      cancelText, 
      showCancelButton, 
      onOk: () => {
        if (onOk) onOk();
        hideModal();
      } ,
      onCancel: () => {
        if (onCancel) onCancel();
        hideModal();
      } 
    });
  };

  const hideModal = () => {
    setModal({ ...modal, show: false });
  };

  return (
    <StoreContext.Provider 
      value={{ 
        isLogin, 
        userInfo, 
        isLoading, 
        updateUserInfo, 
        clearStore
      }}
    >
      <ModalContext.Provider value={{ showModal, hideModal, modal}}>
        {children}
      </ModalContext.Provider>
    </StoreContext.Provider>
  );
};
