import { useEffect, useState } from "react";
import s from "./deleted.module.css";
import { instance } from "../api/axios.api";
import useSound from "use-sound";
import close from "./assets/close.mp3";
import Popup from "../popup/Popup"
import dateFormat from "dateformat";

const DeletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [watcher, setWatcher] = useState(false);
  const [playDeleteTask] = useSound(close);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popId, setPopId] = useState("");
  const [li, setLi] = useState(false);
  const [inputId, setInputId] = useState("")
  const [checkInput, setCheckInput] = useState(true)
  const [selectedIds, setSelectedIds] = useState([]);



  useEffect(() => {
    instance
      .get(`/transactions/options?status=false&done=false`)
      .then((data) => setTasks(data.data) & console.log(data));
  }, [watcher]);

  const returnTask = (id, boolean) => {
    instance
      .patch(`/transactions/transaction/${id}`, {
        isActive: true,
        incomingTask: boolean,
      })
      .then(() => setWatcher(!watcher));
  };

  const deleteTask = (id) => {
    instance
      .delete(`/transactions/transaction/${id}`)
      .then((data) => setWatcher(!watcher))
      .then(() => playDeleteTask());
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

  const removeMany = () => {
    instance
     .delete("/transactions/delete", {
       data: {ids: selectedIds}
     })
     .then((data) => setWatcher(!watcher))
     .catch(e => console.log(e))
 };

  return (
    <div>

    <h1 className={s.h1}>Корзина</h1>

      <hr />

      <div className={s.wrapper}>
      <span className={!selectedIds.length? s.buttonDeleteForever : s.buttonDeleteForeverStart  } 
                onClick={() => removeMany() &setSelectedIds([])}
                disabled={!selectedIds.length}
                > 
                Удалить навсегда 
        </span>
        {/* метод map, для выставления задач  */}
        {tasks.map((e) => {
          return (
            <div key={e.id}>
              {/* начало отрисовывания Li-шки */}
              <li
                key={e.id}
                className={li ? (popId == e.id ? s.li : s.li2) : s.li2}
              >

                {/* отрисовка инпута и установка ему id */}
                <input
                 type="checkbox"
                   checked={e.id !== inputId && checkInput}
                   onChange={() => e.id == inputId}
                   onClick={() => setInputId(e.id) & returnTask(e.id, e.category? false : true)
                   }
                 />

                  {/*  мультиудаление */}
                  <input      
                    value={e.id}
                    type="radio"
                    onChange={() => {}}
                    checked={selectedIds.includes(e.id)}
                    onClick={() => handleCheckboxChange(e.id)}
                   />  

                  {/* отрисовка title  */}
                
                <span
                  className={s.title}
                  onClick={() => {
                    setLi(!li);
                    setPopId(e.id);
                    setIsPopupOpen(!isPopupOpen);
                    localStorage.setItem("popId", e.id);
                    localStorage.setItem("text", e.notes)
                  }}
                >
                  {e.title} 
                </span>
                <button className={s.button} onClick={() => deleteTask(e.id)}> X </button>

                {/* Кнопка времени */}
                <span
                  className={s.time}
                >
                  {dateFormat(e.createdAt, "mmmm d")}
                </span>
                {/* выдвижная навигация для Popup и сложный css для выделения фона при нажатии */}
                {isPopupOpen &&
                  (isPopupOpen ? (
                    e.id == popId ? (
                      <div>
                        <Popup setWatcher={setWatcher} watcher={watcher}/>
                      </div>
                    ) : null
                  ) : null)}
              </li>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeletedTasks;
