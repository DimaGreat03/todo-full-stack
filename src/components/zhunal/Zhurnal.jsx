import { useEffect, useState } from "react";
import s from "./zhurnal.module.css"
import { instance } from "../api/axios.api";
import useSound from "use-sound";
import sound from "./assets/close.mp3";
import dateFormat from "dateformat";
import Popup from "../popup/Popup";


const Zhurnal = () => {
  const [data, setData] = useState([]);
  const [watcher, setWatcher] = useState(false);
  const [switcH, setSwitch] = useState(false);
  const [popId, setPopId] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [li, setLi] = useState(false);
  const [inputId, setInputId] = useState("")
  const [checkInput, setCheckInput] = useState(true)
  const [selectedIds, setSelectedIds] = useState([]);


  const [play] = useSound(sound);

  useEffect(() => {
    localStorage.setItem('currentPage', 2)
    instance
      .get(`/transactions/options?status=false&done=true`)
      .then((data) => setData(data.data) & console.log(data.data));
  }, [watcher]);

  const returnTask = (id, boolean) => {
    setTimeout(() => {
      instance
        .patch(`/transactions/transaction/${id}`, {
          isActive: true,
          isDone: false,
          isCheck: false,
          incomingTask: boolean,
        })
        .then(() => setWatcher(!watcher) & play());

      // instance.patch(`/categories/category/${categoryId}`, {
      //   isActive: true,
      // });
    }, 200);
  };

  const removeMany = () => {
    instance
     .delete("/transactions/delete", {
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

    <h1 className={s.h1}>Журнал</h1>

      <hr />

      <div className={s.wrapper}>
      <span className={!selectedIds.length? s.buttonDeleteForever : s.buttonDeleteForeverStart  } 
                onClick={() => removeMany() &setSelectedIds([])}
                disabled={!selectedIds.length}
                > 
                Удалить навсегда 
        </span>
        {/* метод map, для выставления задач  */}
        {data.map((e) => {
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

             {/* input для выделения объектов с последующим удалением безвозвратно */}
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
                  <div className={s.category}>{e.category? e.category.title : "incoming"} <span className={s.data2Format}> - {dateFormat(e.createdAt, "mm.dd")}</span>
</div>
                </span>

                {/* Кнопка времени */}
                <span
                  className={s.time}
                  onClick={() => setSwitch(!switcH)}
                >
                 <span className={s.dataFormat}> {dateFormat(e.createdAt, "mm.dd")}</span>
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

export default Zhurnal;



















// <div className={s.main}>
    //   <h2 className={s.been}>Журнал выполненных задач</h2>
    //   <hr className={s.hr} />
    //   <div className={s.deletedTasks}>
    //     {tasks.map((e) => {
    //       return (
    //         <div key={e.id} className={s.wrapper}>
    //           <div>
    //             <input
    //               type="checkbox"
    //               checked={e.id !== inputId && checkInput}
    //               onChange={() => e.id == inputId && setChecked(!checkInput)}
    //               onClick={() =>
    //                 setInputId(e.id) & returnTask(e.id, e.category.id)
    //               }
    //             />
    //             <span></span>
    //             <span
    //               onClick={() => {
    //                 setIsPopupOpen(!isPopupOpen);
    //                 setPopId(e.id);
    //                 localStorage.setItem("popupId", e.id);
    //               }}
    //             >
    //               {e.title}
    //             </span>
    //             <button
    //               className={s.deleteButton}
    //               onClick={() => deleteTask(e.id)}
    //             >
    //               X
    //             </button>
    //             <span className={s.time}>
    //               {e.createdAd} -- {e.createdAdTime}
    //             </span>
    //             {isPopupOpen &&
    //               (isPopupOpen ? (
    //                 e.id == popId ? (
    //                   <div>
    //                     <PopupWithoutInput />
    //                   </div>
    //                 ) : null
    //               ) : null)}
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
