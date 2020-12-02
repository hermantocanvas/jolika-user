import Cookies from "js-cookie";
import {
  REGISTER_SUCCESS,
  REGISTER_SOSMED_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  FACEBOOK_LOGIN_SUCCESS,
  GOOGLE_LOGIN_SUCCESS,
  LOGIN_FAIL,
  FACEBOOK_LOGIN_FAIL,
  GOOGLE_LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERROR,
  SET_LASTPRODUCTPAGE,
  FACEBOOK_NEW_REGISTER,
  GOOGLE_NEW_REGISTER,
  VERIFY_REGISTER_SUCCESS,
  VERIFY_REGISTER_FAIL,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case FACEBOOK_LOGIN_SUCCESS:
    case GOOGLE_LOGIN_SUCCESS:
      //put the token we have received, into cookie expired in 28 days
      Cookies.set("token", action.payload.token, { expires: 28 });
      //set localstorage
      localStorage.setItem("isLoggedIn", true);
      return {
        ...state,
        isAuthenticated: true,
      };
    case VERIFY_REGISTER_SUCCESS:
      return {
        ...state,
        registerSuccess: true,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registerDone: true,
      };
    case REGISTER_SOSMED_SUCCESS:
      //put the token we have received, into cookie expired in 28 days
      Cookies.set("token", action.payload.token, { expires: 28 });
      //set localstorage
      localStorage.setItem("isLoggedIn", true);
      return {
        ...state,
        facebookName: action.payload.facebookName,
        facebookEmail: action.payload.facebookEmail,
      };
    case FACEBOOK_NEW_REGISTER:
      return {
        ...state,
        facebookName: action.payload.facebookName,
        facebookEmail: action.payload.facebookEmail,
      };
    case GOOGLE_NEW_REGISTER:
      return {
        ...state,
        googleName: action.payload.googleName,
        googleEmail: action.payload.googleEmail,
      };
    case REGISTER_FAIL:
    case VERIFY_REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case FACEBOOK_LOGIN_FAIL:
    case GOOGLE_LOGIN_FAIL:
      //remove current cookies token
      Cookies.remove("token");
      //remove local storage
      localStorage.removeItem("isLoggedIn");
      //remove facebook token
      if (window.FB) {
        window.FB.logout();
      }

      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: action.payload,
        lastProductPage: null,
        facebookName: null,
        facebookEmail: null,
        googleName: null,
        googleEmail: null,
      };
    case LOGOUT:
      //remove current cookies token
      Cookies.remove("token");

      //remove local storage
      localStorage.removeItem("isLoggedIn");

      console.log(window.FB);

      //remove facebook token
      if (window.FB) {
        window.FB.logout();
      }

      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
        lastProductPage: null,
        facebookName: null,
        facebookEmail: null,
        googleName: null,
        googleEmail: null,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case SET_LASTPRODUCTPAGE:
      return {
        ...state,
        lastProductPage: action.payload,
      };
    default:
      return state;
  }
};
