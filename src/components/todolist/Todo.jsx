import { useEffect, useState} from "react";
import { useNavigate } from "react-router";
import s from "./todo.module.css";
import { instance } from "../api/axios.api";
import Popup from "../popup/Popup";
import Calendary from "../calendar/Calendar";
import calendar from "./assets/calendar.png";
import dateFormat, { masks } from "dateformat";
import { i18n } from "dateformat";
import SmallSkeleton from "../Skeleton/SkeletonSmall";
import noHave from "./assets/empty.png"
import runningMan from "./assets/preloader.gif"
import Move from "../helpers/moving/Move";
import accept from "./assets/accept.png"


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
  const [isRunMan, setIsRunMan] = useState(false)
  const [move, setMove] = useState(false)
  const [menu, setMenu] = useState(["активные ", ' завершенные '])
  const [checkTask, setCheckTask] = useState(false)
  const [filterId, setFilterId] = useState(0)
  const [goldenTouch, setGoldenTouch] = useState(false)
  const [touchId, setTouchId] = useState("")
  const [selectedIds, setSelectedIds] = useState([]);
  let navigate = useNavigate()
  const year = dateFormat(new Date(), "yyyy")

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


  useEffect(() => {
    let getUser = localStorage.getItem("user");
    instance
      .get(`/transactions/${getUser}/todo`)
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
        checkTask: false,
        inTodo: true,
      })
      .then((data) => setWatcherT(!watcherT) & setIsRunMan(false));
  };

  const updateStatus = (id, isCheck, boolean, isDone, isDeadLine) => {
    setTimeout(() => {
      instance
        .patch(`/transactions/transaction/${id}`, {
          isCheck: false,
          checkTask: true,
          isDone: true,
          isActive: false,
        })
        .then((data) => setWatcherT(!watcherT));
    }, 250);
  };

  const updateImg = (id) => {
    setTimeout(() => {
      instance
        .patch(`/transactions/transaction/${id}`, {
          isCheck: false,
          checkTask: false,
          isDone: false,
          isActive: true,
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

  function handleCheckboxChange(id) {

    if(selectedIds.includes(id)) {
      let newOne = selectedIds.filter(e => e !== id)
      setSelectedIds(newOne)
    } else {
      selectedIds.push(id)
    }
    setWatcherT(!watcherT)
  }

  const removeMany = () => {
    instance
     .delete("/transactions/delete", {
       data: {ids: selectedIds}
     })
     .then((data) => setWatcherT(!watcherT))
     .catch(e => console.log(e))
 };


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
        onClick={() => addCategory() & setIsRunMan(true)}
       >
        +
       </button>

       {isRunMan? <img src={runningMan} className={s.runMan}/> : <button className={s.button} onClick={() => navigate("/main")}>назад</button> }
       <hr />

      <div className={s.wrapper}>
        {/* метод map, для выставления задач  */}


    {/* меню на выбор АКТИВНЫЕ или ЗАВЕРШЕННЫЕ */}
      {data.length !== 0 && <div className={s.fil}>
        {!isSkeleton && menu.map((e, i) => {
          return <span className={i == filterId? s.filter : s.filter2} onClick={() => setCheckTask(i == 0 && false || i == 1 && true || i == 2 && null) & setFilterId(i) & setGoldenTouch(!goldenTouch) & setTouchId("")}>
            <span className={s.textFilter}>{e}</span>
           </span>
         }
        )}
      </div>}

    {/* кнопка для мультиудаления */}
      {data.length !== 0 && <span className={!selectedIds.length? s.buttonDeleteForever : s.buttonDeleteForeverStart  } 
            onClick={() => removeMany() & setSelectedIds([])}
            disabled={!selectedIds.length}
      > 
          Удалить навсегда 
      </span>}

        {isSkeleton 
          ?  <SmallSkeleton/> 
          : data.length === 0 
            && <span> 
                 <img className={s.emptyIcon} width="300px" src={noHave}/> 
                 <div className={s.descriptionEmpty}>Нет задач, но ты можешь добавить новую</div> 
               </span>
        }

      
        {data.map((e) => {
          return (
            <div>
              {/* начало отрисовывания Li-шки */}
             {e.checkTask == checkTask && 
              <li
                key={e.id}
                className={li ? (popId == e.id ? s.li : s.li2) : s.li2}
              >
                {/* checkbox задачи */}
                

                {
                  e.checkTask
                    ? <img 
                      onClick={() => updateImg(e.id, e.isCheck, e.checkTask, e.isDone, e.isDeadLine) & setGoldenTouch(true) & setTouchId(e.id)} 
                      src={accept} width="25px"
                      className={e.id == touchId && goldenTouch? s.acceptIcon2 : s.acceptIcon}/> 
                    : <><input
                         className={s.checkbox}
                         type="checkbox"
                         onClick={() => updateStatus(e.id, e.isCheck, e.checkTask, e.isDone, e.isDeadLine)}
                      />
                        <input  
                        className={s.multyInput}   
                        value={e.id}
                        type="radio"
                        onChange={() => {}}
                        checked={selectedIds.includes(e.id)}
                        onClick={() => handleCheckboxChange(e.id)}
                       /> 
                      </> 
                }
                

                {/* title туду листа с сервера а так же установка id Popup */}
              {/* <span className={s.untill}>  {e.untill === null ? e.untill : e.untill.substring()}</span> */}
                <span
                  className={e.checkTask? s.title2 : s.title}
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
               {!e.isCheck && setDateForMainDiv(e.untill)}

               {/* отрисовка титла */}
                  {e.title}
                  <div className={s.fromDate}>from: {dateFormat(new Date(), "dd.mm")}</div>
                </span>

                {isPopupOpen &&
                  (isPopupOpen ? (
                    e.id == popId ? (
                      <div>
                        {switcH?  <Calendary id={e.id} data={e.untill} watcher={watcherT} setWatcher={setWatcherT}/>  :  <Popup setWatcher={setWatcherT} watcher={watcherT}/>}    
                         {!e.checkTask &&  <img className={s.calendar} onClick={() =>setSwitch(!switcH) } width="35px" src={calendar}/> }
                         {!e.checkTask && e.untill && dateFormat(e.untill, " dddd, mmmm d") } 
                         {!e.checkTask && e.untill && <span className={s.clear2} onClick={() => clearDate(e.id)}>clear</span>}
                        <div className={s.move}> 
                          {!e.checkTask && <span className={s.move} onClick={() => setMove(!move)}>move to</span>}
                          {!e.checkTask && move &&  <Move taskId={e.id} setWatcher={setWatcherT}/>}
                        </div>
                      </div>
                    ) : null
                  ) : null)}
              </li>}
            </div>
          );
        })}
      </div>                
    </div>
  );
};

export default Todo;
