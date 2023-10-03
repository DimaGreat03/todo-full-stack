import { useEffect, useState } from "react";
import s from "./auth.module.css";
import { instance } from "../api/axios.api";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Auth = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regOrLog, setRegOrLog] = useState(true);

  let navigate = useNavigate();

  const registrationHandler = async () => {
    await instance
      .post("/user", { email: email, password: password })
      .then((data) => data.status === 201 && toast.success("поздравляю чудик - ты создал аккаунт"))
      .catch((error) => 
         error.response.data.message === 'This email already exist'
           ? toast.error(error.response.data.message)
           : toast.error(error.response.data.message[0]));
  };

  const loginHandler = async () => {
    await instance
      .post("auth/login", { email: email, password: password })
      .then((data) => {
        localStorage.setItem("token", data.data.token);
        setIsAuth(true);
        navigate("/incoming");
        console.log(data)
      })
      .catch((error) => toast.error(error.response.data.message));
  };

  return (
    <div className={s.Auth}>
      <h1>{regOrLog ? "Авторизация" : "Регистрация"}</h1>
      <div>
        <input
          className={s.input1}
          placeholder="Email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div />
        <input
          className={s.input}
          placeholder="password"
          type="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div />
        <button className={s.button}
          onClick={() => {
            regOrLog ? loginHandler() : registrationHandler()}}>
          Let's go
        </button>

        <div className={s.span}>
           Или нажмите 
           <span className={s.zdes} 
                 onClick={() => setRegOrLog(!regOrLog)}> здесь </span>
           для {regOrLog? "регистрации" : "авторизации"}
        </div>
      </div>
    </div>
  );
};

export default Auth;
