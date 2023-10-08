import { useEffect, useState } from "react";
import s from "./DeadLine.module.css";
import { instance } from "../api/axios.api";
import Popup from "../popup/Popup";
import Calendary from "../calendar/Calendar";
import calendar from "../todolist/calendar.png"
import dateFormat from "dateformat";


const DeadLine = () => {
  const [data, setData] = useState([]);
  const [watcher, setWatcher] = useState(false);
  const [switcH, setSwitch] = useState(false);
  const [popId, setPopId] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [li, setLi] = useState(false);
  const [inDay, setInDay] = useState("")
  const year = dateFormat(new Date(), "yyyy")

  useEffect(() => {
    instance
      .get(`/transactions`)
      .then((data) => setData(data.data) & console.log(data.data));
  }, [watcher]);

  const checkDate = (day) => {
    const currentDate = new Date();
    const otherDate = new Date(day);
    const diffInMilliseconds = otherDate.getTime() - currentDate.getTime();
    const millisecondsInDay = 24 * 60 * 60 * 1000; // Количество миллисекунд в одном дне
    const diffInDays = Math.floor(diffInMilliseconds / millisecondsInDay);
    setInDay(diffInDays +1)
  }

  const updateStatus = (id, isCheck) => {
    setTimeout(() => {
      instance
        .patch(`/transactions/transaction/${id}`, {
          isCheck: !isCheck,
          isActive: false,
          isDone: true,
        })
        .then((data) => setWatcher(!watcher));
    }, 250);
  };

  const removeTask = (id, title, day, time) => {
    instance
      .patch(`/transactions/transaction/${id}`, {
        isActive: false,
        incomingTask: false,
      })
      .then((data) => setWatcher(!watcher));
  };


  const setDayOfWeeksToMainDiv = (untill) => {
    return (
      Math.floor((new Date(untill) - new Date()) / (24 * 60 * 60 * 1000)+1) <= 0
       ? null
       : <span>{dateFormat(untill, "dddd -") }</span>
    )
  }

  const setHowManyDaysLeft = (untill) => {
    return (
      Math.floor((new Date(untill) - new Date()) / (24 * 60 * 60 * 1000)+1) <= 0
       ? <span> сегодня </span>
       : <>  осталось дней: {Math.floor((new Date(untill) - new Date()) / (24 * 60 * 60 * 1000)+1)}</>
    )
  }


  return (
    <div>

       <h1 className={s.h1}> Календарь </h1>

      <hr />

      <div className={s.wrapper}>
        
        {/* метод map, для выставления задач  */}
        {data.map((e) => {

          return (
            <div>
              <span className={s.untillDay}>

                 {/* установка дня недели в дедлайне */}
                {setDayOfWeeksToMainDiv(e.untill)}

                 {/* отображение как много дней отсалось до дедлайна */}
                 {setHowManyDaysLeft(e.untill)}
              </span>

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
                  <span className={s.untill}>  
                      {Math.floor((new Date(e.untill) - new Date()) / (24 * 60 * 60 * 1000)+1) <= 0? "сегодня" : e.untill !== null? year !== dateFormat(e.untill, "yyyy")? dateFormat(e.untill, "yyyy") : dateFormat(e.untill, "mmmm d"): null }
                  </span>
                  
                  {/* отрисовка TITLE из полученного массива */}
                <span
                  className={s.title}
                  onClick={() => {
                    setLi(!li);
                    setPopId(e.id);
                    setIsPopupOpen(!isPopupOpen);
                    localStorage.setItem("popId", e.id);
                    localStorage.setItem('text', e.notes)
                    checkDate(e.untill)
                    setSwitch(false)
                  }}
                >
                  {e.title} 
                </span>

                {/* кнопка удаления задачи из туду листа */}
                <button className={s.removeButton} onClick={() =>removeTask(e.id, e.title, e.createdAd, e.createdAdTime)}>
                  x
                </button>

                {/* отображение категории к которой принадлежит задача */}
                <div className={s.category}> {e.category? e.category.title : "incoming"}</div>

                {/* выдвижная навигация для Popup и сложный css для выделения фона при нажатии */}
                {isPopupOpen &&
                  (isPopupOpen ? (
                    e.id == popId ? (
                    
                      <div>
                        {switcH? <Calendary id={e.id} data={e.untill} watcher={watcher} setWatcher={setWatcher}/> :  <Popup setWatcher={setWatcher} watcher={watcher}/>}    
                         <img className={s.calendar} onClick={() =>setSwitch(!switcH) } width="35px" src={calendar}/>
                         
                         {/* дублирование сколько осталось дней до дедлайна */}
                          {setHowManyDaysLeft(e.untill)}
                      </div>
                    ) : null
                  ) : null)
                }
                  
              </li>
                <hr className={s.line}/>
            </div>
          );
        })}
      </div>                
    </div>
  );
};

export default DeadLine;

