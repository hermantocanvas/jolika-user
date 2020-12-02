import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    //set token to axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;
