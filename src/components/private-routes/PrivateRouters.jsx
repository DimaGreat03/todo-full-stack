import { Navigate, Outlet } from "react-router";

const PrivateRouts = () => {

  let token = localStorage.getItem("token")

  return token ? <Outlet /> : <Navigate to="/auth"/> ;
};

export default PrivateRouts;
