import React from "react";
import { useDispatch, useSelector } from "react-redux";

function Login() {
  const state = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const changeUserName = () => {
    dispatch()
  };
  return (
    <>
      <div>userInfo: {state.userInfo}</div>
      <button>change user name</button>
    </>
  );
}

export default Login;
