import { useEffect, useState } from "react";
import s from "./todo.module.css";
import { instance } from "../api/axios.api";
import Popup from "../popup/Popup";
import Calendary from "../calendar/Calendar";
import calendar from "./calendar.png";
import flag from "./flag.png"
import dateFormat from "dateformat";
import { i18n } from "dateformat";
import MyLoader from "../Skeleton/Skeleton";
import preloader from "./preloader.gif"
import done from "./accept.png"
import Move from "../helpers/moving/Move";




const Incoming = () => {
  const [data, setData] = useState([]);
  const [watcher, setWatcher] = useState(false);
  const [addTask, setAddTask] = useState("");
  const [switcH, setSwitch] = useState(false);
  const [popId, setPopId] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [id, setId] = useState("");
  const [li, setLi] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isPreloader, setIsPreloader] = useState(false)
  const [button_id, setButton_id] = useState("")
  const [selectedIds, setSelectedIds] = useState([]);
  const [iconId, setIconId] = useState("")
  const [move, setMove] = useState(false)
  const [category, setCategory] = useState([])


  useEffect(() => {
    localStorage.setItem('currentPage', 4)
    localStorage.removeItem('title')
    instance
      .get(`/transactions/incoming`)
      .then((data) => setData(data.data) & setIsLoading(true) & setIsPreloader(false))

  }, [watcher]);

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
        notes: "",
        checkTask: true,
        inTodo: false,
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
        .then((data) => setWatcher(!watcher));
    }, 250);
  };

  const clearDate = (id) => {
    instance
      .patch(`/transactions/transaction/${id}`, {
        untill: null,
        isDeadLine: false
      })
      .then(() => setWatcher(!watcher));
  }

  const removeMany = () => {
     instance
      .delete("/transactions/delete", {
        data: {ids: selectedIds}
      })
      .then((data) => setWatcher(!watcher))
      .catch(e => console.log(e))
  };

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

  const setDateForPopup = (untill) => {
    return (
        Math.floor((new Date(untill) - new Date()) / (24 * 60 * 60 * 1000)+1) <= 0
        ? null 
        : <span className={s.untillDate}>{dateFormat(untill, " dddd, mmmm d")}</span>
    )
  }

  const setDateForHowManyDaysLeft = (untill) =>{
    return (
        Math.floor((new Date(untill) - new Date()) / (24 * 60 * 60 * 1000)+1) <= 0
         ? untill? "сегодня" : "you can add dead line" 
         : <> осталось дней: {Math.floor((new Date(untill) - new Date()) / (24 * 60 * 60 * 1000)+1)}</>
    )
  }

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
      
    <div className={s.h1}>Входящие задачи</div>
    
    {/* инпут для добавления задачи во "Входящие" */}
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
          onClick={() => addCategory() & setIsPreloader(true)}
        >
          добавить
        </button>
        
        {/* отображение идущего человечка при отправки задачи */}
        {isPreloader && <img src={preloader} width="45px"/>}

        <hr />

         {/* кнопка удаления навсегда, мультиудаление */}
        <span className={!selectedIds.length? s.buttonDeleteForever : s.buttonDeleteForeverStart  } 
                onClick={() => removeMany() &setSelectedIds([])}
                disabled={!selectedIds.length}
                > 
                Удалить навсегда 
        </span>
      {
        isLoading
     ? 
     <div>

        <div className={s.wrapper}>

          {/* метод map, для выставления задач  */}
          {data.map((e) => {
            return (
              <div key={e.id}>

                {/* начало отрисовывания Li-шки */}                
                <li className={li ? (popId == e.id ? s.li : s.li2) : s.li2}>
                  {/* checkbox задачи */}
                  <img className={iconId !== e.id ? s.iconDone : s.iconDone2} 
                       src={done} width="25px"
                       onClick={() => updateStatus(e.id, e.isCheck) & setIconId(e.id)}
                  />

    {/* инпут для выделения множества объектов с последующим удалением */}
                    <input      
                      value={e.id}
                      type="radio"
                      onChange={() => {}}
                      checked={selectedIds.includes(e.id)}
                      onClick={() => handleCheckboxChange(e.id)}
                      className={s.radio}
                     />  

                  {/* title туду листа с сервера а так же установка id Popup */}
                  <span
                    className={e.id !== button_id? s.title : s.titleProcess}
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
                    {/* отображение на какой день назначен дедлайн */}
                 {setDateForMainDiv(e.untill)}
                    {e.title}
                  </span>
  
                  {/* кнопка удаления задачи из туду листа */}
                  {/* <button
                    className={e.id !== button_id ? s.removeButton : s.removeButtonProcess}
                    onClick={() =>removeTask(e.id, e.title, e.createdAd, e.createdAdTime) & setButton_id(e.id)}
                  >
                    x
                  </button> */}
                  <div className={s.fromDate}>from: {dateFormat(e.createdAt, "dd.mm")}</div>
                  
  
                  {/* отображение года и даты в правом углу колонки в зависимости от текущей даты, сложная логика */}
                 {/* {setDateForMainDiv(e.untill)} */}
               
               {/* описание логики при открытии Попапа */}
                  {isPopupOpen &&
                    (isPopupOpen ? (
                      e.id == popId ? (
                        <div className={s.popup}>

                {/* добавлении switch логики при которой будет 
                     отображатьс календарь или Попап */}
                          {switcH
                            ?  <Calendary id={e.id} data={e.untill} watcher={watcher} setWatcher={setWatcher}/>  
                            :  <Popup setWatcher={setWatcher} watcher={watcher}/>
                          } 

                    {/* картинка календаря при раскрытии попапа */}
                         <img className={s.calendar} onClick={() =>setSwitch(!switcH) } width="35px" src={calendar}/> 
                       
                           {/* отображение даты при раскрытии попапа если есть дедлайн */}
                           {setDateForPopup(e.untill)}

                            {/*   кнопка очистки календаря */}
                           {e.untill && <span className={s.clear2} onClick={() => clearDate(e.id)}>clear</span>}

                           <div className={s.move} onClick={() => setMove(!move)}>move to</div>
                          {move && <Move taskId={e.id} setWatcher={setWatcher}/>}

                          {/* отображение сколько дней осталось до дедлайна в самом низу попапа */}
                           <div className={s.left}>
                              {setDateForHowManyDaysLeft(e.untill)}
                           </div>

                        </div>
                        
                      ) : null
                    ) : null)}
                 </li>
              </div>
            );
          })}
          </div>    
        </div>     
      : <span className={s.skeleton}><MyLoader/> </span>
      }
    </div>
  );
};

export default Incoming;
