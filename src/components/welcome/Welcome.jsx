import s from "./welcome.module.css";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.text}>
        Добро пожаловать , что бы воспользоваться сервисом нажми{" "}
        <Link to="/auth">
           <span>СЮДА</span>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
