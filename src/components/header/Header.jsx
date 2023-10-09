import { NavLink, useNavigate } from "react-router-dom";
import s from "./header.module.css";
import { useEffect } from "react";


const Header = ({isAuth, setIsAuth}) => {

  let navigate = useNavigate()
  let removeToken = () => {
    localStorage.removeItem("token")
    setIsAuth(false)
    navigate("/")
  }


  return (

    <div className={s.wrapperHeader}>
      {
        isAuth ? 
        <div>
           <NavLink to="/deleted" className={active => active.isActive? s.button : s.button}>Корзина</NavLink>
           <NavLink to={"/main"} className={active => active.isActive? s.button : s.button}>Разделы</NavLink>
           <NavLink to="/zhurnal" className={active => active.isActive? s.button : s.button}>Журнал</NavLink>
           <NavLink to="/dead-line" className={active => active.isActive? s.button : s.button}>Календарь</NavLink>
           <NavLink to="/incoming" className={active => active.isActive? s.button : s.button}>Входящие</NavLink>
           <button className={s.buttonDel}>выход</button>

        </div>
        : 
        <NavLink to="/auth"> <button className={s.button}> авторизация</button></NavLink>
      }
    </div>
  );
};

export default Header;
