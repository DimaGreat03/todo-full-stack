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


const Incoming = () => {
  const [data, setData] = useState([]);
  const [watcher, setWatcher] = useState(false);
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
    "воскресенте",
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
  

  const [play] = useSound(sound);
  let day = new Date()

  const date = (data) => {
    return dateFormat(data, "dddd, mmmm d, yyyy")
  }

  const year = dateFormat(new Date(), "yyyy")


  useEffect(() => {
    instance
      .get(`/transactions/incoming`)
      .then((data) => setData(data.data))
  }, [watcher]);

  const addCategory = () => {
    instance
      .post("/transactions", {
        title: addTask,
        category: null,
        isCheck: false,
        isActive: true,
        isDone: false,
        untill: null,
        isDeadLine: false,
        lastCheck: false,
        incomingTask: true,
        notes: "notes"
      })
      .then((data) => setWatcher(!watcher));
  };

  const updateStatus = (id, isCheck) => {
    setTimeout(() => {
      instance
        .patch(`/transactions/transaction/${id}`, {
          isCheck: !isCheck,
          isActive: false,
          isDone: true,
          incomingTask: false
        })
        .then((data) => setWatcher(!watcher) & play());
    }, 250);
  };

  const removeTask = (id) => {
    instance
      .patch(`/transactions/transaction/${id}`, {
        incomingTask: false,
        isActive: false
      })
      .then((data) => setWatcher(!watcher));
  };

  const clearDate = (id) => {
    instance
      .patch(`/transactions/transaction/${id}`, {
        untill: null,
        isDeadLine: false
      })
      .then(() => setWatcher(!watcher));
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
        onClick={(e) => addCategory()}
      >
        добавить
      </button>

      <hr />

      {/* подтягивание title туду листа с localStorage */}
      {/* <span className={s.mainTitle}> {localStorage.getItem("title")} </span> */}
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
                    setId(e.id);
                    setSwitch(false)
                    localStorage.setItem("text", e.notes)
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
                        {switcH?  <Calendary id={e.id} data={e.untill} watcher={watcher} setWatcher={setWatcher}/>  :  <Popup setWatcher={setWatcher} watcher={watcher}/>}    
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

export default Incoming;
