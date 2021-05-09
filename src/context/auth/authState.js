import React, { useReducer } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import AuthContext from "./authContext";
import AuthReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";
import {
  REGISTER_SUCCESS,
  REGISTER_SOSMED_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_FAIL,
  GOOGLE_LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_ERROR,
  SET_LASTPRODUCTPAGE,
  FACEBOOK_NEW_REGISTER,
  GOOGLE_NEW_REGISTER,
  VERIFY_REGISTER_SUCCESS,
  VERIFY_REGISTER_FAIL,
} from "../types";

const AuthState = (props) => {
  const initialState = {
    isAuthenticated: false,
    user: null,
    error: null,
    lastProductPage: null, //last product page visited by user
    facebookName: null,
    facebookEmail: null,
    googleName: null,
    googleEmail: null,
    registerDone: false,
    registerSuccess: false,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  //Register new user from normal form
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/auth/register`,
        formData,
        config
      );
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data,
      });
    }
  };

  //Register new user from Sosmed
  const registerSosmed = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/auth/register-sosmed`,
        formData,
        config
      );
      dispatch({
        type: REGISTER_SOSMED_SUCCESS,
        payload: res.data,
      });
      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data,
      });
    }
  };

  //Login User
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/auth/login`,
        formData,
        config
      );

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data,
      });
    }
  };

  //Facebook Login User
  const facebookLogin = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/auth/login/facebook`,
        formData,
        config
      );

      if (res.data.token) {
        dispatch({
          type: FACEBOOK_LOGIN_SUCCESS,
          payload: res.data,
        });
        loadUser();
      } else {
        dispatch({
          type: FACEBOOK_NEW_REGISTER,
          payload: {
            facebookName: formData.name,
            facebookEmail: formData.email,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: FACEBOOK_LOGIN_FAIL,
        payload: err.response.data,
      });
    }
  };

  //Facebook Login User
  const googleLogin = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/auth/login/facebook`,
        formData,
        config
      );

      if (res.data.token) {
        dispatch({
          type: GOOGLE_LOGIN_SUCCESS,
          payload: res.data,
        });
        loadUser();
      } else {
        dispatch({
          type: GOOGLE_NEW_REGISTER,
          payload: {
            googleName: formData.name,
            googleEmail: formData.email,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: FACEBOOK_LOGIN_FAIL,
        payload: err.response.data,
      });
    }
  };

  //Verify registration
  const verifyRegistration = async (token) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/auth/verifyregistertoken/${token}`
      );

      if (res.data.token) {
        dispatch({
          type: VERIFY_REGISTER_SUCCESS,
          payload: res.data,
        });
        // loadUser();
      }
    } catch (err) {
      dispatch({
        type: VERIFY_REGISTER_FAIL,
        payload: err.response.data,
      });
    }
  };

  //Load User
  const loadUser = async () => {
    //load token into global axios header
    if (Cookies.get("token")) {
      setAuthToken(Cookies.get("token"));
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_APIURL}api/v1/auth/me`
        );

        dispatch({
          type: USER_LOADED,
          payload: res.data.data,
        });
      } catch (err) {
        dispatch({
          type: AUTH_ERROR,
        });
      }
    }
  };

  //Logout User
  const logout = () => {
    dispatch({
      type: LOGOUT,
    });
  };

  //Clear Error
  const clearErrors = () =>
    dispatch({
      type: CLEAR_ERROR,
    });

  //Save last product page
  const setLastProductPage = (page) => {
    //dispatch to reducer
    dispatch({
      type: SET_LASTPRODUCTPAGE,
      payload: page,
    });
  };

  //return a provider, so we can wrap our application with this context
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        currentUser: state.user,
        error: state.error,
        registerDone: state.registerDone,
        registerSuccess: state.registerSuccess,
        register,
        registerSosmed,
        clearErrors,
        loadUser,
        login,
        facebookLogin,
        googleLogin,
        logout,
        lastProductPage: state.lastProductPage,
        setLastProductPage,
        facebookName: state.facebookName,
        facebookEmail: state.facebookEmail,
        googleName: state.googleName,
        googleEmail: state.googleEmail,
        verifyRegistration,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
