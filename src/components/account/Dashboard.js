import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const user = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/users/getuserdetail`
      );
      setUserData(user.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (!userData) return null;
  return (
    <>
      <h1>Dashboard</h1>
      <hr />
      <h3>Hello {userData.name}</h3><p>Welcome to Jolika Dashboard.</p>
    </>
  );
};

export default Dashboard;
