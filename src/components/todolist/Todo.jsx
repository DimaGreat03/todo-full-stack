import { useEffect, useState } from "react";
import s from "./todo.module.css";
import { instance } from "../api/axios.api";
import useSound from "use-sound";
import sound from "./close.mp3";
import Popup from "../popup/Popup";
import Calendary from "../calendar/Calendar";
import calendar from "./calendar.png";
import flag from "./flag.png"
import dateFormat, { masks } from "dateformat";
import { i18n } from "dateformat";


const Todo = () => {
  const [data, setData] = useState([]);
  const [watcherT, setWatcherT] = useState("");
  const [addTask, setAddTask] = useState("");
  const [switchId, setSwitchId] = useState("");
  const [switcH, setSwitch] = useState(false);
  const [popId, setPopId] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [id, setId] = useState("");
  const [li, setLi] = useState(false);

  i18n.dayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
  ];
  i18n.monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнт",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const year = dateFormat(new Date(), "yyyy")


  useEffect(() => {
    let getUser = localStorage.getItem("user");
    instance
      .get(`/transactions/${getUser}/options?&limit=30&status=true&done=false`)
      .then((data) => setData(data.data));
      localStorage.setItem("currentPage", 2)
  }, [watcherT]);

  const addCategory = () => {
    instance
      .post("/transactions", {
        title: addTask,
        category: localStorage.getItem("user"),
        isCheck: false,
        isActive: true,
        isDone: false,
        untill: null,
        isDeadLine: false,
        lastCheck: false,
        incomingTask: false,
      })
      .then((data) => setWatcherT(!watcherT));
  };

  const updateStatus = (id, isCheck) => {
    setTimeout(() => {
      instance
        .patch(`/transactions/transaction/${id}`, {
          isCheck: !isCheck,
          isActive: false,
          isDone: true,
        })
        .then((data) => setWatcherT(!watcherT));
    }, 250);
  };

  const removeTask = (id, title, day, time) => {
    instance
      .patch(`/transactions/transaction/${id}`, {
        isActive: false,
      })
      .then((data) => setWatcherT(!watcherT));
  };

  const clearDate = (id) => {
    instance
      .patch(`/transactions/transaction/${id}`, {
        untill: null,
        isDeadLine: false
      })
      .then(() => setWatcherT(!watcherT));
  }

  return (
    <div>
      {/* инпут для написания задачи */}
      <input
        className={s.input}
        value={addTask}
        onChange={(e) => setAddTask(e.target.value)}
        placeholder="напиши свою задачу"
      />

      {/* кнопка для отправки задачи на сервер */}
      <button
        className={s.button}
        disabled={addTask == ""}
        onClick={() => addCategory()}
      >
        добавить
      </button>

      <hr />

      {/* подтягивание title туду листа с localStorage */}
      <span className={s.mainTitle}> {localStorage.getItem("title")} </span>

      <div className={s.wrapper}>
        {/* метод map, для выставления задач  */}
        {data.map((e) => {
          return (
            <div>
              {/* начало отрисовывания Li-шки */}
              <li
                key={e.id}
                className={li ? (popId == e.id ? s.li : s.li2) : s.li2}
              >
                {/* checkbox задачи */}
                <input
                  className={s.checkbox}
                  type="checkbox"
                  onClick={() => updateStatus(e.id, e.isCheck)}
                />

                {/* title туду листа с сервера а так же установка id Popup */}
              {/* <span className={s.untill}>  {e.untill === null ? e.untill : e.untill.substring()}</span> */}
                <span
                  className={s.title}
                  onClick={() => {
                    setLi(!li);
                    setPopId(e.id);
                    setIsPopupOpen(!isPopupOpen);
                    localStorage.setItem("popId", e.id);
                    localStorage.setItem("text", e.notes)
                    setId(e.id);
                    setSwitch(false)
                  }}
                >
                  {e.title}
                </span>

                {/* кнопка удаления задачи из туду листа */}
                <button
                  className={s.removeButton}
                  onClick={() =>removeTask(e.id, e.title, e.createdAd, e.createdAdTime)}
                >
                  x
                </button>

                {/* отображение года и даты в зависимости от текущей даты, сложная логика */}
                <span className={s.untill}> {e.untill !== null? year !== dateFormat(e.untill, "yyyy")? <><img width="25px" src={flag} />  {dateFormat(e.untill, "yyyy")} </>  : <> <img width="25px" src={flag}/> {dateFormat(e.untill, "mmmm d")} </> : null  }  </span>


                {/* Кнопка времени, при нажатии на которую происходит switch */}
                {/* <span
                  className={s.time}
                  onClick={() => setSwitch(!switcH) & setSwitchId(e.id)}
                >
                  {switcH
                    ? switchId == e.id
                      ? e.createdAdTime
                      : e.createdAd
                    : e.createdAd}
                </span> */}
                {/* выдвижная навигация для Popup и сложный css для выделения фона при нажатии */}
                {isPopupOpen &&
                  (isPopupOpen ? (
                    e.id == popId ? (
                    
                      <div>
                        {switcH?  <Calendary id={e.id} data={e.untill} watcher={watcherT} setWatcher={setWatcherT}/>  :  <Popup setWatcher={setWatcherT} watcher={watcherT}/>}    
                         <img className={s.calendar} onClick={() =>setSwitch(!switcH) } width="35px" src={calendar}/> 
                         {e.untill && dateFormat(e.untill, " dddd, mmmm d") } 
                         {e.untill && <span className={s.clear2} onClick={() => clearDate(e.id)}>clear</span>}
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

export default Todo;
