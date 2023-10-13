import { useState } from "react";
import s from "./auth.module.css";
import { instance } from "../api/axios.api";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import icon from "./assets/errorIcon.png";
import loading from "./assets/loadingPopup.gif";

const Auth = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regOrLog, setRegOrLog] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();

  const registrationHandler = async () => {
    await instance
      .post("/user", { email: email, password: password })
      .then((data) => {
        data.status === 201 &&
          toast.success("поздравляю чудик - ты создал аккаунт");
        setIsLoading(false);
      })
      .catch((error) => {
        error.response
          ? error.response.data.message === "This email already exist"
            ? toast.error(error.response.data.message)
            : toast.error(error.response.data.message[0])
          : setIsError(!isError);
        setIsLoading(false);
      });
  };

  const loginHandler = async () => {
    await instance
      .post("auth/login", { email: email, password: password })
      .then((data) => {
        localStorage.setItem("token", data.data.token);
        setIsAuth(true);
        navigate("/incoming");
        setIsLoading(false);
        toast.success("пользуйся")
      })
      .catch((error) => {
        error.response
          ? toast.error(error.response.data.message)
          : setIsError(!isError);
        setIsLoading(false);
      });
  };

  return (
    <div className={s.Auth}>
      {isError ? (
        <div className={s.error}>
          Скорее всего создатель проекта снова забыл оставить сервер включенным
          и где нибудь чудит сейчас
          <p>
            <img src={icon} className={s.iconError} />
          </p>
          <button
            className={s.buttonClose}
            onClick={() => setIsError(!isError)}
          >
            закройся
          </button>
        </div>
      ) : (
        <div>
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
            <button
              className={s.button}
              onClick={() => {
                regOrLog ? loginHandler() : registrationHandler();
                setIsLoading(true);
              }}
            >
              Let's go
            </button>
            <div>
              {isLoading && (
                "...не чуди"
              )}
            </div>

            <div className={s.span}>
              Или нажмите
              <span className={s.zdes} onClick={() => setRegOrLog(!regOrLog)}>
                здесь
              </span>
              для {regOrLog ? "регистрации" : "авторизации"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
