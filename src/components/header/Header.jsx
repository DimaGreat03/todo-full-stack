import { NavLink, useNavigate } from "react-router-dom";
import s from "./header.module.css";
import { useEffect, useState } from "react";


const Header = ({isAuth, setIsAuth}) => {
  let navigate = useNavigate()
  let removeToken = () => {
    localStorage.removeItem("token")
    setIsAuth(false)
    navigate("/")
  }

  const [items, setItems] = useState(["Корзина", "Разделы", "Журнал", "Календарь", "Входящие"])
  const [adressLink, setAdressLink] = useState(["deleted", "main", "/zhurnal", "/dead-line", "incoming"])
  const [id, setId] = useState(localStorage.getItem('currentPage'))


  return (

    <div className={s.container}>
      {
        isAuth ? 
        <div>
           {items.map((e, index) => {
            return <span className={id == index ? s.currentButton : s.button } onClick={() => {
              setId(index)
              navigate(adressLink[index])
              localStorage.setItem("currentPage", index)
            }}>{e}</span>
           })
          }
        </div>
        : 
        <NavLink to="/auth"> <button className={s.button}> авторизация</button></NavLink>
      }
    </div>
  );
};

export default Header;
