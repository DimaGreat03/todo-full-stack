import { Link, NavLink, useNavigate } from "react-router-dom";
import s from "./header.module.css";
import { useEffect, useState } from "react";


const Header = ({isAuth, setIsAuth}) => {
  const [currentPage, setCurrentPage] = useState(localStorage.getItem('currentPage'))

  let navigate = useNavigate()
  let removeToken = () => {
    localStorage.removeItem("token")
    setIsAuth(false)
    navigate("/")
  }

  useEffect(() => {
    console.log('change localStorage')
  }, [localStorage.getItem("currentPage")])

  return (

    <div className={s.wrapperHeader}>
      {
        isAuth ? 
        <div>
           <button className={s.button} onClick={() => removeToken() || navigate('/auth')}>выход</button>
           <NavLink to="/deleted" className={active => active.isActive? s.currentButton : s.button}>Корзина</NavLink>
           <NavLink to={"/main"} className={active => active.isActive? s.currentButton : s.button}>Разделы</NavLink>
           <NavLink to="/zhurnal" className={active => active.isActive? s.currentButton : s.button}>Журнал</NavLink>
           <NavLink to="/dead-line" className={active => active.isActive? s.currentButton : s.button}>Календарь</NavLink>
           <NavLink to="/incoming" className={active => active.isActive? s.currentButton : s.button}>Входящие</NavLink>
        </div>
        : 
        <NavLink to="/auth"> <button className={s.button}> авторизация</button></NavLink>
      }
    </div>
  );
};

export default Header;
