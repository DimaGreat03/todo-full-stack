import { useEffect, useRef, useState } from "react";
import s from "./Notes.module.css";
import { instance } from "../api/axios.api";
import { useNavigate } from "react-router";

const Notes = () => {
  const [data, setData] = useState([]);
  const [addNote, setAddNote] = useState("");
  const [localWatcher, setLocalWatcher] = useState(false);
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

  return (
    <div className={s.wrapper}>
      <h1>Notes</h1>

      <input value={addNote} onChange={(e) => setAddNote(e.target.value)} />
      <button onClick={() => addNewNote()}>+</button>

      <hr className={s.hr}/>
      {data.map((e) => {
        return (
          <div className={s.divForUl}>
            <ul className={s.ul}>
              <li
                className={s.li}
                onClick={() =>
                  navigate("/opened-notes") &
                  localStorage.setItem("openedNotes", e.letters) &
                  localStorage.setItem("titleNotes", e.title) &
                  localStorage.setItem("noteId", e.id)
                }
              >
               📃 {e.title}
              </li>
            </ul>
          </div>
        );
      })}

    </div>
  );
};

export default Notes;
