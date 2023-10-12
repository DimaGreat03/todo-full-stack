import { useEffect, useState } from "react";
import s from "./todo.module.css";
import { instance } from "../api/axios.api";
import Popup from "../popup/Popup";
import Calendary from "../calendar/Calendar";
import calendar from "./calendar.png";
import dateFormat, { masks } from "dateformat";
import { i18n } from "dateformat";
import SmallSkeleton from "../Skeleton/SkeletonSmall";
import noHave from "./assets/empty.png"


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
  const [isSkeleton, setIsSkeleton] = useState(true);

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

  const setDateForMainDiv = (untill) => {
    return (
       Math.floor((new Date(untill) - new Date()) / (24 * 60 * 60 * 1000)+1) <= 0
        ? untill? <span className={s.untill}>сегодня</span> : null
        : <>
          <span className={s.untill}> {untill !== null
          ? year !== dateFormat(untill, "yyyy")
          ? <>{dateFormat(untill, "yyyy")} </>  
          : <> {dateFormat(untill, "dd.mm")} </> 
          : null  }  </span>
          {/* <img width="25px" src={flag}/> */}
        </>
    )
  }
  
  useEffect(() => {
    let getUser = localStorage.getItem("user");
    instance
      .get(`/transactions/${getUser}/options?&limit=30&status=true&done=false`)
      .then((data) => setData(data.data) & setIsSkeleton(false));
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
            {/* подтягивание title туду листа с localStorage */}
            <h1 className={s.mainTitle}> {localStorage.getItem("title")} </h1>
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



      <div className={s.wrapper}>
        {/* метод map, для выставления задач  */}

        {isSkeleton ?  <SmallSkeleton/> : data.length === 0 && <span> <img className={s.emptyIcon} width="300px" src={noHave}/> <div className={s.descriptionEmpty}>Нет задач, но ты можешь добавить новую</div> </span>}

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
               
               {/* установка даты дедлайна в начале титла */}
               {setDateForMainDiv(e.untill)}

               {/* отрисовка титла */}
                  {e.title}
                  <div className={s.fromDate}>from: {dateFormat(new Date(), "dd.mm")}</div>
                </span>

                {/* кнопка удаления задачи из туду листа */}
                {/* <button
                  className={s.removeButton}
                  onClick={() =>removeTask(e.id, e.title, e.createdAd, e.createdAdTime)}
                >
                  x
                </button> */}


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
