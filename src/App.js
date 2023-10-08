import { Route, Routes, useNavigate } from "react-router";
import "./App.css";
import Header from "./components/header/Header";
import Main from "./components/main/Main";
import Auth from "./components/auth/Auth";
import DeletedTasks from "./components/deletedTasks/DeletedTasks";
import { useEffect, useState } from "react";
import { instance } from "./components/api/axios.api";
import LoadingPage from "./components/loagingPage/LoadingPage";
import PrivateRouts from "./components/private-routes/PrivateRouters";
import Todo from "./components/todolist/Todo";
import Zhurnal from "./components/zhunal/Zhurnal";
import DeadLine from "./components/deadLine/DeadLine";
import Incoming from "./components/incomingTask/Incoming";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [todoId, setId] = useState("");
  const getUserFromLocalStorage = localStorage.getItem("user");
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = await localStorage.getItem("token");
    try {
      if (token) {
        const data = await instance.get("/auth/profile");
        if (data) {
          setIsAuth(true);
        } else {
          console.log("нету токена");
        }
      }
    } catch (error) {
      console.log(error)
      console.log("mistake")
      navigate("/auth")
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <Header isAuth={isAuth} setIsAuth={setIsAuth} />
      <Routes>
        {isAuth 
          ? 
          <Route element={<PrivateRouts isAuth={isAuth} />}>
            <Route path="/main" element={<Main setId={setId} />} />
            <Route path="/deleted" element={<DeletedTasks />} />
            <Route path={`todo:${getUserFromLocalStorage}`} element={<Todo />}/>
            <Route path="/zhurnal" element={<Zhurnal />} />
            <Route path="/dead-line" element={<DeadLine />} />
            <Route path="/incoming" element={<Incoming />} />
          </Route>
          : 
          <>
            <Route path="/initial" element={<LoadingPage />} />
            <Route path="/auth" element={<Auth setIsAuth={setIsAuth} />} />
          </>
        }
      </Routes>
    </div>
  );
}

export default App;
