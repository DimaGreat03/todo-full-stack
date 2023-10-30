import { useEffect, useRef, useState } from "react";
import s from "./Notes.module.css";
import { instance } from "../api/axios.api";
import { useNavigate } from "react-router";

const Notes = () => {
  const [data, setData] = useState([]);
  const [addNote, setAddNote] = useState("");
  const [localWatcher, setLocalWatcher] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    instance.get("/notes").then((data) => {
      setData(data.data);
      console.log(data);
    });
  }, [localWatcher]);

  const addNewNote = () => {
    instance
      .post("/notes/", {
        title: addNote,
        letters: "new one",
      })
      .then(() => setLocalWatcher(!localWatcher));
  };

  const removeMany = () => {
    instance
     .delete("/notes/delete", {
       data: {ids: selectedIds}
     })
     .then((data) => setLocalWatcher(!localWatcher))
     .catch(e => console.log(e))
 };

 function handleCheckboxChange(id) {

  if(selectedIds.includes(id)) {
    let newOne = selectedIds.filter(e => e !== id)
    setSelectedIds(newOne)
  } else {
    selectedIds.push(id)
  }
  setLocalWatcher(!localWatcher)
}


  return (
    <div className={s.wrapper}>
      <h1 className={s.h1}>Notes</h1>

      <input className={s.input} value={addNote} onChange={(e) => setAddNote(e.target.value)} />
      <button className={s.button} onClick={() => addNewNote() & setAddNote("")}>+</button>

      <hr className={s.hr} />

        {/* кнопка для мультиудаления */}
      <span className={!selectedIds.length? s.buttonDeleteForever : s.buttonDeleteForeverStart  } 
            onClick={() => removeMany() & setSelectedIds([])}
            disabled={!selectedIds.length}
      > 
          Удалить навсегда 
      </span>

      {data.map((e) => {
        return (
          <div className={s.divForUl}>
            
            <ul className={s.ul}>
              <li
                className={s.li}
              >
       {/* инпут для выделения множества объектов с последующим удалением */}
               <input  
                  className={s.multyInput}   
                  value={e.id}
                  type="checkbox"
                  onChange={() => {}}
                  checked={selectedIds.includes(e.id)}
                  onClick={() => handleCheckboxChange(e.id)}
               />    
               <span 
                  onClick={() =>
                  navigate("/opened-notes") &
                  localStorage.setItem("openedNotes", e.letters) &
                  localStorage.setItem("titleNotes", e.title) &
                  localStorage.setItem("noteId", e.id)
                }>
                  📃 {e.title} 
              </span>
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Notes;
