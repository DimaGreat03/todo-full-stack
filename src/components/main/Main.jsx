import { Link, useNavigate } from "react-router-dom";
import s from "./main.module.css";
import { useEffect, useState } from "react";
import { instance } from "../api/axios.api";
import dateFormat from "dateformat";


const Main = ({ setId }) => {
  const [list, setList] = useState([]);
  const [addList, setAddList] = useState("");
  const [watcher, setWatcher] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    instance.get("/categories").then((data) => setList(data.data));
  }, [watcher]);

  const addCategory = () => {
    instance
      .post("/categories", {
        title: addList,
        isActive: true,
      })
      .then((data) => setWatcher(!watcher));
  };

  const removeCategory = (id) => {
    instance
      .delete(`/categories/category/${id}`)
      .then((data) => setWatcher(!watcher));
  };

  const removeMany = () => {
    instance
     .delete("/categories/delete", {
       data: {ids: selectedIds}
     })
     .then((data) => setWatcher(!watcher))
     .catch(e => console.log(e))
 };

 function handleCheckboxChange(id) {

  if(selectedIds.includes(id)) {
    let newOne = selectedIds.filter(e => e !== id)
    setSelectedIds(newOne)
  } else {
    selectedIds.push(id)
  }
  setWatcher(!watcher)
}



  return (
    <div>
      <h1 className={s.h1}>Главная страница </h1>
      <div className={s.addPlitka}>
        <input
          className={s.input}
          value={addList}
          onChange={(e) => setAddList(e.target.value)}
          placeholder="начни новый день c плана"
        />
        <button
          className={s.buttonPlitka}
          disabled={addList == ""}
          onClick={() => addCategory()}
        >
          Добавить
        </button>
      </div>
      <hr className={s.hr} />
      <div className={s.wrapper}>
        
        {/* кнопка для мультиудаления */}
      <span className={!selectedIds.length? s.buttonDeleteForever : s.buttonDeleteForeverStart  } 
            onClick={() => removeMany() & setSelectedIds([])}
            disabled={!selectedIds.length}
      > 
          Удалить навсегда 
      </span>

        {list.length === 0
          ? "No have content in Main Page"
          : list.map((e) => {
              return (
                <li
                  className={s.li}
                  onClick={() => {
                    localStorage.setItem("user", e.id);
                    localStorage.setItem("title", e.title);
                    setId(e.id);
                  }}
                >
                    {/* инпут для выделения множества объектов с последующим удалением */}
                    <input      
                      value={e.id}
                      type="radio"
                      onChange={() => {}}
                      checked={selectedIds.includes(e.id)}
                      onClick={() => handleCheckboxChange(e.id)}
                     />  
                  <Link className={s.link} key={e.id} to={`/todo:${e.id}`}>
                  {e.title}
                  <div className={s.fromData}>from: {dateFormat(new Date(), "dd.mm")}</div>
                  </Link>
                  {/* <span className={s.delete} onClick={() => removeCategory(e.id)}>X</span> */}
                </li>
              );
            })}
      </div>
    </div>
  );
};

export default Main;
