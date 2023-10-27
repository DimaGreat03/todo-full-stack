import { useEffect } from "react";
import s from "./popup.module.css";
import { instance } from "../api/axios.api";
import { useState, useRef } from "react";
import iconEdit from "./edit.png"
import DeepPopup from "../deepPopup/DeepPopup";
import SmallSkeleton from "../Skeleton/SkeletonSmall";
import loadingPopup from "./loadingPopup.gif"
import haveIcon from "./book.png"



const Popup = ({setWatcher, watcher}) => {
  const [data, setData] = useState([]);
  const [addPopupTask, setAppPopupTask] = useState("");
  const [localWatcher, setLocalWatcher] = useState(false);
  const [edit, setEdit] = useState(false);
  const [popId, setPopId] = useState("")
  const [title, setTitle] = useState("")
  const [deepPopup, setDeepPopup] = useState(false)
  const [deepPopupId, setDeepPopupId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [preloader, setPreloader] = useState(true)
  const [button_id, setButton_id] = useState("")


  // let day = new Date().toISOString().slice(0, 10).split("-").reverse().join(".");
  // let time = new Date().toLocaleTimeString();

  // для textarea стили
  const [value, setValue] = useState(localStorage.getItem("text"));
  const textareaRef = useRef(null);
  // что бы мог растягиваться по длине value

  useEffect(() => {
    instance
      .get(`/popup/${localStorage.getItem("popId")}`)
      .then((data) => setData(data.data) & setIsLoading(false));
    
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [localWatcher, value]);

  const addPopup = () => {
    instance
      .post("/popup/", {
        title: addPopupTask,
        transaction: localStorage.getItem("popId"),
        isCheck: false,
        // createdAd: day,
        // createdAdTime: time,
        notes: ""
      })
      .then(() => setLocalWatcher(!localWatcher) & setPreloader(true));
  };

  const removePopup = (id) => {
    instance.delete(`/popup/${id}`).then(() => setLocalWatcher(!localWatcher));
  };

  const updateStatus = (id, status) => {
    instance
      .patch(`/popup/${id}`, {
        isCheck: !status,
      })
      .then(() => setLocalWatcher(!localWatcher));
  };

  const updateNotes = (id) => {
    instance
      .patch(`/transactions/transaction/${localStorage.getItem("popId")}`, {
        notes: value,
      })
      .then(() => setWatcher(!watcher))
  };

  const updateTitle = (id) => {
    instance
      .patch(`/popup/${id}`, {
        title: title,
      })
      .then(() => setLocalWatcher(!localWatcher));
  };




  return (
    <div className={s.wrapper}>
      <div>
      <textarea
         placeholder="notes"
         className={s.textarea}
         ref={textareaRef}
         style={{ height: 'auto', resize: 'none' }}
         value={value}
         onChange={(e) => setValue(e.target.value)}
         onBlur={() => updateNotes()}
    />
      </div>
      <input
        className={s.inputA}
        placeholder="добавь под/задачу"
        value={addPopupTask}
        onChange={(e) => setAppPopupTask(e.target.value)}
      />
      <button className={s.addPopup} onClick={() => addPopup() & setPreloader(false) & setAppPopupTask("")} disabled={addPopupTask == ""}>Let's go</button>

    {
     preloader? null : <span className={s.loadingPopup}> <img src={loadingPopup} width="25px"/> </span>
    } 

    {
      isLoading
      ? <SmallSkeleton/>
      :  data.length !== 0 ? (
        data.map((e) => {
          return (
            <div key={e.id}>
              {
                popId == e.id && edit
                ? <span>
                    <input className={s.editInput} value={title} onChange={(e) => setTitle(e.target.value)}/> 
                    <button className={s.buttonDone} onClick={() => setEdit(false) & updateTitle(e.id)}>Done</button>
                  </span> 
                : <ul className={s.ul}>
                     <li className={s.li}>
                       <input
                        className={s.input}
                        type="checkbox"
                        checked={e.isCheck}
                        onChange={() => {}}
                        onClick={() => updateStatus(e.id, e.isCheck)}
                      />
                     <span className={e.id !== button_id? s.popupButton : s.popupButtonProcess} onClick={() => removePopup(e.id) & setButton_id(e.id)}> X </span>
                     <img className={s.iconEdit} src={iconEdit} width="25px" onClick={() => setEdit(true) & setPopId(e.id) & setTitle(e.title)} />
                     <span className={e.isCheck? s.titleProcess : undefined} onClick={() => setDeepPopup(!deepPopup) & setDeepPopupId(e.id) & localStorage.setItem("deepNotes", e.notes) & localStorage.setItem("deepId", e.id)}> {e.title} {e.notes !== "" && <img src={haveIcon} className={e.isCheck? s.glas :s.glasActive}/>} </span>
                     </li>
                     </ul>
                     
              }
              {
                deepPopup? 
                (deepPopupId == e.id? <DeepPopup setLocalWatcher={setLocalWatcher} localWatcher={localWatcher} /> 
                    : undefined ) 
                    : undefined
                }
               <hr className={s.hr}/>
            </div>
          );
        })
      ) : (
        <div className={s.li}>   </div>
      )}
    </div>
  );
};

export default Popup;
