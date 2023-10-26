import { NavLink, useNavigate } from "react-router-dom";
import s from "./header.module.css";


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
        <nav  className={s.nav}>
           <NavLink to="/" onClick={() => setIsAuth(!isAuth) & removeToken()} className={active => active.isActive? s.currentButton : s.button}>🔐 выход</NavLink>
           <NavLink to={"/notes"} className={active => active.isActive? s.currentButton : s.button}>🗂 Notes</NavLink>  
           <NavLink to={"/main"} className={active => active.isActive? s.currentButton : s.button}>🗂 Разделы</NavLink>
           <NavLink to="/zhurnal" className={active => active.isActive? s.currentButton : s.button}>📒 Журнал</NavLink>
           <NavLink to="/dead-line" className={active => active.isActive? s.currentButton : s.button}>📅 Календарь</NavLink>
           <NavLink to="/incoming" className={active => active.isActive? s.currentButton : s.button}>📂 Входящие</NavLink>
        </nav>
        : null
        // <NavLink to="/auth"> <button className={s.button}> авторизация</button></NavLink>
      }
    </div>
  );
};

export default Header;
