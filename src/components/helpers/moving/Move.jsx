import { useEffect, useState } from "react";
import { instance } from "../../api/axios.api";
import s from "./move.module.css";

const Move = ({ taskId, setWatcher }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    instance.get("/categories").then((data) => setData(data.data));
  }, []);

  const moveTo = (categoryId, boolean) => {
    instance
      .patch(`/transactions/transaction/${taskId}`, {
        incomingTask: boolean,
        category: categoryId,
        checkTask: false,
        inTodo: true,
      })
      .then(() => setWatcher("перерисовать страницу incoming"));
  };

  return (
    <div className={s.div}>
      {localStorage.getItem("currentPage") != 4 && (
        <span className={s.incoming} onClick={() => moveTo(null, true)}>incoming</span>
      )}
      {data.map((e) => {
        return (
          <li className={s.title} onClick={() => moveTo(e.id, false)}>
            {e.title !== localStorage.getItem("title") && e.title}
          </li>
        );
      })}
    </div>
  );
};

export default Move;
